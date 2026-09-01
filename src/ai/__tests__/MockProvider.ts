/**
 * Mock provider for testing.
 */

import type { IAIProvider } from '../providers/IAIProvider';
import type { AIGenerationRequest, AIGenerationResponse, AIModel, AIProviderHealth } from '../../core/ai/types';

export class MockProvider implements IAIProvider {
  readonly id: string;
  private shouldBehealthy: boolean = true;
  private models: AIModel[] = [];

  constructor(id: string, healthy: boolean = true, models: AIModel[] = []) {
    this.id = id;
    this.shouldBehealthy = healthy;
    this.models = models;
  }

  async getHealth(): Promise<AIProviderHealth> {
    return {
      status: this.shouldBehealthy ? 'healthy' : 'unhealthy',
      message: this.shouldBehealthy ? `${this.id} is healthy` : `${this.id} is down`,
      timestamp: Date.now(),
    };
  }

  async listModels(): Promise<AIModel[]> {
    return this.models;
  }

  async generate(request: AIGenerationRequest): Promise<AIGenerationResponse> {
    return {
      text: `Mock response from ${this.id} to: ${request.prompt}`,
      model: request.model,
      duration: 100,
    };
  }

  setHealthy(healthy: boolean): void {
    this.shouldBehealthy = healthy;
  }

  setModels(models: AIModel[]): void {
    this.models = models;
  }
}
