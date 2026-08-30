/**
 * Memory System Tests
 */

import { describe, it, expect, beforeEach } from 'vitest';
import { MemoryService } from '../MemoryService';
import { InMemoryMemoryStore } from '../store';
import {
  createImportanceScore,
  createConfidenceScore,
} from '../types';
import { SimpleMemoryContextProvider } from '../AIContextIntegration';

describe('MemoryService', () => {
  let memoryService: MemoryService;

  beforeEach(async () => {
    memoryService = new MemoryService(new InMemoryMemoryStore());
    await memoryService.initialize();
  });

  describe('initialization', () => {
    it('should initialize successfully', async () => {
      expect(memoryService.isInitialized()).toBe(true);
    });

    it('should throw when operating before initialization', async () => {
      const service = new MemoryService(new InMemoryMemoryStore());
      await expect(service.getMemory('test')).rejects.toThrow('not initialized');
    });
  });

  describe('memory creation', () => {
    it('should create a memory with all fields', async () => {
      const memory = await memoryService.createMemory({
        content: 'Test memory',
        category: 'conversation',
        source: { type: 'test' },
        importance: createImportanceScore(0.7),
        confidence: createConfidenceScore(0.9),
        projectId: 'project-1',
        metadata: { key: 'value' },
      });

      expect(memory.id).toBeDefined();
      expect(memory.content).toBe('Test memory');
      expect(memory.category).toBe('conversation');
      expect(memory.importance).toBe(0.7);
      expect(memory.confidence).toBe(0.9);
      expect(memory.projectId).toBe('project-1');
      expect(memory.metadata?.key).toBe('value');
      expect(memory.isDeleted).toBe(false);
    });

    it('should reject empty content', async () => {
      await expect(
        memoryService.createMemory({
          content: '   ',
          category: 'conversation',
          source: { type: 'test' },
        }),
      ).rejects.toThrow('empty');
    });

    it('should auto-generate ID if not provided', async () => {
      const m1 = await memoryService.createMemory({
        content: 'Memory 1',
        category: 'conversation',
        source: { type: 'test' },
      });

      const m2 = await memoryService.createMemory({
        content: 'Memory 2',
        category: 'conversation',
        source: { type: 'test' },
      });

      expect(m1.id).not.toBe(m2.id);
    });

    it('should set default importance and confidence', async () => {
      const memory = await memoryService.createMemory({
        content: 'Test',
        category: 'conversation',
        source: { type: 'test' },
      });

      expect(memory.importance).toBe(0.5);
      expect(memory.confidence).toBe(1.0);
    });

    it('should preserve timestamps', async () => {
      const before = new Date();
      const memory = await memoryService.createMemory({
        content: 'Test',
        category: 'conversation',
        source: { type: 'test' },
      });
      const after = new Date();

      expect(memory.createdAt).toBeInstanceOf(Date);
      expect(memory.updatedAt).toBeInstanceOf(Date);
      expect(memory.createdAt.getTime()).toBeGreaterThanOrEqual(before.getTime());
      expect(memory.createdAt.getTime()).toBeLessThanOrEqual(after.getTime());
    });
  });

  describe('memory retrieval', () => {
    it('should get memory by ID', async () => {
      const created = await memoryService.createMemory({
        content: 'Test memory',
        category: 'conversation',
        source: { type: 'test' },
      });

      const retrieved = await memoryService.getMemory(created.id);

      expect(retrieved).not.toBeNull();
      expect(retrieved?.id).toBe(created.id);
      expect(retrieved?.content).toBe('Test memory');
    });

    it('should return null for non-existent memory', async () => {
      const retrieved = await memoryService.getMemory('non-existent');
      expect(retrieved).toBeNull();
    });
  });

  describe('memory listing', () => {
    beforeEach(async () => {
      await memoryService.createMemory({
        content: 'Conversation 1',
        category: 'conversation',
        source: { type: 'test' },
      });
      await memoryService.createMemory({
        content: 'Project 1',
        category: 'project',
        source: { type: 'test' },
      });
      await memoryService.createMemory({
        content: 'Learning 1',
        category: 'learning',
        source: { type: 'test' },
      });
    });

    it('should list all active memories', async () => {
      const result = await memoryService.listMemories();
      expect(result.memories.length).toBe(3);
      expect(result.total).toBe(3);
      expect(result.hasMore).toBe(false);
    });

    it('should filter by category', async () => {
      const result = await memoryService.listMemories({ category: 'conversation' });
      expect(result.memories.length).toBe(1);
      expect(result.memories[0].category).toBe('conversation');
    });

    it('should filter by multiple categories', async () => {
      const result = await memoryService.listMemories({
        category: ['conversation', 'project'],
      });
      expect(result.memories.length).toBe(2);
    });

    it('should support pagination', async () => {
      const page1 = await memoryService.listMemories({ limit: 2, offset: 0 });
      expect(page1.memories.length).toBe(2);
      expect(page1.hasMore).toBe(true);
      expect(page1.total).toBe(3);

      const page2 = await memoryService.listMemories({ limit: 2, offset: 2 });
      expect(page2.memories.length).toBe(1);
      expect(page2.hasMore).toBe(false);
    });
  });

  describe('memory update', () => {
    it('should update memory content', async () => {
      const created = await memoryService.createMemory({
        content: 'Original',
        category: 'conversation',
        source: { type: 'test' },
      });

      const updated = await memoryService.updateMemory({
        id: created.id,
        content: 'Updated',
      });

      expect(updated?.content).toBe('Updated');
      expect(updated?.updatedAt.getTime()).toBeGreaterThanOrEqual(created.updatedAt.getTime());
    });

    it('should update scores', async () => {
      const created = await memoryService.createMemory({
        content: 'Test',
        category: 'conversation',
        source: { type: 'test' },
        importance: createImportanceScore(0.3),
      });

      const updated = await memoryService.updateMemory({
        id: created.id,
        importance: createImportanceScore(0.8),
      });

      expect(updated?.importance).toBe(0.8);
    });

    it('should merge metadata', async () => {
      const created = await memoryService.createMemory({
        content: 'Test',
        category: 'conversation',
        source: { type: 'test' },
        metadata: { key1: 'value1' },
      });

      const updated = await memoryService.updateMemory({
        id: created.id,
        metadata: { key2: 'value2' },
      });

      expect(updated?.metadata?.key1).toBe('value1');
      expect(updated?.metadata?.key2).toBe('value2');
    });

    it('should return null for non-existent memory', async () => {
      const updated = await memoryService.updateMemory({
        id: 'non-existent',
        content: 'New',
      });

      expect(updated).toBeNull();
    });
  });

  describe('memory deletion', () => {
    it('should soft-delete memory', async () => {
      const created = await memoryService.createMemory({
        content: 'Test',
        category: 'conversation',
        source: { type: 'test' },
      });

      const deleted = await memoryService.deleteMemory(created.id);

      expect(deleted?.isDeleted).toBe(true);
      expect(deleted?.deletedAt).toBeDefined();

      const retrieved = await memoryService.getMemory(created.id);
      expect(retrieved).not.toBeNull();
      expect(retrieved?.isDeleted).toBe(true);
    });

    it('should exclude deleted memories from listing', async () => {
      const m1 = await memoryService.createMemory({
        content: 'Active',
        category: 'conversation',
        source: { type: 'test' },
      });

      const m2 = await memoryService.createMemory({
        content: 'To delete',
        category: 'conversation',
        source: { type: 'test' },
      });

      await memoryService.deleteMemory(m2.id);

      const result = await memoryService.listMemories();
      expect(result.memories.length).toBe(1);
      expect(result.memories[0].id).toBe(m1.id);
    });

    it('should restore soft-deleted memory', async () => {
      const created = await memoryService.createMemory({
        content: 'Test',
        category: 'conversation',
        source: { type: 'test' },
      });

      await memoryService.deleteMemory(created.id);
      const restored = await memoryService.restoreMemory(created.id);

      expect(restored?.isDeleted).toBe(false);
      expect(restored?.deletedAt).toBeUndefined();

      const result = await memoryService.listMemories();
      expect(result.memories.length).toBe(1);
    });

    it('should permanently delete memory', async () => {
      const created = await memoryService.createMemory({
        content: 'Test',
        category: 'conversation',
        source: { type: 'test' },
      });

      const deleted = await memoryService.permanentlyDeleteMemory(created.id);
      expect(deleted).toBe(true);

      const retrieved = await memoryService.getMemory(created.id);
      expect(retrieved).toBeNull();
    });
  });

  describe('memory search', () => {
    beforeEach(async () => {
      await memoryService.createMemory({
        content: 'Python programming is fun',
        category: 'learning',
        source: { type: 'test' },
      });
      await memoryService.createMemory({
        content: 'TypeScript is also fun',
        category: 'learning',
        source: { type: 'test' },
      });
      await memoryService.createMemory({
        content: 'Project status meeting',
        category: 'project',
        source: { type: 'test' },
      });
    });

    it('should search by content text', async () => {
      const result = await memoryService.searchMemories('programming');
      expect(result.memories.length).toBe(1);
      expect(result.memories[0].content).toContain('programming');
    });

    it('should search with category filter', async () => {
      const result = await memoryService.searchMemories('fun', 'learning');
      expect(result.memories.length).toBe(2);
      expect(result.memories.every((m) => m.category === 'learning')).toBe(true);
    });

    it('should be case-insensitive', async () => {
      const result = await memoryService.searchMemories('PROGRAMMING');
      expect(result.memories.length).toBe(1);
    });
  });

  describe('project memories', () => {
    beforeEach(async () => {
      await memoryService.createMemory({
        content: 'Project A task 1',
        category: 'project',
        source: { type: 'test' },
        projectId: 'project-a',
      });
      await memoryService.createMemory({
        content: 'Project A task 2',
        category: 'project',
        source: { type: 'test' },
        projectId: 'project-a',
      });
      await memoryService.createMemory({
        content: 'Project B task 1',
        category: 'project',
        source: { type: 'test' },
        projectId: 'project-b',
      });
    });

    it('should get memories by project ID', async () => {
      const result = await memoryService.getProjectMemories('project-a');
      expect(result.memories.length).toBe(2);
      expect(result.memories.every((m) => m.projectId === 'project-a')).toBe(true);
    });
  });

  describe('statistics', () => {
    beforeEach(async () => {
      await memoryService.createMemory({
        content: 'High importance',
        category: 'long_term',
        source: { type: 'test' },
        importance: createImportanceScore(0.9),
      });
      await memoryService.createMemory({
        content: 'Low importance',
        category: 'temporary',
        source: { type: 'test' },
        importance: createImportanceScore(0.1),
      });
      await memoryService.createMemory({
        content: 'High confidence',
        category: 'knowledge',
        source: { type: 'test' },
        confidence: createConfidenceScore(0.95),
      });
    });

    it('should calculate statistics', async () => {
      const stats = await memoryService.getStats();

      expect(stats.totalMemories).toBe(3);
      expect(stats.activeMemories).toBe(3);
      expect(stats.deletedMemories).toBe(0);
      expect(stats.byCategory.long_term).toBe(1);
      expect(stats.byCategory.temporary).toBe(1);
      expect(stats.byCategory.knowledge).toBe(1);
      expect(stats.avgImportance).toBeCloseTo((0.9 + 0.1 + 0.5) / 3, 2);
    });

    it('should update statistics after deletion', async () => {
      const memories = await memoryService.listMemories();
      await memoryService.deleteMemory(memories.memories[0].id);

      const stats = await memoryService.getStats();
      expect(stats.activeMemories).toBe(2);
      expect(stats.deletedMemories).toBe(1);
    });
  });

  describe('expiration', () => {
    it('should create memory with expiration', async () => {
      const expiresAt = new Date(Date.now() + 1000);
      const memory = await memoryService.createMemory({
        content: 'Temporary memory',
        category: 'temporary',
        source: { type: 'test' },
        expiresAt,
      });

      expect(memory.expiresAt).toEqual(expiresAt);
    });

    it('should prune expired memories', async () => {
      const pastDate = new Date(Date.now() - 1000);
      await memoryService.createMemory({
        content: 'Expired',
        category: 'temporary',
        source: { type: 'test' },
        expiresAt: pastDate,
      });

      await memoryService.createMemory({
        content: 'Not expired',
        category: 'temporary',
        source: { type: 'test' },
      });

      const pruned = await memoryService.pruneExpired();
      expect(pruned).toBe(1);

      const result = await memoryService.listMemories();
      expect(result.memories.length).toBe(1);
      expect(result.memories[0].content).toBe('Not expired');
    });
  });

  describe('metadata preservation', () => {
    it('should preserve source metadata', async () => {
      const memory = await memoryService.createMemory({
        content: 'Test',
        category: 'conversation',
        source: {
          type: 'conversation',
          id: 'conv-123',
          metadata: { sessionId: 'session-456' },
        },
      });

      expect(memory.source.type).toBe('conversation');
      expect(memory.source.id).toBe('conv-123');
      expect(memory.source.metadata?.sessionId).toBe('session-456');
    });

    it('should preserve custom metadata', async () => {
      const memory = await memoryService.createMemory({
        content: 'Test',
        category: 'learning',
        source: { type: 'ai_inference' },
        metadata: {
          model: 'gpt-4',
          confidence: 0.95,
          topic: 'python',
        },
      });

      expect(memory.metadata?.model).toBe('gpt-4');
      expect(memory.metadata?.topic).toBe('python');
    });
  });

  describe('storage abstraction', () => {
    it('should work with custom store implementation', async () => {
      const customStore = new InMemoryMemoryStore();
      const service = new MemoryService(customStore);
      await service.initialize();

      const memory = await service.createMemory({
        content: 'Test',
        category: 'conversation',
        source: { type: 'test' },
      });

      expect(memory.id).toBeDefined();
      expect(memory.content).toBe('Test');
    });
  });

  describe('privacy and deletion', () => {
    it('should support user-controlled deletion', async () => {
      const memory = await memoryService.createMemory({
        content: 'Private data',
        category: 'preference',
        source: { type: 'user_input' },
      });

      expect(memory.isDeleted).toBe(false);

      await memoryService.deleteMemory(memory.id);
      const deleted = await memoryService.getMemory(memory.id);
      expect(deleted?.isDeleted).toBe(true);
    });

    it('should not auto-persist without explicit create', async () => {
      const result = await memoryService.listMemories();
      const initialCount = result.memories.length;

      // Just calling other methods shouldn't create memories
      await memoryService.getStats();
      await memoryService.listMemories();

      const afterCount = (await memoryService.listMemories()).memories.length;
      expect(afterCount).toBe(initialCount);
    });
  });
});

describe('Memory Context Integration', () => {
  let memoryService: MemoryService;
  let contextProvider: SimpleMemoryContextProvider;

  beforeEach(async () => {
    memoryService = new MemoryService(new InMemoryMemoryStore());
    await memoryService.initialize();
    contextProvider = new SimpleMemoryContextProvider(memoryService as never);
  });

  it('should retrieve relevant memories', async () => {
    await memoryService.createMemory({
      content: 'Important Python knowledge',
      category: 'knowledge',
      source: { type: 'test' },
      importance: createImportanceScore(0.7),
    });

    const memories = await contextProvider.getRelevantMemories('Python');
    expect(memories.length).toBe(1);
    expect(memories[0].content).toContain('Python');
  });

  it('should get high-importance memories', async () => {
    await memoryService.createMemory({
      content: 'Critical preference',
      category: 'preference',
      source: { type: 'test' },
      importance: createImportanceScore(0.9),
    });

    await memoryService.createMemory({
      content: 'Low priority task',
      category: 'project',
      source: { type: 'test' },
      importance: createImportanceScore(0.2),
    });

    const important = await contextProvider.getHighImportanceMemories();
    expect(important.length).toBe(1);
    expect(important[0].importance).toBe(0.9);
  });
});
