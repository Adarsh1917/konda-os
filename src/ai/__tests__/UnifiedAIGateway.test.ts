import { describe, expect, it, vi } from 'vitest';
import type { AIGenerationRequest, AIGenerationResponse } from '../../core/ai/types';
import { ProviderRegistry } from '../registry/ProviderRegistry';
import { RetryBackoffEngine } from '../reliability/RetryBackoffEngine';
import type { SmartRouteDecision, SmartRouterRequest } from '../router/SmartRouter';
import {
  UnifiedAIGateway,
  UnifiedAIGatewayError,
  type RetryExecutor,
} from '../services/UnifiedAIGateway';
import { MockProvider } from './MockProvider';

const request: AIGenerationRequest = {
  model: 'requested-model',
  prompt: 'hello',
};

const candidate = (providerId: string, modelId: string) => ({
  providerId,
  providerName: providerId,
  modelId,
  modelName: modelId,
  score: 1,
  health: 'healthy' as const,
});

function routerFor(...candidates: ReturnType<typeof candidate>[]): Pick<{ route(options?: SmartRouterRequest): SmartRouteDecision }, 'route'> {
  return {
    route: vi.fn(() => ({
      providerId: candidates[0]?.providerId,
      modelId: candidates[0]?.modelId,
      reason: 'test route',
      fallbackProviders: candidates.slice(1).map((item) => item.providerId),
      candidates,
    })),
  };
}

function gatewayWith(
  candidates: ReturnType<typeof candidate>[],
  providers: Record<string, MockProvider>,
  retryEngine: RetryExecutor = new RetryBackoffEngine({ maxAttempts: 1 }),
): UnifiedAIGateway {
  const registry = new ProviderRegistry();
  Object.values(providers).forEach((provider) => registry.register(provider));
  return new UnifiedAIGateway({
    router: routerFor(...candidates),
    registry,
    retryEngine,
  });
}

describe('UnifiedAIGateway', () => {
  it('routes, retries, falls back, and normalizes provider/model metadata', async () => {
    const first = new MockProvider('first');
    const second = new MockProvider('second');
    let firstAttempts = 0;
    first.generate = async () => {
      firstAttempts += 1;
      throw new Error('network error');
    };
    second.generate = async (generationRequest) => ({
      text: 'success',
      model: generationRequest.model,
    });

    const retryEngine = new RetryBackoffEngine({
      maxAttempts: 2,
      initialDelayMs: 0,
      sleep: async () => undefined,
    });
    const gateway = gatewayWith(
      [candidate('first', 'fast-model'), candidate('second', 'backup-model')],
      { first, second },
      retryEngine,
    );

    await expect(gateway.generate(request)).resolves.toEqual({
      text: 'success',
      model: 'backup-model',
      provider: 'second',
    });
    expect(firstAttempts).toBe(2);
  });

  it('does not retry non-retryable failures and returns a safe normalized error', async () => {
    const provider = new MockProvider('private');
    const generate = vi.fn(async () => {
      throw new Error('invalid request api key=private-secret');
    });
    provider.generate = generate;
    const gateway = gatewayWith([candidate('private', 'model')], { private: provider });

    await expect(gateway.generate(request)).rejects.toMatchObject({
      name: 'UnifiedAIGatewayError',
      info: {
        category: 'authentication_error',
        retryable: false,
      },
    });
    expect(generate).toHaveBeenCalledTimes(1);
    await expect(gateway.generate(request)).rejects.not.toThrow('private-secret');
  });

  it('sanitizes injected routing errors into the gateway-owned message', async () => {
    const unsafeMessage = 'router internals apiKey=super-secret';
    const gateway = new UnifiedAIGateway({
      router: {
        route: vi.fn(() => ({
          reason: 'No candidates',
          fallbackProviders: [],
          candidates: [],
          error: {
            code: 'NO_CANDIDATES' as const,
            message: unsafeMessage,
          },
        })),
      },
      registry: new ProviderRegistry(),
      retryEngine: new RetryBackoffEngine({ maxAttempts: 1 }),
    });

    const failure = await gateway.generate(request).catch((error: unknown) => error);
    expect(failure).toBeInstanceOf(UnifiedAIGatewayError);
    expect(failure).toMatchObject({
      name: 'UnifiedAIGatewayError',
      message: 'AI routing failed: no suitable provider or model is available.',
      info: {
        category: 'routing_failure',
        message: 'AI routing failed: no suitable provider or model is available.',
        retryable: false,
      },
    });
    expect(JSON.stringify(failure)).not.toContain(unsafeMessage);
    expect(JSON.stringify(failure)).not.toContain('super-secret');
  });

  it('uses deterministic router candidate order and performs no health/model network calls', async () => {
    const first = new MockProvider('gemini');
    const second = new MockProvider('groq');
    const third = new MockProvider('openrouter');
    const calls: string[] = [];
    [first, second, third].forEach((provider) => {
      provider.getHealth = vi.fn(async () => {
        throw new Error('must not be called');
      });
      provider.listModels = vi.fn(async () => {
        throw new Error('must not be called');
      });
      provider.generate = async (generationRequest) => {
        calls.push(`${provider.id}/${generationRequest.model}`);
        if (provider.id !== 'openrouter') {
          throw new Error('provider unavailable');
        }
        return { text: 'ok', model: generationRequest.model } as AIGenerationResponse;
      };
    });

    const gateway = gatewayWith(
      [candidate('gemini', 'gemini-model'), candidate('groq', 'groq-model'), candidate('openrouter', 'router-model')],
      { gemini: first, groq: second, openrouter: third },
    );
    await expect(gateway.generate(request)).resolves.toMatchObject({
      provider: 'openrouter',
      model: 'router-model',
    });
    expect(calls).toEqual(['gemini/gemini-model', 'groq/groq-model', 'openrouter/router-model']);
    expect(first.getHealth).not.toHaveBeenCalled();
    expect(second.listModels).not.toHaveBeenCalled();
  });

  it('reports the final classified error when all candidates fail', async () => {
    const first = new MockProvider('first');
    const second = new MockProvider('second');
    first.generate = async () => {
      throw new Error('rate limit exceeded');
    };
    second.generate = async () => {
      throw new Error('model not found');
    };
    const gateway = gatewayWith([candidate('first', 'one'), candidate('second', 'two')], { first, second });

    const failure = await gateway.generate(request).catch((error: unknown) => error);
    expect(failure).toBeInstanceOf(UnifiedAIGatewayError);
    expect((failure as UnifiedAIGatewayError).info.category).toBe('model_not_found');
    expect((failure as UnifiedAIGatewayError).message).not.toContain('private-secret');
  });
});
