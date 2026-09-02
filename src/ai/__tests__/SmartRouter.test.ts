import { describe, expect, it, vi } from 'vitest';
import type { AIModel, AIProviderStatus } from '../../core/ai/types';
import { AIConfig } from '../config/AIConfig';
import type { ProviderConfig } from '../config/ProviderConfig';
import { ProviderHealthManager, type ProviderHealthState } from '../reliability/ProviderHealthManager';
import { ProviderRegistry } from '../registry/ProviderRegistry';
import { SmartRouter } from '../router/SmartRouter';
import { MockProvider } from './MockProvider';

const provider = (id: string, priority: number, capabilities = {
  chat: true,
  coding: true,
  reasoning: true,
  vision: false,
}): ProviderConfig => ({
  id,
  displayName: id,
  enabled: true,
  apiKey: `${id}-secret`,
  defaultModel: `${id}-default`,
  priority,
  capabilities,
  requestTimeout: 1000,
  chatEnabled: capabilities.chat,
  codingEnabled: capabilities.coding,
  reasoningEnabled: capabilities.reasoning,
  visionEnabled: capabilities.vision,
});

const model = (providerId: string, id: string, capabilities: AIModel['capabilities']): AIModel => ({
  id,
  name: id,
  provider: providerId,
  capabilities,
  installed: true,
  enabled: true,
});

class StaticHealthManager extends ProviderHealthManager {
  private readonly statuses = new Map<string, AIProviderStatus>();

  set(providerId: string, status: AIProviderStatus): void {
    this.statuses.set(providerId, status);
  }

  override getProviderHealth(providerId: string): ProviderHealthState | undefined {
    const status = this.statuses.get(providerId);
    return status
      ? {
          providerId,
          status,
          checkedAt: 1,
          consecutiveFailures: 0,
          consecutiveSuccesses: 0,
        }
      : undefined;
  }
}

function createRouter(
  providers: ProviderConfig[],
  models?: AIModel[],
): { router: SmartRouter; registry: ProviderRegistry; health: StaticHealthManager } {
  const registry = new ProviderRegistry();
  providers.forEach((item) => registry.register(new MockProvider(item.id)));
  const health = new StaticHealthManager(registry);
  return {
    router: new SmartRouter(new AIConfig(providers[0]?.id ?? '', providers), { registry, healthManager: health, models }),
    registry,
    health,
  };
}

describe('SmartRouter v2', () => {
  it('selects a fast eligible candidate and a reasoning candidate by intent', () => {
    const providers = [provider('fast', 100), provider('slow', 100)];
    providers[1].requestTimeout = 60_000;
    const { router } = createRouter(providers, [
      model('slow', 'slow-chat', ['chat']),
      model('fast', 'fast-chat', ['chat']),
      model('fast', 'deep-reasoner', ['reasoning']),
    ]);

    expect(router.route({ taskIntent: 'FAST' }).modelId).toBe('fast-chat');
    expect(router.route({ taskIntent: 'REASONING' }).modelId).toBe('deep-reasoner');
  });

  it('prefers healthy providers, skips unhealthy alternatives, and keeps unknown eligible', () => {
    const { router, health } = createRouter([provider('unhealthy', 100), provider('unknown', 90), provider('healthy', 80)]);
    health.set('unhealthy', 'unhealthy');
    health.set('healthy', 'healthy');

    const decision = router.route();
    expect(decision.providerId).toBe('healthy');
    expect(decision.candidates.map((candidate) => candidate.providerId)).toEqual(['healthy', 'unknown']);
  });

  it('uses deterministic preferred/default model ranking and fallback ordering', () => {
    const providers = [provider('first', 100), provider('second', 100)];
    providers[0].defaultModel = 'first-default';
    const { router } = createRouter(providers, [
      model('first', 'first-alt', ['chat']),
      model('first', 'first-default', ['chat']),
      model('second', 'second-default', ['chat']),
    ]);

    const decision = router.route({ preferredModel: 'first-alt' });
    expect(decision.providerId).toBe('first');
    expect(decision.modelId).toBe('first-alt');
    expect(decision.fallbackProviders).toEqual(['first', 'second']);
  });

  it('returns a structured failure when no model satisfies the request', () => {
    const { router } = createRouter([provider('chat-only', 100, {
      chat: true,
      coding: false,
      reasoning: false,
      vision: false,
    })], [model('chat-only', 'chat', ['chat'])]);

    const decision = router.route({ taskIntent: 'REASONING' });
    expect(decision.error).toEqual({
      code: 'NO_CANDIDATES',
      message: 'No enabled provider/model candidates satisfy the routing request.',
    });
    expect(decision.providerId).toBeUndefined();
  });

  it('does not query providers, retry, mutate health, or expose secrets', () => {
    const providers = [provider('gemini', 100), provider('groq', 90), provider('openrouter', 80)];
    const { router, registry, health } = createRouter(providers);
    const registered = registry.getAll();
    registered.forEach((item) => {
      vi.spyOn(item, 'getHealth');
      vi.spyOn(item, 'listModels');
    });

    const before = health.getAllProviderHealth();
    const decision = router.route({ taskType: 'coding' });
    const serialized = JSON.stringify(decision);

    expect(decision.providerId).toBe('gemini');
    expect(serialized).not.toContain('gemini-secret');
    expect(serialized).not.toContain('groq-secret');
    expect(serialized).not.toContain('openrouter-secret');
    expect(registered.every((item) => !vi.mocked(item.getHealth).mock.calls.length)).toBe(true);
    expect(registered.every((item) => !vi.mocked(item.listModels).mock.calls.length)).toBe(true);
    expect(health.getAllProviderHealth()).toEqual(before);
  });
});
