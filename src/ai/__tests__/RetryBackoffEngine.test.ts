import { describe, expect, it, vi } from 'vitest';
import { classifyAIError } from '../reliability/AIErrorModel';
import { RetryBackoffEngine } from '../reliability/RetryBackoffEngine';

const retryableError = (message: string): Error => new Error(message);

describe('RetryBackoffEngine', () => {
  it('returns a successful result without retrying', async () => {
    const operation = vi.fn().mockResolvedValue('ok');
    const engine = new RetryBackoffEngine({ sleep: vi.fn() });

    await expect(engine.execute(operation)).resolves.toBe('ok');
    expect(operation).toHaveBeenCalledOnce();
  });

  it('recovers after a retryable error', async () => {
    const operation = vi.fn()
      .mockRejectedValueOnce(retryableError('request timed out'))
      .mockResolvedValue('recovered');
    const delays: number[] = [];
    const engine = new RetryBackoffEngine({
      maxAttempts: 3,
      initialDelayMs: 25,
      sleep: async (delay) => {
        delays.push(delay);
      },
    });

    await expect(engine.execute(operation)).resolves.toBe('recovered');
    expect(operation).toHaveBeenCalledTimes(2);
    expect(delays).toEqual([25]);
  });

  it('stops after the configured attempt limit and preserves the final error', async () => {
    const finalError = retryableError('ECONNRESET');
    const operation = vi.fn().mockRejectedValue(finalError);
    const engine = new RetryBackoffEngine({ maxAttempts: 3, sleep: vi.fn() });

    await expect(engine.execute(operation)).rejects.toBe(finalError);
    expect(operation).toHaveBeenCalledTimes(3);
  });

  it.each([
    ['rate limit', 'rate_limit'],
    ['request timed out', 'timeout'],
    ['temporary network error: fetch failed', 'connection_error'],
    ['provider returned 500 internal server error', 'provider_unavailable'],
  ])('retries %s failures', (message, category) => {
    const info = classifyAIError(new Error(message));
    expect(info.category).toBe(category);
    expect(info.retryable).toBe(true);
  });

  it.each([
    'authentication failed',
    'Invalid request: malformed JSON',
    'Model not found: missing-model',
  ])('does not retry permanent error "%s"', async (message) => {
    const operation = vi.fn().mockRejectedValue(new Error(message));
    const sleep = vi.fn();
    const engine = new RetryBackoffEngine({ maxAttempts: 4, sleep });

    await expect(engine.execute(operation)).rejects.toThrow(message);
    expect(operation).toHaveBeenCalledOnce();
    expect(sleep).not.toHaveBeenCalled();
  });

  it('calculates predictable exponential delays', () => {
    const engine = new RetryBackoffEngine({
      initialDelayMs: 100,
      maxDelayMs: 10_000,
    });

    expect(engine.calculateDelay(1)).toBe(100);
    expect(engine.calculateDelay(2)).toBe(200);
    expect(engine.calculateDelay(3)).toBe(400);
  });

  it('caps exponential delays at the maximum', () => {
    const engine = new RetryBackoffEngine({ initialDelayMs: 100, maxDelayMs: 250 });

    expect(engine.calculateDelay(3)).toBe(250);
    expect(engine.calculateDelay(10)).toBe(250);
  });

  it('keeps jitter bounded by the maximum delay', () => {
    const engine = new RetryBackoffEngine({
      initialDelayMs: 100,
      maxDelayMs: 250,
      jitter: true,
      random: () => 1,
    });

    expect(engine.calculateDelay(3)).toBe(250);
    expect(engine.calculateDelay(3)).toBeLessThanOrEqual(250);
  });

  it('uses the injected sleep function instead of waiting', async () => {
    const sleep = vi.fn().mockResolvedValue(undefined);
    const operation = vi.fn()
      .mockRejectedValueOnce(retryableError('network error'))
      .mockResolvedValue('ok');
    const engine = new RetryBackoffEngine({
      initialDelayMs: 5000,
      sleep,
    });

    await expect(engine.execute(operation)).resolves.toBe('ok');
    expect(sleep).toHaveBeenCalledWith(5000);
  });

  it('reports every attempt and supports reset for stateless callers', async () => {
    const attempts: number[] = [];
    const operation = vi.fn()
      .mockRejectedValueOnce(retryableError('timeout'))
      .mockRejectedValueOnce(retryableError('timeout'))
      .mockResolvedValue('ok');
    const engine = new RetryBackoffEngine({
      onAttempt: (attempt) => attempts.push(attempt),
      sleep: vi.fn(),
    });

    await engine.execute(operation);
    engine.reset();

    expect(attempts).toEqual([1, 2, 3]);
  });

  it('normalizes edge-case configuration safely', () => {
    const engine = new RetryBackoffEngine({
      maxAttempts: 0,
      initialDelayMs: -10,
      maxDelayMs: -1,
    });

    expect(engine.calculateDelay(1)).toBe(0);
    return expect(engine.execute(async () => 'single attempt')).resolves.toBe('single attempt');
  });

  it('does not expose secrets in its own failure surface', async () => {
    const secret = 'AIzaSensitiveKey123';
    const error = new Error(`authentication failed: apiKey=${secret}`);
    const engine = new RetryBackoffEngine({ maxAttempts: 3, sleep: vi.fn() });

    await expect(engine.execute(async () => {
      throw error;
    })).rejects.toBe(error);
    expect(classifyAIError(error).message).not.toContain(secret);
  });
});
