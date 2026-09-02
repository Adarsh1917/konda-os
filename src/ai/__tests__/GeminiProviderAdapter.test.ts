import { describe, expect, it, vi } from 'vitest';
import type { ProviderConfig } from '../config/ProviderConfig';
import { AIConfig } from '../config/AIConfig';
import { ProviderRegistry } from '../registry/ProviderRegistry';
import { GeminiProviderAdapter } from '../providers/adapters/DefaultProviderAdapters';

describe('GeminiProviderAdapter', () => {
  const makeConfig = (overrides: Partial<ProviderConfig> = {}): ProviderConfig => ({
    id: 'gemini',
    displayName: 'Google Gemini',
    enabled: true,
    apiKey: 'test-gemini-secret',
    baseUrl: 'https://generativelanguage.googleapis.com',
    defaultModel: 'gemini-1.5-flash',
    priority: 95,
    capabilities: { chat: true, coding: false, reasoning: false, vision: false },
    requestTimeout: 30000,
    chatEnabled: true,
    codingEnabled: false,
    reasoningEnabled: false,
    visionEnabled: false,
    ...overrides,
  });

  const makeMockClient = () => ({
    models: {
      generateContent: vi.fn(),
      list: vi.fn(),
    },
  });

  it('creates and configures the adapter', () => {
    const adapter = new GeminiProviderAdapter(makeConfig(), makeMockClient() as any);
    expect(adapter.id).toBe('gemini');
    expect(adapter.config.defaultModel).toBe('gemini-1.5-flash');
  });

  it('normalizes a successful Gemini response', async () => {
    const client = makeMockClient();
    client.models.generateContent.mockResolvedValue({
      text: 'Hello from Gemini',
      usageMetadata: { promptTokenCount: 12, candidatesTokenCount: 8 },
    });

    const response = await new GeminiProviderAdapter(makeConfig(), client as any).generate({
      model: 'gemini-1.5-flash',
      prompt: 'Say hello',
    });

    expect(response).toMatchObject({
      text: 'Hello from Gemini',
      model: 'gemini-1.5-flash',
      tokensPrompt: 12,
      tokensGenerated: 8,
    });
  });

  it('lists models with configured capabilities and no invented context window', async () => {
    const client = makeMockClient();
    client.models.list.mockResolvedValue({
      models: [
        { name: 'models/gemini-custom', displayName: 'Custom Gemini' },
        { name: 'models/gemini-vision', displayName: 'Vision Gemini' },
      ],
    });

    const models = await new GeminiProviderAdapter(makeConfig(), client as any).listModels();

    expect(models).toEqual([
      {
        id: 'gemini-custom',
        name: 'Custom Gemini',
        provider: 'gemini',
        capabilities: ['chat'],
        installed: true,
        enabled: true,
      },
      {
        id: 'gemini-vision',
        name: 'Vision Gemini',
        provider: 'gemini',
        capabilities: ['chat'],
        installed: true,
        enabled: true,
      },
    ]);
  });

  it('uses one default adapter registration path', () => {
    const config = AIConfig.fromEnv({ GEMINI_API_KEY: 'test-gemini-secret' });
    const registry = new ProviderRegistry();

    config.registerProviders(registry);

    expect(registry.getProviderIds()).toEqual(['gemini']);
  });

  it('throws when the API key is missing', () => {
    expect(() => new GeminiProviderAdapter(makeConfig({ apiKey: '' }), makeMockClient() as any)).toThrow(
      'Gemini API key is not configured',
    );
  });

  it.each([
    ['authentication', 'Gemini authentication failed'],
    ['429 rate limit exceeded', 'Gemini rate limit exceeded'],
    ['Request timeout after 30000ms', 'Gemini request timed out'],
  ])('normalizes %s failures', async (failure, expected) => {
    const client = makeMockClient();
    client.models.generateContent.mockRejectedValue(new Error(failure));

    await expect(new GeminiProviderAdapter(makeConfig(), client as any).generate({
      model: 'gemini-1.5-flash',
      prompt: 'hi',
    })).rejects.toThrow(expected);
  });

  it('redacts secrets from thrown errors', async () => {
    const secret = 'test-gemini-secret';
    const client = makeMockClient();
    client.models.generateContent.mockRejectedValue(new Error(`Authorization: Bearer ${secret}`));

    try {
      await new GeminiProviderAdapter(makeConfig({ apiKey: secret }), client as any).generate({
        model: 'gemini-1.5-flash',
        prompt: 'hi',
      });
      throw new Error('expected rejection');
    } catch (error) {
      expect(String(error)).toContain('[REDACTED]');
      expect(String(error)).not.toContain(secret);
    }
  });
});
