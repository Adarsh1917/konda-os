import { classifyAIError, type AIErrorInfo } from './AIErrorModel';

export type RetrySleep = (delayMs: number) => Promise<void>;
export type RetryRandom = () => number;
export type RetryClassifier = (error: unknown) => AIErrorInfo;

export interface RetryBackoffEngineConfig {
  /** Maximum number of times the operation may run, including the first attempt. */
  maxAttempts?: number;
  /** Backward-compatible alias for maxAttempts. */
  maxRetries?: number;
  initialDelayMs?: number;
  maxDelayMs?: number;
  /** Enables full jitter from zero through the calculated delay. */
  jitter?: boolean;
  sleep?: RetrySleep;
  random?: RetryRandom;
  classifyError?: RetryClassifier;
  onAttempt?: (attempt: number) => void;
}

export interface RetryBackoffEngineOptions {
  maxAttempts: number;
  initialDelayMs: number;
  maxDelayMs: number;
  jitter: boolean;
  sleep: RetrySleep;
  random: RetryRandom;
  classifyError: RetryClassifier;
  onAttempt?: (attempt: number) => void;
}

const defaultSleep: RetrySleep = (delayMs) => new Promise((resolve) => setTimeout(resolve, delayMs));

function normalizeNonNegative(value: number | undefined, fallback: number): number {
  return Number.isFinite(value) ? Math.max(0, value as number) : fallback;
}

export class RetryBackoffEngine {
  private readonly options: RetryBackoffEngineOptions;

  constructor(config: RetryBackoffEngineConfig = {}) {
    const initialDelayMs = normalizeNonNegative(config.initialDelayMs, 1000);
    const maxDelayMs = Math.max(initialDelayMs, normalizeNonNegative(config.maxDelayMs, 30_000));
    const configuredAttempts = config.maxAttempts ?? config.maxRetries ?? 3;

    this.options = {
      maxAttempts: Number.isFinite(configuredAttempts) ? Math.max(1, Math.floor(configuredAttempts)) : 3,
      initialDelayMs,
      maxDelayMs,
      jitter: config.jitter ?? false,
      sleep: config.sleep ?? defaultSleep,
      random: config.random ?? Math.random,
      classifyError: config.classifyError ?? classifyAIError,
      onAttempt: config.onAttempt,
    };
  }

  async execute<T>(operation: () => Promise<T>): Promise<T> {
    for (let attempt = 1; attempt <= this.options.maxAttempts; attempt += 1) {
      this.options.onAttempt?.(attempt);

      try {
        return await operation();
      } catch (error) {
        if (!this.shouldRetry(error) || attempt >= this.options.maxAttempts) {
          throw error;
        }

        await this.options.sleep(this.calculateDelay(attempt));
      }
    }

    throw new Error('Retry operation did not execute');
  }

  shouldRetry(error: unknown): boolean {
    return this.options.classifyError(error).retryable;
  }

  /**
   * Calculates the delay before the retry after the supplied attempt.
   * Attempt 1 uses the initial delay, attempt 2 doubles it, and so on.
   */
  calculateDelay(attempt: number): number {
    const retryAttempt = Math.max(1, Math.floor(attempt));
    const exponentialDelay = this.options.initialDelayMs * 2 ** (retryAttempt - 1);
    const cappedDelay = Math.min(this.options.maxDelayMs, exponentialDelay);

    if (!this.options.jitter || cappedDelay === 0) {
      return cappedDelay;
    }

    const randomValue = Math.min(1, Math.max(0, this.options.random()));
    return Math.min(this.options.maxDelayMs, cappedDelay * randomValue);
  }

  reset(): void {
    // The engine is stateless; reset is provided for lifecycle-compatible callers.
  }
}
