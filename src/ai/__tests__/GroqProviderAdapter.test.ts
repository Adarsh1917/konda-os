import { describe, expect, it, vi } from 'vitest';
import type { ProviderConfig } from '../config/ProviderConfig';
import { AIConfig } from '../config/AIConfig';
import { ProviderRegistry } from '../registry/ProviderRegistry';
import { GroqAdapter } from '../providers/adapters/DefaultProviderAdapters';

const makeConfig = (overrides: Partial<ProviderConfig> = {}): ProviderConfig => ({
  id: 'groq',
  displayName: 'Groq',
  enabled: true,
  apiKey: 'gsk-test-secret',
  baseUrl: 'https://api.groq.com/openai/v1',
  defaultModel: 'llama-3.1-8b-instant',
  priority: 80,
  capabilities: { chat: true, coding: true, reasoning: false, vision: false },
  requestTimeout: 25000,
  chatEnabled: true,
  codingEnabled: true,
  reasoningEnabled: false,
  visionEnabled: false,
  ...overrides,
});

const makeMockClient = () => ({
  chat: { completions: { create: vi.fn() } },
  models: { list: vi.fn() },
});

describe('GroqAdapter', () => {
  it('constructs with the configured provider and model', () => {
    const adapter = new GroqAdapter(makeConfig(), makeMockClient() as never);
    expect(adapter.id).toBe('groq');
    expect(adapter.displayName).toBe('Groq');
    expect(adapter.config.defaultModel).toBe('llama-3.1-8b-instant');
  });

  it('normalizes generation, usage, duration, and system/user messages', async () => {
    const client = makeMockClient();
    client.chat.completions.create.mockResolvedValue({
      model: 'llama-3.1-8b-instant',
      choices: [{ message: { content: 'Hello from Groq' }, finish_reason: 'stop' }],
      usage: { prompt_tokens: 12, completion_tokens: 8, total_tokens: 20 },
    });

    const response = await new GroqAdapter(makeConfig(), client as never).generate({
      model: 'llama-3.1-8b-instant',
      system: 'You are concise.',
      prompt: 'Say hello',
      temperature: 0.2,
      topP: 0.9,
      maxTokens: 64,
    });

    expect(response).toMatchObject({
      text: 'Hello from Groq',
      model: 'llama-3.1-8b-instant',
      provider: 'groq',
      tokensPrompt: 12,
      tokensGenerated: 8,
    });
    expect(response.duration).toBeGreaterThanOrEqual(0);
    expect(client.chat.completions.create).toHaveBeenCalledWith(expect.objectContaining({
      model: 'llama-3.1-8b-instant',
      messages: [
        { role: 'system', content: 'You are concise.' },
        { role: 'user', content: 'Say hello' },
      ],
      temperature: 0.2,
      top_p: 0.9,
      max_tokens: 64,
      stream: false,
    }));
  });

  it('uses the configured default model and lists conservative metadata', async () => {
    const client = makeMockClient();
    client.chat.completions.create.mockResolvedValue({ choices: [{ message: { content: 'ok' } }] });
    client.models.list.mockResolvedValue({ data: [{ id: 'llama-3.3-70b-versatile' }] });
    const adapter = new GroqAdapter(makeConfig({ defaultModel: 'configured-model' }), client as never);

    expect((await adapter.generate({ model: 'configured-model', prompt: 'hi' })).model).toBe('configured-model');
    const models = await adapter.listModels();
    expect(models).toEqual([{
      id: 'llama-3.3-70b-versatile',
      name: 'llama-3.3-70b-versatile',
      provider: 'groq',
      capabilities: ['chat', 'coding'],
      installed: true,
      enabled: true,
    }]);
  });

  it('reports health without making a live request', async () => {
    const client = makeMockClient();
    const adapter = new GroqAdapter(makeConfig(), client as never);
    await expect(adapter.getHealth()).resolves.toMatchObject({ status: 'healthy' });
    expect(client.models.list).not.toHaveBeenCalled();
  });

  it('rejects a missing API key', () => {
    expect(() => new GroqAdapter(makeConfig({ apiKey: '' }), makeMockClient() as never)).toThrow('Groq API key is not configured');
  });

  it.each([
    [401, 'authentication failed'],
    [429, 'rate limit exceeded'],
    [404, 'model not found'],
    [400, 'invalid request'],
    [500, 'provider server error'],
  ])('normalizes HTTP %s failures', async (status, expected) => {
    const client = makeMockClient();
    client.chat.completions.create.mockRejectedValue(Object.assign(new Error(`HTTP ${status}`), { status }));
    await expect(new GroqAdapter(makeConfig(), client as never).generate({ model: 'model', prompt: 'hi' })).rejects.toThrow(expected);
  });

  it.each([
    ['Request timed out', 'request timed out'],
    ['fetch failed', 'network failure'],
  ])('normalizes %s failures', async (failure, expected) => {
    const client = makeMockClient();
    client.chat.completions.create.mockRejectedValue(new Error(failure));
    await expect(new GroqAdapter(makeConfig(), client as never).generate({ model: 'model', prompt: 'hi' })).rejects.toThrow(expected);
  });

  it('redacts API keys from errors', async () => {
    const secret = 'gsk-test-secret';
    const client = makeMockClient();
    client.chat.completions.create.mockRejectedValue(new Error(`Authorization: Bearer ${secret}`));
    await expect(new GroqAdapter(makeConfig({ apiKey: secret }), client as never).generate({ model: 'model', prompt: 'hi' }))
      .rejects.toThrow('[REDACTED]');
  });

  it('registers Groq through the default registration path', () => {
    const config = AIConfig.fromEnv({
      GEMINI_API_KEY: 'gemini-test-secret',
      GROQ_API_KEY: 'gsk-test-secret',
      GROQ_MODEL: 'configured-model',
    });
    const registry = new ProviderRegistry();
    config.registerProviders(registry);
    expect(registry.getProviderIds()).toEqual(['gemini', 'groq']);
    expect(registry.get('groq')?.id).toBe('groq');
  });
});
