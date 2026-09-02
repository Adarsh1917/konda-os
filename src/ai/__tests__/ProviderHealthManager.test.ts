import { beforeEach, describe, expect, it } from 'vitest';
import { ProviderHealthManager } from '../reliability/ProviderHealthManager';
import { ProviderRegistry } from '../registry/ProviderRegistry';
import { MockProvider } from './MockProvider';

describe('ProviderHealthManager', () => {
  let registry: ProviderRegistry;
  let manager: ProviderHealthManager;

  beforeEach(() => {
    registry = new ProviderRegistry();
    manager = new ProviderHealthManager(registry);
  });

  it('records a healthy provider and its successful checks', async () => {
    registry.register(new MockProvider('gemini'));

    const result = await manager.checkProvider('gemini');

    expect(result.status).toBe('healthy');
    expect(result.lastSuccessfulCheck).toBe(result.checkedAt);
    expect(result.consecutiveSuccesses).toBe(1);
    expect(result.consecutiveFailures).toBe(0);
  });

  it('records an unhealthy provider and its failure', async () => {
    registry.register(new MockProvider('groq', false));

    const result = await manager.checkProvider('groq');

    expect(result.status).toBe('unhealthy');
    expect(result.lastFailure).toBe(result.checkedAt);
    expect(result.consecutiveFailures).toBe(1);
    expect(result.consecutiveSuccesses).toBe(0);
  });

  it('returns unknown for an uninitialized provider', async () => {
    const result = await manager.checkProvider('openrouter');

    expect(result.status).toBe('unknown');
    expect(manager.getProviderHealth('openrouter')?.status).toBe('unknown');
  });

  it('tracks consecutive failures and resets them after recovery', async () => {
    const provider = new MockProvider('gemini', false);
    registry.register(provider);

    await manager.checkProvider('gemini');
    await manager.checkProvider('gemini');
    expect(manager.getProviderHealth('gemini')?.consecutiveFailures).toBe(2);

    provider.setHealthy(true);
    const recovered = await manager.checkProvider('gemini');

    expect(recovered.status).toBe('healthy');
    expect(recovered.consecutiveFailures).toBe(0);
    expect(recovered.consecutiveSuccesses).toBe(1);
    expect(recovered.lastFailure).toBeDefined();
  });

  it('tracks multiple providers independently', async () => {
    registry.register(new MockProvider('gemini'));
    registry.register(new MockProvider('groq', false));

    const results = await manager.checkAllProviders();

    expect(results.map((result) => result.providerId)).toEqual(['gemini', 'groq']);
    expect(manager.getAllProviderHealth()).toHaveLength(2);
    expect(manager.getProviderHealth('gemini')?.status).toBe('healthy');
    expect(manager.getProviderHealth('groq')?.status).toBe('unhealthy');
  });

  it('preserves unknown state for a missing or disabled provider without secrets', async () => {
    const secret = 'AIzaSensitiveKey123';
    const provider = new MockProvider('openrouter', false);
    provider.getHealth = async () => ({
      status: 'unhealthy',
      message: `disabled: apiKey=${secret}`,
      timestamp: Date.now(),
    });
    registry.register(provider);

    const disabled = await manager.checkProvider('openrouter');
    const missing = await manager.checkProvider('missing');

    expect(disabled.status).toBe('unhealthy');
    expect(disabled.message).not.toContain(secret);
    expect(missing.status).toBe('unknown');
  });

  it('returns defensive copies and supports reset', async () => {
    registry.register(new MockProvider('gemini'));
    await manager.checkProvider('gemini');

    const copy = manager.getProviderHealth('gemini');
    if (copy) {
      copy.status = 'unhealthy';
    }
    expect(manager.getProviderHealth('gemini')?.status).toBe('healthy');

    manager.resetProviderHealth('gemini');
    expect(manager.getProviderHealth('gemini')).toBeUndefined();
  });
});
