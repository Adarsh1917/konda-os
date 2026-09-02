/**
 * ReliableAIClient wraps AI provider calls with timeout, retry, and error handling.
 *
 * Conceptual architecture:
 *   Application
 *       ↓
 *   AI Orchestrator
 *       ↓
 *   AI Service
 *       ↓
 *   ReliableAIClient (this layer)
 *       ↓
 *   Provider
 *       ↓
 *   Model
 *
 * The ReliableAIClient is responsible for:
 * - Timeout enforcement
 * - Retry logic with backoff
 * - Error classification
 * - Metadata/observability
 */

import type { IAIProvider } from '../providers/IAIProvider';
import type { AIGenerationRequest, AIGenerationResponse } from '../../core/ai/types';
import { classifyAIError, type AIErrorInfo } from './AIErrorModel';
import { RetryBackoffEngine } from './RetryBackoffEngine';

/**
 * Configuration for reliable AI client behavior.
 */
export interface ReliableAIClientConfig {
  timeoutMs?: number;
  maxRetries?: number;
  retryBackoffMs?: number;
  maxDelayMs?: number;
  jitter?: boolean;
}

/**
 * Metadata about a reliable AI call.
 */
export interface AICallMetadata {
  provider: string;
  model: string;
  startTime: number;
  endTime: number;
  duration: number;
  attempts: number;
  success: boolean;
  error?: AIErrorInfo;
}

/**
 * ReliableAIClient wraps a provider and adds reliability features.
 */
export class ReliableAIClient {
  private provider: IAIProvider;
  private timeoutMs: number;
  private maxRetries: number;
  private retryBackoffMs: number;
  private readonly retryEngine: RetryBackoffEngine;

  constructor(provider: IAIProvider, config: ReliableAIClientConfig = {}) {
    this.provider = provider;
    this.timeoutMs = config.timeoutMs ?? 60000;
    this.maxRetries = config.maxRetries ?? 3;
    this.retryBackoffMs = config.retryBackoffMs ?? 1000;
    this.retryEngine = new RetryBackoffEngine({
      maxAttempts: this.maxRetries,
      initialDelayMs: this.retryBackoffMs,
      maxDelayMs: config.maxDelayMs,
      jitter: config.jitter,
    });
  }

  /**
   * Generate text with timeout, retry, and error handling.
   */
  async generate(
    request: AIGenerationRequest,
  ): Promise<{ response: AIGenerationResponse; metadata: AICallMetadata }> {
    const startTime = Date.now();
    let attempts = 0;
    let lastError: AIErrorInfo | null = null;

    try {
      const response = await this.retryEngine.execute(async () => {
        attempts += 1;
        try {
          return await this.executeWithTimeout(request);
        } catch (error) {
          lastError = classifyAIError(error);
          throw error;
        }
      });
      const endTime = Date.now();

      return {
        response,
        metadata: {
          provider: this.provider.id,
          model: request.model,
          startTime,
          endTime,
          duration: endTime - startTime,
          attempts,
          success: true,
        },
      };
    } catch (error) {
      throw this.createFailureResponse(startTime, attempts, lastError ?? classifyAIError(error));
    }
  }

  /**
   * Execute a generation request with timeout enforcement.
   */
  private executeWithTimeout(request: AIGenerationRequest): Promise<AIGenerationResponse> {
    return new Promise((resolve, reject) => {
      const timeoutHandle = setTimeout(() => {
        reject(new Error(`AI request timeout after ${this.timeoutMs}ms`));
      }, this.timeoutMs);

      this.provider
        .generate(request)
        .then((response) => {
          clearTimeout(timeoutHandle);
          resolve(response);
        })
        .catch((error) => {
          clearTimeout(timeoutHandle);
          reject(error);
        });
    });
  }

  /**
   * Create a failure response with metadata.
   */
  private createFailureResponse(startTime: number, attempts: number, errorInfo: AIErrorInfo): Error {
    const endTime = Date.now();
    const error = new Error(errorInfo.message) as Error & Record<string, unknown>;

    // Attach metadata to the error for observability
    error.metadata = {
      provider: this.provider.id,
      startTime,
      endTime,
      duration: endTime - startTime,
      attempts,
      success: false,
      errorCategory: errorInfo.category,
    };

    return error;
  }

  /**
   * Get the underlying provider.
   */
  getProvider(): IAIProvider {
    return this.provider;
  }
}
