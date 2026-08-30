/**
 * Storage Abstraction for Memory System
 *
 * This module defines the storage contract that all memory store implementations must follow.
 * It decouples the MemoryService from specific storage technologies (in-memory, SQLite, etc.).
 */

import type {
  MemoryRecord,
  CreateMemoryRequest,
  UpdateMemoryRequest,
  MemoryQuery,
  MemoryQueryResult,
  MemoryStoreStats,
} from './types';

/**
 * Abstract storage interface for memory records.
 *
 * Implementations can be:
 * - In-memory (for tests)
 * - SQLite (for local persistence)
 * - IndexedDB (for web)
 * - Future cloud storage
 *
 * All operations should be reasonably fast and deterministic.
 */
export interface IMemoryStore {
  /**
   * Initialize the store (e.g., create tables, connect to database).
   * This should be idempotent.
   */
  initialize(): Promise<void>;

  /**
   * Create a new memory record and persist it.
   *
   * @param request - Create request with content, category, source, etc.
   * @returns The created memory record (including generated ID)
   */
  create(request: CreateMemoryRequest): Promise<MemoryRecord>;

  /**
   * Retrieve a single memory by ID.
   *
   * @param id - Memory ID
   * @returns The memory record, or null if not found
   */
  get(id: string): Promise<MemoryRecord | null>;

  /**
   * Query memories based on criteria.
   *
   * @param query - Query criteria (category, project, search, dates, scores, pagination)
   * @returns Matching memories with pagination info
   */
  query(query: MemoryQuery): Promise<MemoryQueryResult>;

  /**
   * Update an existing memory.
   *
   * @param request - Update request with ID and optional new fields
   * @returns The updated memory record, or null if not found
   */
  update(request: UpdateMemoryRequest): Promise<MemoryRecord | null>;

  /**
   * Soft-delete a memory (mark as deleted but keep the record).
   * This allows for "undo" functionality.
   *
   * @param id - Memory ID
   * @returns The deleted memory record, or null if not found
   */
  delete(id: string): Promise<MemoryRecord | null>;

  /**
   * Permanently delete a memory (hard delete).
   * Use with caution - this cannot be undone.
   *
   * @param id - Memory ID
   * @returns true if deleted, false if not found
   */
  permanentlyDelete(id: string): Promise<boolean>;

  /**
   * Restore a soft-deleted memory.
   *
   * @param id - Memory ID
   * @returns The restored memory record, or null if not found
   */
  restore(id: string): Promise<MemoryRecord | null>;

  /**
   * Clear all memories (useful for testing).
   * This is a hard operation - data cannot be recovered.
   */
  clear(): Promise<void>;

  /**
   * Get statistics about stored memories.
   *
   * @returns Statistics including counts, breakdown by category, average scores
   */
  getStats(): Promise<MemoryStoreStats>;

  /**
   * Prune expired memories (delete those with expiresAt in the past).
   * This is typically called periodically by the MemoryService.
   *
   * @returns Number of expired memories deleted
   */
  pruneExpired(): Promise<number>;
}

/**
 * In-memory implementation of IMemoryStore for testing and development.
 * Does not persist data across restarts.
 */
export class InMemoryMemoryStore implements IMemoryStore {
  private memories: Map<string, MemoryRecord> = new Map();
  private nextId = 0;

  async initialize(): Promise<void> {
    this.memories.clear();
    this.nextId = 0;
  }

  async create(request: CreateMemoryRequest): Promise<MemoryRecord> {
    const id = `memory_${++this.nextId}`;
    const now = new Date();

    const memory: MemoryRecord = {
      id,
      content: request.content,
      category: request.category,
      source: request.source,
      createdAt: now,
      updatedAt: now,
      expiresAt: request.expiresAt,
      importance: request.importance ?? (0.5 as never),
      confidence: request.confidence ?? (1.0 as never),
      projectId: request.projectId,
      metadata: request.metadata,
      isDeleted: false,
    };

    this.memories.set(id, memory);
    return memory;
  }

  async get(id: string): Promise<MemoryRecord | null> {
    return this.memories.get(id) ?? null;
  }

