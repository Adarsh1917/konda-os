import type { AIProviderHealth, AIProviderStatus } from '../../core/ai/types';
import { providerRegistry, type ProviderRegistry } from '../registry/ProviderRegistry';

export interface ProviderHealthState {
  providerId: string;
  status: AIProviderStatus;
  message?: string;
  checkedAt: number;
  lastSuccessfulCheck?: number;
  lastFailure?: number;
  consecutiveFailures: number;
  consecutiveSuccesses: number;
}

function safeMessage(message: string | undefined): string | undefined {
  if (!message) {
    return undefined;
  }

  return message
    .replace(/AIza[0-9A-Za-z\-_]+/g, '[REDACTED]')
    .replace(/(api[_-]?key|authorization|bearer)\s*[:=]\s*\S+/gi, '$1: [REDACTED]')
    .replace(/(sk-[A-Za-z0-9_-]{8,})/g, '[REDACTED]');
}

function cloneState(state: ProviderHealthState): ProviderHealthState {
  return { ...state };
}

export class ProviderHealthManager {
  private readonly states = new Map<string, ProviderHealthState>();
  private readonly registry: ProviderRegistry;

  constructor(registry: ProviderRegistry = providerRegistry) {
    this.registry = registry;
  }

  async checkProvider(providerId: string): Promise<ProviderHealthState> {
    const provider = this.registry.get(providerId);
    if (!provider) {
      return this.record(providerId, {
        status: 'unknown',
        message: 'Provider is not registered.',
      });
    }

    try {
      const health = await provider.getHealth();
      return this.record(providerId, {
        status: health.status,
        message: safeMessage(health.message),
      });
    } catch {
      return this.record(providerId, {
        status: 'unhealthy',
        message: 'Provider health check failed.',
      });
    }
  }

  async checkAllProviders(): Promise<ProviderHealthState[]> {
    return Promise.all(this.registry.getProviderIds().map((providerId) => this.checkProvider(providerId)));
  }

  getProviderHealth(providerId: string): ProviderHealthState | undefined {
    const state = this.states.get(providerId);
    return state ? cloneState(state) : undefined;
  }

  getAllProviderHealth(): ProviderHealthState[] {
    return Array.from(this.states.values(), cloneState);
  }

  resetProviderHealth(providerId?: string): void {
    if (providerId === undefined) {
      this.states.clear();
      return;
    }

    this.states.delete(providerId);
  }

  private record(providerId: string, health: Pick<AIProviderHealth, 'status' | 'message'>): ProviderHealthState {
    const previous = this.states.get(providerId);
    const checkedAt = Date.now();
    const isSuccess = health.status === 'healthy';
    const state: ProviderHealthState = {
      providerId,
      status: health.status,
      message: safeMessage(health.message),
      checkedAt,
      lastSuccessfulCheck: isSuccess ? checkedAt : previous?.lastSuccessfulCheck,
      lastFailure: health.status === 'unhealthy' ? checkedAt : previous?.lastFailure,
      consecutiveFailures: health.status === 'unhealthy' ? (previous?.consecutiveFailures ?? 0) + 1 : 0,
      consecutiveSuccesses: isSuccess ? (previous?.consecutiveSuccesses ?? 0) + 1 : 0,
    };

    this.states.set(providerId, state);
    return cloneState(state);
  }
}
