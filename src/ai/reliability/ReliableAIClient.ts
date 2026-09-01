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

/**
 * Configuration for reliable AI client behavior.
 */
export interface ReliableAIClientConfig {
  timeoutMs?: number;
  maxRetries?: number;
  retryBackoffMs?: number;
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

  constructor(provider: IAIProvider, config: ReliableAIClientConfig = {}) {
    this.provider = provider;
    this.timeoutMs = config.timeoutMs || 60000; // 60 seconds default
    this.maxRetries = config.maxRetries || 3;
    this.retryBackoffMs = config.retryBackoffMs || 1000;
  }

  /**
   * Generate text with timeout, retry, and error handling.
   */
  async generate(
    request: AIGenerationRequest,
  ): Promise<{ response: AIGenerationResponse; metadata: AICallMetadata }> {
    const startTime = Date.now();
    let lastError: AIErrorInfo | null = null;
    let attempts: number;

    for (attempts = 1; attempts <= this.maxRetries; attempts++) {
      try {
        const response = await this.executeWithTimeout(request);
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
        lastError = classifyAIError(error);

        // Don't retry non-retryable errors
        if (!lastError.retryable) {
          throw this.createFailureResponse(startTime, attempts, lastError);
        }

        // Don't retry if we've exhausted retries
        if (attempts >= this.maxRetries) {
          throw this.createFailureResponse(startTime, attempts, lastError);
        }

        // Wait before retrying with exponential backoff
        const backoffDuration = this.retryBackoffMs * Math.pow(2, attempts - 1);
        await this.sleep(backoffDuration);
      }
    }

    // Should not reach here, but handle just in case
    throw this.createFailureResponse(startTime, attempts, lastError || classifyAIError(new Error('Unknown error')));
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
   * Utility to sleep for a given duration.
   */
  private sleep(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  /**
   * Get the underlying provider.
   */
  getProvider(): IAIProvider {
    return this.provider;
  }
}
