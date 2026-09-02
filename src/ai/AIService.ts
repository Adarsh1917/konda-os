/**
 * AIService is the primary application-facing interface for AI operations.
 * It abstracts away the underlying provider and model selection logic.
 */

import type { AIGenerationRequest, AIGenerationResponse, AIModel, AIProviderHealth } from '../core/ai/types';
import { providerRegistry, ProviderRegistry } from './registry/ProviderRegistry';
import type { UnifiedAIGateway } from './services/UnifiedAIGateway';

export interface IAIService {
  /**
   * Get the health status of the AI system.
   */
  getHealth(): Promise<AIProviderHealth>;

  /**
   * List available models.
   */
  listModels(): Promise<AIModel[]>;

  /**
   * Generate text based on the provided request.
   */
  generate(request: AIGenerationRequest): Promise<AIGenerationResponse>;

  /**
   * Get the currently selected provider.
   */
  getSelectedProvider(): string;

  /**
   * Get the currently selected model.
   */
  getSelectedModel(): string;

  /**
   * Set the selected provider.
   */
  setSelectedProvider(providerId: string): void;

  /**
   * Set the selected model.
   */
  setSelectedModel(model: string): void;
}

/**
 * Default AIService implementation that delegates to providers.
 */
export class AIService implements IAIService {
  private selectedProvider: string = 'ollama';
  private selectedModel: string = 'llama2';
  private registry: ProviderRegistry;
  private readonly gateway?: UnifiedAIGateway;

  constructor(registry?: ProviderRegistry, gateway?: UnifiedAIGateway) {
    // Allow dependency injection for testing
    this.registry = registry || providerRegistry;
    this.gateway = gateway;
  }

  async getHealth(): Promise<AIProviderHealth> {
    const provider = this.registry.get(this.selectedProvider);
    if (!provider) {
      return {
        status: 'unhealthy',
        message: `Provider '${this.selectedProvider}' not registered`,
        timestamp: Date.now(),
      };
    }

    return provider.getHealth();
  }

  async listModels(): Promise<AIModel[]> {
    const provider = this.registry.get(this.selectedProvider);
    if (!provider) {
      return [];
    }

    return provider.listModels();
  }

  async generate(request: AIGenerationRequest): Promise<AIGenerationResponse> {
    if (this.gateway) {
      return this.gateway.generate(request);
    }

    const provider = this.registry.get(this.selectedProvider);
    if (!provider) {
      throw new Error(`Provider '${this.selectedProvider}' not registered`);
    }

    // Ensure the request uses the selected model if not explicitly specified
    if (!request.model) {
      request.model = this.selectedModel;
    }

    return provider.generate(request);
  }

  getSelectedProvider(): string {
    return this.selectedProvider;
  }

  getSelectedModel(): string {
    return this.selectedModel;
  }

  setSelectedProvider(providerId: string): void {
    if (!this.registry.has(providerId)) {
      throw new Error(`Provider '${providerId}' is not registered`);
    }
    this.selectedProvider = providerId;
  }

  setSelectedModel(model: string): void {
    this.selectedModel = model;
  }
}
