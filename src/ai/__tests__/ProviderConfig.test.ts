import { describe, expect, it } from 'vitest';
import { AIConfig, loadAIConfig } from '../config/AIConfig';
import { resolveProviderConfig } from '../config/ProviderConfig';
import { ProviderSelector } from '../router/ProviderSelector';

describe('Provider configuration', () => {
  it('loads provider configuration from environment', () => {
    const config = AIConfig.fromEnv({
      OPENAI_API_KEY: 'sk-test-key',
      OPENAI_MODEL: 'gpt-4o-mini',
      GEMINI_API_KEY: 'gemini-test-key',
      KONDA_DEFAULT_PROVIDER: 'openai',
    });

    expect(config.preferredProvider).toBe('openai');
    expect(config.getProvider('openai')?.apiKey).toBe('sk-test-key');
    expect(config.getProvider('gemini')?.apiKey).toBe('gemini-test-key');
  });

  it('handles disabled providers cleanly', () => {
    const config = AIConfig.fromEnv({
      OPENAI_ENABLED: 'false',
      ANTHROPIC_API_KEY: 'anthropic-test-key',
    });

    expect(config.getProvider('openai')?.enabled).toBe(false);
    expect(config.getProvider('anthropic')?.enabled).toBe(true);
  });

  it('treats missing API keys as disabled providers', () => {
    const provider = resolveProviderConfig('openai', {});

    expect(provider.enabled).toBe(false);
    expect(provider.apiKey).toBe('');
  });

  it('selects a valid provider for the requested task', () => {
    const config = AIConfig.fromEnv({
      OPENAI_API_KEY: 'sk-test-key',
      GROQ_API_KEY: 'groq-test-key',
      KONDA_DEFAULT_PROVIDER: 'openai',
    });

    const selected = new ProviderSelector(config).select({ taskType: 'coding' });

    expect(selected?.id).toBe('openai');
  });

  it('does not leak secrets in logs', () => {
    const safeLog = loadAIConfig({
      OPENAI_API_KEY: 'sk-secret-key',
    }).toSafeLog();

    const serialized = JSON.stringify(safeLog);
    expect(serialized).not.toContain('sk-secret-key');
    expect(serialized).toContain('[redacted]');
  });
});
