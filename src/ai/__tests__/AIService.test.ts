/**
 * Tests for AIService.
 */

import { describe, it, expect, beforeEach } from 'vitest';
import { AIService } from '../AIService';
import { ProviderRegistry } from '../registry/ProviderRegistry';
import { MockProvider } from './MockProvider';

describe('AIService', () => {
  let service: AIService;
  let registry: ProviderRegistry;

  beforeEach(() => {
    // Create a fresh registry for each test
    registry = new ProviderRegistry();
    service = new AIService(registry);
  });

  it('should have default provider and model', () => {
    expect(service.getSelectedProvider()).toBe('ollama');
    expect(service.getSelectedModel()).toBe('llama2');
  });

  it('should set and get selected provider', () => {
    const provider = new MockProvider('test-provider');
    registry.register(provider);

    service.setSelectedProvider('test-provider');
    expect(service.getSelectedProvider()).toBe('test-provider');
  });

  it('should set and get selected model', () => {
    service.setSelectedModel('mistral');
    expect(service.getSelectedModel()).toBe('mistral');
  });

  it('should report unhealthy when provider is not registered', async () => {
    const health = await service.getHealth();

    expect(health.status).toBe('unhealthy');
    expect(health.message).toContain('not registered');
  });

  it('should return empty models list when provider is not registered', async () => {
    const models = await service.listModels();

    expect(models).toHaveLength(0);
  });

  it('should throw when generating without a registered provider', async () => {
    const request = {
      model: 'llama2',
      prompt: 'Hello',
    };

    await expect(service.generate(request)).rejects.toThrow('not registered');
  });

  it('should throw when setting an unregistered provider', () => {
    expect(() => {
      service.setSelectedProvider('non-existent');
    }).toThrow('not registered');
  });
});
