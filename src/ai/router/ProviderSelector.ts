import { AIConfig } from '../config/AIConfig';
import type { ProviderCapabilities, ProviderConfig, ProviderTaskType } from '../config/ProviderConfig';

export interface ProviderSelectionOptions {
  preferredProvider?: string;
  taskType?: ProviderTaskType;
  requiredCapabilities?: Partial<ProviderCapabilities>;
}

export class ProviderSelector {
  private readonly config: AIConfig;

  constructor(config: AIConfig) {
    this.config = config;
  }

  select(options: ProviderSelectionOptions = {}): ProviderConfig | undefined {
    const enabledProviders = this.config.getEnabledProviders();
    if (enabledProviders.length === 0) {
      return undefined;
    }

    const requestedTask = options.taskType ?? 'chat';
    const capabilityKey = requestedTask === 'coding'
      ? 'coding'
      : requestedTask === 'reasoning'
        ? 'reasoning'
        : requestedTask === 'vision'
          ? 'vision'
          : 'chat';

    const candidates = enabledProviders.filter((provider) => {
      if (options.preferredProvider && provider.id !== options.preferredProvider) {
        return false;
      }

      const requiredCapabilities = options.requiredCapabilities ?? {};
      const capabilityEntries = Object.entries(requiredCapabilities) as Array<[keyof ProviderCapabilities, boolean]>;

      return capabilityEntries.every(([capability, isRequired]) => {
        if (!isRequired) {
          return true;
        }

        return Boolean(provider.capabilities[capability]);
      }) && (provider.capabilities[capabilityKey] || provider.capabilities.chat);
    });

    if (candidates.length === 0) {
      return enabledProviders.sort((a, b) => b.priority - a.priority)[0];
    }

    return candidates.sort((a, b) => b.priority - a.priority)[0];
  }
}
