import { describe, expect, it, vi } from 'vitest';
import type { ProviderConfig } from '../config/ProviderConfig';
import { AIConfig } from '../config/AIConfig';
import { ProviderRegistry } from '../registry/ProviderRegistry';
import { OpenRouterAdapter } from '../providers/adapters/DefaultProviderAdapters';

const makeConfig = (overrides: Partial<ProviderConfig> = {}): ProviderConfig => ({
  id: 'openrouter',
  displayName: 'OpenRouter',
  enabled: true,
  apiKey: 'sk-or-test-secret',
  baseUrl: 'https://openrouter.ai/api/v1',
  defaultModel: 'openai/gpt-4o-mini',
  priority: 75,
  capabilities: { chat: true, coding: true, reasoning: true, vision: true },
  requestTimeout: 30000,
  chatEnabled: true,
  codingEnabled: true,
  reasoningEnabled: true,
  visionEnabled: true,
  ...overrides,
});

const jsonResponse = (body: unknown, status = 200): Response => new Response(JSON.stringify(body), { status });

describe('OpenRouterAdapter', () => {
  it('normalizes generation, prompts, parameters, usage, provider, and duration', async () => {
    const fetcher = vi.fn<typeof fetch>().mockResolvedValue(jsonResponse({
      choices: [{ message: { content: 'Hello from OpenRouter' } }],
      usage: { prompt_tokens: 11, completion_tokens: 7 },
    }));
    const response = await new OpenRouterAdapter(makeConfig(), fetcher).generate({
      model: 'openai/gpt-4o-mini',
      system: 'Be concise.',
      prompt: 'Say hello',
      temperature: 0.2,
      topP: 0.9,
      maxTokens: 64,
    });

    expect(response).toMatchObject({
      text: 'Hello from OpenRouter',
      model: 'openai/gpt-4o-mini',
      provider: 'openrouter',
      tokensPrompt: 11,
      tokensGenerated: 7,
    });
    expect(response.duration).toBeGreaterThanOrEqual(0);
    expect(fetcher).toHaveBeenCalledWith(
      'https://openrouter.ai/api/v1/chat/completions',
      expect.objectContaining({
        method: 'POST',
        body: JSON.stringify({
          model: 'openai/gpt-4o-mini',
          messages: [
            { role: 'system', content: 'Be concise.' },
            { role: 'user', content: 'Say hello' },
          ],
          temperature: 0.2,
          top_p: 0.9,
          max_tokens: 64,
          stream: false,
        }),
      }),
    );
  });

  it('lists models without inventing metadata and reports configuration health', async () => {
    const fetcher = vi.fn<typeof fetch>().mockResolvedValue(jsonResponse({
      data: [{ id: 'openai/gpt-4o-mini', name: 'GPT-4o Mini' }],
    }));
    const adapter = new OpenRouterAdapter(makeConfig(), fetcher);
    await expect(adapter.getHealth()).resolves.toMatchObject({ status: 'healthy' });
    await expect(adapter.listModels()).resolves.toEqual([{
      id: 'openai/gpt-4o-mini',
      name: 'GPT-4o Mini',
      provider: 'openrouter',
      capabilities: ['chat', 'coding', 'reasoning', 'vision'],
      installed: true,
      enabled: true,
    }]);
  });

  it('rejects missing keys and registers through AIConfig once', () => {
    expect(() => new OpenRouterAdapter(makeConfig({ apiKey: '' }), vi.fn<typeof fetch>())).toThrow('OpenRouter API key is not configured');
    const config = AIConfig.fromEnv({
      GEMINI_API_KEY: 'gemini-test-secret',
      OPENROUTER_API_KEY: 'sk-or-test-secret',
    });
    const registry = new ProviderRegistry();
    config.registerProviders(registry);
    expect(registry.getProviderIds()).toEqual(['gemini', 'openrouter']);
  });

  it.each([
    [401, 'authentication failed'],
    [429, 'rate limit exceeded'],
    [400, 'invalid request'],
    [404, 'model not found'],
    [500, 'provider server error'],
  ])('normalizes HTTP %s errors', async (status, expected) => {
    const fetcher = vi.fn<typeof fetch>().mockResolvedValue(jsonResponse({}, status));
    await expect(new OpenRouterAdapter(makeConfig(), fetcher).generate({ model: 'model', prompt: 'hi' }))
      .rejects.toThrow(expected);
  });

  it('redacts the API key from provider errors', async () => {
    const secret = 'sk-or-test-secret';
    const fetcher = vi.fn<typeof fetch>().mockRejectedValue(new Error(`Authorization: Bearer ${secret}`));
    await expect(new OpenRouterAdapter(makeConfig({ apiKey: secret }), fetcher).generate({ model: 'model', prompt: 'hi' }))
      .rejects.toThrow('[REDACTED]');
  });
});
