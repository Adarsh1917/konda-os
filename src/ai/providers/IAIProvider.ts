/**
 * Provider abstraction layer.
 * Defines the contract that all AI providers must implement.
 *
 * This abstraction decouples the application from specific provider implementations
 * and allows providers to be swapped or extended without changing application code.
 */

import type { AIGenerationRequest, AIGenerationResponse, AIModel, AIProviderHealth } from '../../core/ai/types';

/**
 * IAIProvider is the contract that all AI provider implementations must follow.
 *
 * A provider is responsible for:
 * - Managing connection to an AI backend (local or remote)
 * - Executing text generation requests
 * - Providing health status
 * - Listing available models
 *
 * Providers should NOT:
 * - Implement retry logic (that's the responsibility of the reliability layer)
 * - Manage model selection (that's the responsibility of the application/orchestrator)
 * - Implement timeout management (that's the responsibility of the reliability layer)
 */
export interface IAIProvider {
  /**
   * Unique identifier for this provider (e.g., "ollama", "lmstudio", "openai")
   */
  id: string;

  /**
   * Get the health/status of this provider.
   */
  getHealth(): Promise<AIProviderHealth>;

  /**
   * List all models available in this provider.
   */
  listModels(): Promise<AIModel[]>;

  /**
   * Generate text using the specified model and request.
   */
  generate(request: AIGenerationRequest): Promise<AIGenerationResponse>;
}
