import { AIConfig } from '../config/AIConfig';
import type { ProviderConfig } from '../config/ProviderConfig';
import { ProviderSelector, type ProviderSelectionOptions } from './ProviderSelector';

export interface SmartRouteDecision {
  provider?: ProviderConfig;
  providerId?: string;
  reason: string;
  fallbackProviders: string[];
}

export class SmartRouter {
  private readonly config: AIConfig;
  private readonly selector: ProviderSelector;

  constructor(config: AIConfig) {
    this.config = config;
    this.selector = new ProviderSelector(this.config);
  }

  route(options: ProviderSelectionOptions = {}): SmartRouteDecision {
    const provider = this.selector.select(options);
    const fallbackProviders = this.config
      .getEnabledProviders()
      .filter((candidate) => candidate.id !== provider?.id)
      .sort((a, b) => b.priority - a.priority)
      .map((candidate) => candidate.id);

    if (!provider) {
      return {
        reason: 'No enabled providers are configured. Add a valid API key or enable a local provider.',
        fallbackProviders,
      };
    }

    return {
      provider,
      providerId: provider.id,
      reason: `Selected ${provider.displayName} based on the configured priority and task requirements.`,
      fallbackProviders,
    };
  }
}
