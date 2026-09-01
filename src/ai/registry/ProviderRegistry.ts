/**
 * ProviderRegistry manages AI provider registration, lookup, and availability.
 *
 * The registry is responsible for:
 * - Registering providers
 * - Unregistering providers
 * - Retrieving providers by ID
 * - Listing all providers
 * - Finding available/healthy providers
 *
 * This is distinct from model management:
 * - Provider = WHERE does AI execution happen? (Ollama, LM Studio, OpenAI, etc.)
 * - Model = WHICH model is being executed? (llama2, mistral, gpt-4, etc.)
 */

import type { IAIProvider } from '../providers/IAIProvider';

export class ProviderRegistry {
  private providers: Map<string, IAIProvider> = new Map();

  /**
   * Register a provider.
   * If a provider with the same ID exists, it will be replaced.
   */
  register(provider: IAIProvider): void {
    this.providers.set(provider.id, provider);
  }

  /**
   * Unregister a provider by ID.
   * Returns true if a provider was removed, false if it didn't exist.
   */
  unregister(providerId: string): boolean {
    return this.providers.delete(providerId);
  }

  /**
   * Get a provider by ID.
   * Returns undefined if the provider is not registered.
   */
  get(providerId: string): IAIProvider | undefined {
    return this.providers.get(providerId);
  }

  /**
   * Get all registered providers.
   */
  getAll(): IAIProvider[] {
    return Array.from(this.providers.values());
  }

  /**
   * Check if a provider is registered.
   */
  has(providerId: string): boolean {
    return this.providers.has(providerId);
  }

  /**
   * Get provider IDs in order.
   */
  getProviderIds(): string[] {
    return Array.from(this.providers.keys());
  }

  /**
   * Find all healthy providers.
   * Queries the health status of all providers and returns those that are healthy.
   */
  async findHealthyProviders(): Promise<IAIProvider[]> {
    const results = await Promise.allSettled(
      Array.from(this.providers.values()).map(async (provider) => {
        const health = await provider.getHealth();
        return { provider, health };
      }),
    );

    return results
      .filter((result) => result.status === 'fulfilled' && result.value.health.status === 'healthy')
      .map((result) => (result as PromiseFulfilledResult<{ provider: IAIProvider }>).value.provider);
  }

  /**
   * Clear all providers.
   */
  clear(): void {
    this.providers.clear();
  }
}

/**
 * Global provider registry instance.
 * This is the single source of truth for provider registration.
 */
export const providerRegistry = new ProviderRegistry();
