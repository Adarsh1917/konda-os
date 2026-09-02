import type { AIModel } from '../../core/ai/types';
import type { ProviderHealthManager } from '../reliability/ProviderHealthManager';
import { ProviderHealthManager as DefaultProviderHealthManager } from '../reliability/ProviderHealthManager';
import { providerRegistry, type ProviderRegistry } from '../registry/ProviderRegistry';
import { AIConfig } from '../config/AIConfig';
import type { ProviderCapabilities, ProviderConfig } from '../config/ProviderConfig';
import type { ProviderSelectionOptions } from './ProviderSelector';
import { providerCapabilitiesToModelCapabilities } from '../providers/base/ProviderAdapter';

export type SmartTaskIntent = 'FAST' | 'REASONING' | 'CREATIVE' | 'CODE' | 'GENERAL';
export type SmartSpeedPreference = 'fast' | 'balanced' | 'reasoning';

export interface SmartRouterRequest extends ProviderSelectionOptions {
  taskIntent?: SmartTaskIntent;
  speedPreference?: SmartSpeedPreference;
  preferredModel?: string;
}

export interface SmartRouteCandidate {
  providerId: string;
  providerName: string;
  modelId: string;
  modelName: string;
  score: number;
  health: 'healthy' | 'unknown' | 'unhealthy';
}

export interface SmartRoutingError {
  code: 'NO_CANDIDATES';
  message: string;
}

export interface SmartRouteDecision {
  /** Safe provider metadata; credentials are intentionally excluded. */
  provider?: Omit<ProviderConfig, 'apiKey'>;
  providerId?: string;
  modelId?: string;
  reason: string;
  fallbackProviders: string[];
  candidates: SmartRouteCandidate[];
  error?: SmartRoutingError;
}

export interface SmartRouterOptions {
  registry?: ProviderRegistry;
  healthManager?: ProviderHealthManager;
  /** Model metadata obtained by the application and kept outside the router. */
  models?: AIModel[];
}

interface RoutingCandidate {
  provider: ProviderConfig;
  model: AIModel;
  health: SmartRouteCandidate['health'];
  score: number;
  providerOrder: number;
  modelOrder: number;
}

function safeProvider(provider: ProviderConfig): Omit<ProviderConfig, 'apiKey'> {
  const { apiKey: _apiKey, ...safe } = provider;
  return safe;
}

function capabilityForIntent(intent: SmartTaskIntent): keyof ProviderCapabilities | undefined {
  switch (intent) {
    case 'CODE':
      return 'coding';
    case 'REASONING':
      return 'reasoning';
    case 'GENERAL':
    case 'CREATIVE':
    case 'FAST':
      return 'chat';
    default:
      return undefined;
  }
}

function modelSupports(model: AIModel, intent: SmartTaskIntent): boolean {
  const capability = capabilityForIntent(intent);
  if (!capability) {
    return true;
  }

  const modelCapabilities = model.capabilities.map((value) => value.toLowerCase());
  return modelCapabilities.includes(capability) || (capability === 'coding' && modelCapabilities.includes('code'));
}

export class SmartRouter {
  private readonly config: AIConfig;
  private readonly registry: ProviderRegistry;
  private readonly healthManager: ProviderHealthManager;
  private readonly models?: AIModel[];

  constructor(config: AIConfig, options: SmartRouterOptions = {}) {
    this.config = config;
    this.registry = options.registry ?? providerRegistry;
    this.healthManager = options.healthManager ?? new DefaultProviderHealthManager(this.registry);
    this.models = options.models;
  }

  route(options: SmartRouterRequest = {}): SmartRouteDecision {
    const intent = options.taskIntent ?? this.intentFromTask(options.taskType);
    const requestedCapability = capabilityForIntent(intent);
    const configuredProviders = this.config.getEnabledProviders();
    const candidates = this.collectCandidates(configuredProviders, options, intent, requestedCapability);
    const eligible = this.excludeUnhealthyWhenAlternativesExist(candidates);
    const sorted = eligible.sort((a, b) => this.compareCandidates(a, b, options, intent));
    const publicCandidates = sorted.map((candidate) => this.toPublicCandidate(candidate));
    const selected = sorted[0];
    const fallbackProviders = sorted.slice(1).map((candidate) => candidate.provider.id);

    if (!selected) {
      const error: SmartRoutingError = {
        code: 'NO_CANDIDATES',
        message: 'No enabled provider/model candidates satisfy the routing request.',
      };
      return {
        reason: error.message,
        fallbackProviders: [],
        candidates: [],
        error,
      };
    }

    return {
      provider: safeProvider(selected.provider),
      providerId: selected.provider.id,
      modelId: selected.model.id,
      reason: `Selected ${selected.provider.displayName}/${selected.model.id} for ${intent} routing.`,
      fallbackProviders,
      candidates: publicCandidates,
    };
  }

