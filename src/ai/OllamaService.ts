/**
 * OllamaService provides a direct interface to a local Ollama instance.
 * This is the foundation for the Ollama provider adapter in Milestone 3.
 */

import type {
  AIGenerationRequest,
  AIGenerationResponse,
  AIModel,
  AIProviderHealth,
} from '../core/ai/types';

export interface OllamaConfig {
  baseUrl?: string;
  timeout?: number;
}

/**
 * OllamaService handles all direct communication with a local Ollama instance.
 */
export class OllamaService {
  private baseUrl: string;
  private timeout: number;

  constructor(config: OllamaConfig = {}) {
    this.baseUrl = config.baseUrl || 'http://127.0.0.1:11434';
    this.timeout = config.timeout || 30000;
  }

  /**
   * Check if Ollama is running and healthy.
   */
  async getHealth(): Promise<AIProviderHealth> {
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), this.timeout);

      const response = await fetch(`${this.baseUrl}/api/tags`, {
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      if (response.ok) {
        return {
          status: 'healthy',
          message: 'Ollama is running',
          timestamp: Date.now(),
        };
      }

      return {
        status: 'unhealthy',
        message: `Ollama returned status ${response.status}`,
        timestamp: Date.now(),
      };
    } catch (error) {
      return {
        status: 'unhealthy',
        message: `Failed to connect to Ollama: ${error instanceof Error ? error.message : 'Unknown error'}`,
        timestamp: Date.now(),
      };
    }
  }

  /**
   * List all models available in Ollama.
   */
  async listModels(): Promise<AIModel[]> {
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), this.timeout);

      const response = await fetch(`${this.baseUrl}/api/tags`, {
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`);
      }

      const data = (await response.json()) as OllamaTagsResponse;

      return (data.models || []).map((model) => ({
        id: model.name,
        name: model.name,
        provider: 'ollama',
        description: `Ollama model: ${model.name}`,
        tags: ['ollama'],
      }));
    } catch (error) {
      throw new Error(
        `Failed to list Ollama models: ${error instanceof Error ? error.message : 'Unknown error'}`,
        { cause: error },
      );
    }
  }

  /**
   * Generate text using Ollama.
   */
  async generate(request: AIGenerationRequest): Promise<AIGenerationResponse> {
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), this.timeout);

      const payload = {
        model: request.model,
        prompt: request.prompt,
        system: request.system,
        stream: false,
        temperature: request.temperature,
        top_p: request.topP,
        top_k: request.topK,
      };

      const response = await fetch(`${this.baseUrl}/api/generate`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`);
      }

      const data = (await response.json()) as OllamaGenerateResponse;

      return {
        text: data.response,
        model: request.model,
        tokensPrompt: data.prompt_eval_count,
        tokensGenerated: data.eval_count,
        duration: data.total_duration ? data.total_duration / 1000000 : undefined,
      };
    } catch (error) {
      throw new Error(
        `Failed to generate with Ollama: ${error instanceof Error ? error.message : 'Unknown error'}`,
        { cause: error },
      );
    }
  }

  /**
   * Set the base URL for Ollama.
   */
  setBaseUrl(url: string): void {
    this.baseUrl = url;
  }

  /**
   * Get the current base URL.
   */
  getBaseUrl(): string {
    return this.baseUrl;
  }
}

/**
 * Ollama API response types
 */

interface OllamaModel {
  name: string;
  modified_at: string;
  size: number;
  digest: string;
}

interface OllamaTagsResponse {
  models: OllamaModel[];
}

interface OllamaGenerateResponse {
  response: string;
  created_at: string;
  model: string;
  status: string;
  prompt_eval_count: number;
  eval_count: number;
  total_duration: number;
  load_duration: number;
  prompt_eval_duration: number;
  eval_duration: number;
}
