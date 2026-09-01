/**
 * Tests for ProviderRegistry.
 */

import { describe, it, expect, beforeEach } from 'vitest';
import { ProviderRegistry } from '../registry/ProviderRegistry';
import { MockProvider } from './MockProvider';

describe('ProviderRegistry', () => {
  let registry: ProviderRegistry;

  beforeEach(() => {
    registry = new ProviderRegistry();
  });

  it('should register a provider', () => {
    const provider = new MockProvider('test-provider');
    registry.register(provider);

    expect(registry.has('test-provider')).toBe(true);
    expect(registry.get('test-provider')).toBe(provider);
  });

  it('should replace an existing provider with the same ID', () => {
    const provider1 = new MockProvider('ollama');
    const provider2 = new MockProvider('ollama');

    registry.register(provider1);
    registry.register(provider2);

    expect(registry.get('ollama')).toBe(provider2);
    expect(registry.getAll().length).toBe(1);
  });

  it('should unregister a provider', () => {
    const provider = new MockProvider('test-provider');
    registry.register(provider);

    expect(registry.unregister('test-provider')).toBe(true);
    expect(registry.has('test-provider')).toBe(false);
    expect(registry.get('test-provider')).toBeUndefined();
  });

  it('should return false when unregistering a non-existent provider', () => {
    expect(registry.unregister('non-existent')).toBe(false);
  });

  it('should list all providers', () => {
    const provider1 = new MockProvider('provider-1');
    const provider2 = new MockProvider('provider-2');

    registry.register(provider1);
    registry.register(provider2);

    const all = registry.getAll();
    expect(all).toHaveLength(2);
    expect(all).toContain(provider1);
    expect(all).toContain(provider2);
  });

  it('should get provider IDs', () => {
    const provider1 = new MockProvider('provider-1');
    const provider2 = new MockProvider('provider-2');

    registry.register(provider1);
    registry.register(provider2);

    const ids = registry.getProviderIds();
    expect(ids).toHaveLength(2);
    expect(ids).toContain('provider-1');
    expect(ids).toContain('provider-2');
  });

  it('should find healthy providers', async () => {
    const healthyProvider = new MockProvider('healthy', true);
    const unhealthyProvider = new MockProvider('unhealthy', false);

    registry.register(healthyProvider);
    registry.register(unhealthyProvider);

    const healthy = await registry.findHealthyProviders();
    expect(healthy).toHaveLength(1);
    expect(healthy[0]).toBe(healthyProvider);
  });

  it('should clear all providers', () => {
    registry.register(new MockProvider('provider-1'));
    registry.register(new MockProvider('provider-2'));

    registry.clear();

    expect(registry.getAll()).toHaveLength(0);
  });
});
