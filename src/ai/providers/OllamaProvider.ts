/**
 * OllamaProvider adapts OllamaService to implement the IAIProvider interface.
 *
 * This adapter allows Ollama to be used interchangeably with other AI providers
 * without the rest of the application knowing about Ollama-specific implementation details.
 */

import type { IAIProvider } from './IAIProvider';
import type { AIGenerationRequest, AIGenerationResponse } from '../../core/ai/types';
import { OllamaService, type OllamaConfig } from '../OllamaService';

export class OllamaProvider implements IAIProvider {
  readonly id = 'ollama';
  private service: OllamaService;

  constructor(config?: OllamaConfig) {
    this.service = new OllamaService(config);
  }

  async getHealth() {
    return this.service.getHealth();
  }

  async listModels() {
    return this.service.listModels();
  }

  async generate(request: AIGenerationRequest): Promise<AIGenerationResponse> {
    return this.service.generate(request);
  }

  /**
   * Expose the service for advanced configuration if needed.
   */
  getService(): OllamaService {
    return this.service;
  }
}
