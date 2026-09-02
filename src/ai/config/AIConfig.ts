import { resolveProviderConfig, SUPPORTED_PROVIDER_DEFINITIONS, type ProviderConfig } from './ProviderConfig';

export class AIConfig {
  readonly preferredProvider: string;
  readonly providers: ProviderConfig[];

  constructor(preferredProvider: string, providers: ProviderConfig[]) {
    this.preferredProvider = preferredProvider;
    this.providers = providers;
  }

  static fromEnv(env: Record<string, string | undefined> = process.env as Record<string, string | undefined>): AIConfig {
    const providers = SUPPORTED_PROVIDER_DEFINITIONS.map((definition) => resolveProviderConfig(definition.id, env));
    const preferredProvider =
      env.KONDA_DEFAULT_PROVIDER ??
      providers.filter((provider) => provider.enabled && provider.id !== 'ollama').sort((a, b) => b.priority - a.priority)[0]?.id ??
      providers.find((provider) => provider.id === 'ollama')?.id ??
      providers[0]?.id ??
      'openai';

    return new AIConfig(preferredProvider, providers);
  }

  static createDefault(env: Record<string, string | undefined> = process.env as Record<string, string | undefined>): AIConfig {
    return AIConfig.fromEnv(env);
  }

  getEnabledProviders(): ProviderConfig[] {
    return this.providers.filter((provider) => provider.enabled);
  }

  getProvider(providerId: string): ProviderConfig | undefined {
    return this.providers.find((provider) => provider.id === providerId);
  }

  toSafeLog(): {
    preferredProvider: string;
    providers: Array<
      Omit<ProviderConfig, 'apiKey'> & {
        apiKey: string;
      }
    >;
  } {
    return {
      preferredProvider: this.preferredProvider,
      providers: this.providers.map((provider) => ({
        ...provider,
        apiKey: provider.apiKey ? '[redacted]' : '',
      })),
    };
  }
}

export const loadAIConfig = (
  env: Record<string, string | undefined> = process.env as Record<string, string | undefined>,
): AIConfig => AIConfig.fromEnv(env);