  async query(query: MemoryQuery): Promise<MemoryQueryResult> {
    let results: MemoryRecord[] = Array.from(this.memories.values());

    // Filter by deleted status
    if (!query.includeDeleted) {
      results = results.filter((m) => !m.isDeleted);
    }

    // Filter by category
    if (query.category) {
      const categories = Array.isArray(query.category) ? query.category : [query.category];
      results = results.filter((m) => categories.includes(m.category));
    }

    // Filter by project
    if (query.projectId) {
      results = results.filter((m) => m.projectId === query.projectId);
    }

    // Search in content
    if (query.contentSearch) {
      const search = query.contentSearch.toLowerCase();
      results = results.filter((m) => m.content.toLowerCase().includes(search));
    }

    // Filter by date range
    if (query.createdAfter) {
      results = results.filter((m) => m.createdAt >= query.createdAfter!);
    }
    if (query.createdBefore) {
      results = results.filter((m) => m.createdAt <= query.createdBefore!);
    }

    // Filter by importance score
    if (query.minImportance !== undefined) {
      results = results.filter((m) => m.importance >= query.minImportance!);
    }

    // Filter by confidence score
    if (query.minConfidence !== undefined) {
      results = results.filter((m) => m.confidence >= query.minConfidence!);
    }

    // Sort by creation date (newest first)
    results.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());

    const total = results.length;
    const offset = query.offset ?? 0;
    const limit = query.limit ?? 100;
    const paged = results.slice(offset, offset + limit);
    const hasMore = offset + limit < total;

    return {
      memories: paged,
      total,
      hasMore,
    };
  }

  async update(request: UpdateMemoryRequest): Promise<MemoryRecord | null> {
    const memory = this.memories.get(request.id);
    if (!memory) {
      return null;
    }

    if (request.content !== undefined) {
      memory.content = request.content;
    }
    if (request.importance !== undefined) {
      memory.importance = request.importance;
    }
    if (request.confidence !== undefined) {
      memory.confidence = request.confidence;
    }
    if (request.expiresAt !== undefined) {
      memory.expiresAt = request.expiresAt;
    }
    if (request.metadata !== undefined) {
      memory.metadata = { ...memory.metadata, ...request.metadata };
    }

    memory.updatedAt = new Date();
    this.memories.set(request.id, memory);
    return memory;
  }

  async delete(id: string): Promise<MemoryRecord | null> {
    const memory = this.memories.get(id);
    if (!memory) {
      return null;
    }

    memory.isDeleted = true;
    memory.deletedAt = new Date();
    this.memories.set(id, memory);
    return memory;
  }

  async permanentlyDelete(id: string): Promise<boolean> {
    return this.memories.delete(id);
  }

  async restore(id: string): Promise<MemoryRecord | null> {
    const memory = this.memories.get(id);
    if (!memory) {
      return null;
    }

    memory.isDeleted = false;
    memory.deletedAt = undefined;
    memory.updatedAt = new Date();
    this.memories.set(id, memory);
    return memory;
  }

  async clear(): Promise<void> {
    this.memories.clear();
    this.nextId = 0;
  }

  async getStats(): Promise<MemoryStoreStats> {
    const memories = Array.from(this.memories.values());
    const active = memories.filter((m) => !m.isDeleted);
    const deleted = memories.filter((m) => m.isDeleted);

    const byCategory: Record<string, number> = {};
    for (const memory of active) {
      byCategory[memory.category] = (byCategory[memory.category] ?? 0) + 1;
    }

    const avgImportance = active.length > 0 ? active.reduce((sum, m) => sum + m.importance, 0) / active.length : 0;
    const avgConfidence = active.length > 0 ? active.reduce((sum, m) => sum + m.confidence, 0) / active.length : 0;

    return {
      totalMemories: memories.length,
      activeMemories: active.length,
      deletedMemories: deleted.length,
      byCategory: byCategory as Record<string, number>,
      avgImportance,
      avgConfidence,
    };
  }

  async pruneExpired(): Promise<number> {
    const now = new Date();
    let pruned = 0;

    for (const [id, memory] of this.memories) {
      if (memory.expiresAt && memory.expiresAt <= now && !memory.isDeleted) {
        await this.delete(id);
        pruned++;
      }
    }

    return pruned;
  }
}