  private collectCandidates(
    providers: ProviderConfig[],
    options: SmartRouterRequest,
    intent: SmartTaskIntent,
    requestedCapability: keyof ProviderCapabilities | undefined,
  ): RoutingCandidate[] {
    const modelsByProvider = new Map<string, AIModel[]>();
    this.models?.forEach((model) => {
      if (model.enabled && model.installed) {
        const existing = modelsByProvider.get(model.provider) ?? [];
        existing.push(model);
        modelsByProvider.set(model.provider, existing);
      }
    });

    return providers.flatMap((provider, providerOrder) => {
      if (options.preferredProvider && provider.id !== options.preferredProvider) {
        return [];
      }
      if (options.requiredCapabilities && !this.hasRequiredCapabilities(provider.capabilities, options.requiredCapabilities)) {
        return [];
      }
      if (requestedCapability && !provider.capabilities[requestedCapability]) {
        return [];
      }
      if (!this.registry.has(provider.id) && this.models) {
        return [];
      }

      const models = modelsByProvider.get(provider.id) ?? [{
        id: provider.defaultModel,
        name: provider.defaultModel,
        provider: provider.id,
        capabilities: providerCapabilitiesToModelCapabilities(provider),
        installed: true,
        enabled: true,
      }];

      return models
        .filter((model) => modelSupports(model, intent))
        .map((model, modelOrder) => ({
          provider,
          model,
          health: this.healthManager.getProviderHealth(provider.id)?.status ?? 'unknown',
          score: 0,
          providerOrder,
          modelOrder,
        }));
    });
  }

  private excludeUnhealthyWhenAlternativesExist(candidates: RoutingCandidate[]): RoutingCandidate[] {
    const hasNonUnhealthy = candidates.some((candidate) => candidate.health !== 'unhealthy');
    return hasNonUnhealthy ? candidates.filter((candidate) => candidate.health !== 'unhealthy') : candidates;
  }

  private compareCandidates(
    left: RoutingCandidate,
    right: RoutingCandidate,
    options: SmartRouterRequest,
    intent: SmartTaskIntent,
  ): number {
    const score = (candidate: RoutingCandidate): number => {
      let value = candidate.provider.priority * 10;
      if (candidate.health === 'healthy') value += 10_000;
      if (candidate.provider.id === this.config.preferredProvider) value += 1_000;
      if (candidate.model.id === options.preferredModel) value += 500;
      if (candidate.model.id === candidate.provider.defaultModel) value += 100;
      if (intent === 'FAST' || options.speedPreference === 'fast') value -= candidate.provider.requestTimeout / 1_000;
      if (intent === 'REASONING' || options.speedPreference === 'reasoning') {
        value += candidate.model.capabilities.includes('reasoning') ? 200 : 0;
      }
      return value;
    };
    left.score = score(left);
    right.score = score(right);
    return right.score - left.score
      || left.providerOrder - right.providerOrder
      || left.modelOrder - right.modelOrder
      || left.model.id.localeCompare(right.model.id);
  }

  private toPublicCandidate(candidate: RoutingCandidate): SmartRouteCandidate {
    return {
      providerId: candidate.provider.id,
      providerName: candidate.provider.displayName,
      modelId: candidate.model.id,
      modelName: candidate.model.name,
      score: candidate.score,
      health: candidate.health,
    };
  }

  private intentFromTask(taskType: ProviderSelectionOptions['taskType']): SmartTaskIntent {
    switch (taskType) {
      case 'coding':
        return 'CODE';
      case 'reasoning':
        return 'REASONING';
      default:
        return 'GENERAL';
    }
  }

  private hasRequiredCapabilities(
    capabilities: ProviderCapabilities,
    required: Partial<ProviderCapabilities>,
  ): boolean {
    return (Object.entries(required) as Array<[keyof ProviderCapabilities, boolean]>)
      .every(([capability, isRequired]) => !isRequired || capabilities[capability]);
  }
}
