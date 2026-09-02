import type { AIGenerationRequest, AIGenerationResponse } from '../../core/ai/types';
import { classifyAIError, type AIErrorCategory, type AIErrorInfo } from '../reliability/AIErrorModel';
import { RetryBackoffEngine } from '../reliability/RetryBackoffEngine';
import { providerRegistry, type ProviderRegistry } from '../registry/ProviderRegistry';
import { AIConfig } from '../config/AIConfig';
import { SmartRouter, type SmartRouterRequest } from '../router/SmartRouter';

export interface UnifiedAIGatewayRequest extends AIGenerationRequest {
  routing?: SmartRouterRequest;
}

export interface UnifiedAIGatewayOptions {
  router?: Pick<SmartRouter, 'route'>;
  registry?: ProviderRegistry;
  retryEngine?: RetryExecutor;
  classifyError?: (error: unknown) => AIErrorInfo;
  now?: () => number;
}

export interface RetryExecutor {
  execute<T>(operation: () => Promise<T>): Promise<T>;
}

export interface UnifiedAIGatewayErrorInfo {
  category: AIErrorCategory;
  message: string;
  retryable: boolean;
  timestamp: number;
}

const SAFE_ROUTING_ERROR_MESSAGE = 'AI routing failed: no suitable provider or model is available.';

export class UnifiedAIGatewayError extends Error {
  readonly info: UnifiedAIGatewayErrorInfo;

  constructor(info: UnifiedAIGatewayErrorInfo) {
    super(info.message);
    this.name = 'UnifiedAIGatewayError';
    this.info = info;
  }
}

export class UnifiedAIGateway {
  private readonly router: Pick<SmartRouter, 'route'>;
  private readonly registry: ProviderRegistry;
  private readonly retryEngine: RetryExecutor;
  private readonly classifyError: (error: unknown) => AIErrorInfo;
  private readonly now: () => number;

  constructor(options: UnifiedAIGatewayOptions = {}) {
    this.registry = options.registry ?? providerRegistry;
    this.router = options.router ?? new SmartRouter(AIConfig.createDefault(), { registry: this.registry });
    this.retryEngine = options.retryEngine ?? new RetryBackoffEngine();
    this.classifyError = options.classifyError ?? classifyAIError;
    this.now = options.now ?? Date.now;
  }

  async generate(request: UnifiedAIGatewayRequest): Promise<AIGenerationResponse> {
    const routeOptions: SmartRouterRequest = {
      ...request.routing,
      preferredModel: request.routing?.preferredModel ?? request.model,
    };
    const decision = this.router.route(routeOptions);

    if (decision.error || decision.candidates.length === 0) {
      throw new UnifiedAIGatewayError({
        category: 'routing_failure',
        message: SAFE_ROUTING_ERROR_MESSAGE,
        retryable: false,
        timestamp: this.now(),
      });
    }

    let lastFailure: UnifiedAIGatewayErrorInfo | undefined;
    for (const candidate of decision.candidates) {
      const provider = this.registry.get(candidate.providerId);
      if (!provider) {
        lastFailure = this.failureInfo('provider_unavailable', 'Selected AI provider is not registered.', false);
        continue;
      }

      try {
        const response = await this.retryEngine.execute(() =>
          provider.generate({ ...request, model: candidate.modelId }),
        );
        return {
          ...response,
          provider: candidate.providerId,
          model: candidate.modelId,
        };
      } catch (error) {
        const classified = this.classifyError(error);
        lastFailure = this.failureInfo(classified.category, this.safeMessage(classified.category), classified.retryable);
      }
    }

    throw new UnifiedAIGatewayError(
      lastFailure ?? this.failureInfo('provider_unavailable', 'All AI providers failed to generate a response.', false),
    );
  }

  private failureInfo(category: AIErrorCategory, message: string, retryable: boolean): UnifiedAIGatewayErrorInfo {
    return { category, message, retryable, timestamp: this.now() };
  }

  private safeMessage(category: AIErrorCategory): string {
    switch (category) {
      case 'authentication_error':
        return 'AI provider authentication failed.';
      case 'rate_limit':
        return 'AI provider rate limit exceeded.';
      case 'timeout':
        return 'AI request timed out.';
      case 'connection_error':
        return 'Failed to connect to AI provider.';
      case 'model_not_found':
        return 'Requested AI model was not found.';
      case 'invalid_request':
        return 'Invalid request to AI provider.';
      case 'provider_unavailable':
        return 'AI provider is unavailable.';
      case 'provider_error':
        return 'AI provider error.';
      case 'routing_failure':
        return 'AI routing failed.';
      default:
        return 'AI generation failed.';
    }
  }
}
