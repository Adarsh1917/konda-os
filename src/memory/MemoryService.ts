/**
 * Memory Service - Application-facing API
 *
 * This module provides the high-level interface for memory operations.
 * Applications interact with this service, not directly with the storage layer.
 */

import type {
  MemoryRecord,
  MemoryCategory,
  CreateMemoryRequest,
  UpdateMemoryRequest,
  MemoryQuery,
  MemoryQueryResult,
  MemoryStoreStats,
} from './types';
import type { IMemoryStore } from './store';
import { InMemoryMemoryStore } from './store';

/**
 * MemoryService provides the application-facing API for memory operations.
 *
 * It is responsible for:
 * - Validation and normalization of inputs
 * - Lifecycle management (expiration, pruning)
 * - Observability and statistics
 * - Integration with other systems (AIContext, etc.)
 */
export class MemoryService {
  private store: IMemoryStore;
  private initialized = false;

  /**
   * Create a new MemoryService.
   *
   * @param store - Storage implementation (defaults to in-memory for development)
   */
  constructor(store?: IMemoryStore) {
    this.store = store ?? new InMemoryMemoryStore();
  }

  /**
   * Initialize the service.
   * Must be called before any operations.
   */
  async initialize(): Promise<void> {
    if (this.initialized) {
      return;
    }
    await this.store.initialize();
    this.initialized = true;
  }

  /**
   * Ensure service is initialized.
   */
  private ensureInitialized(): void {
    if (!this.initialized) {
      throw new Error('MemoryService not initialized. Call initialize() first.');
    }
  }

  /**
   * Create a new memory.
   *
   * @param request - Memory creation request
   * @returns Created memory record
   */
  async createMemory(request: CreateMemoryRequest): Promise<MemoryRecord> {
    this.ensureInitialized();

    if (!request.content || request.content.trim().length === 0) {
      throw new Error('Memory content cannot be empty');
    }

    return this.store.create(request);
  }

  /**
   * Get a memory by ID.
   *
   * @param id - Memory ID
   * @returns Memory record or null if not found
   */
  async getMemory(id: string): Promise<MemoryRecord | null> {
    this.ensureInitialized();
    return this.store.get(id);
  }

  /**
   * List all memories matching query criteria.
   *
   * @param query - Query criteria
   * @returns Query results with pagination
   */
  async listMemories(query?: Partial<MemoryQuery>): Promise<MemoryQueryResult> {
    this.ensureInitialized();

    const fullQuery: MemoryQuery = {
      includeDeleted: false,
      limit: 100,
      offset: 0,
      ...query,
    };

    return this.store.query(fullQuery);
  }

  /**
   * Search memories by content text.
   *
   * @param query - Text to search for
   * @param category - Optional category filter
   * @returns Query results
   */
  async searchMemories(query: string, category?: MemoryCategory): Promise<MemoryQueryResult> {
    this.ensureInitialized();

    return this.store.query({
      contentSearch: query,
      category,
      includeDeleted: false,
      limit: 100,
    });
  }

  /**
   * Get memories by category.
   *
   * @param category - Memory category
   * @param limit - Maximum number to return
   * @returns Query results
   */
  async getMemoriesByCategory(category: MemoryCategory, limit = 100): Promise<MemoryQueryResult> {
    this.ensureInitialized();

    return this.store.query({
      category,
      includeDeleted: false,
      limit,
    });
  }

  /**
   * Get memories associated with a project.
   *
   * @param projectId - Project ID
   * @param limit - Maximum number to return
   * @returns Query results
   */
  async getProjectMemories(projectId: string, limit = 100): Promise<MemoryQueryResult> {
    this.ensureInitialized();

    return this.store.query({
      projectId,
      includeDeleted: false,
      limit,
    });
  }

  /**
   * Update an existing memory.
   *
   * @param request - Update request
   * @returns Updated memory or null if not found
   */
  async updateMemory(request: UpdateMemoryRequest): Promise<MemoryRecord | null> {
    this.ensureInitialized();

    const memory = await this.store.get(request.id);
    if (!memory) {
      return null;
    }

    return this.store.update(request);
  }

  /**
   * Delete a memory (soft delete - can be restored).
   *
   * @param id - Memory ID
   * @returns Deleted memory or null if not found
   */
  async deleteMemory(id: string): Promise<MemoryRecord | null> {
    this.ensureInitialized();
    return this.store.delete(id);
  }

  /**
   * Permanently delete a memory (hard delete - cannot be restored).
   *
   * @param id - Memory ID
   * @returns true if deleted, false if not found
   */
  async permanentlyDeleteMemory(id: string): Promise<boolean> {
    this.ensureInitialized();
    return this.store.permanentlyDelete(id);
  }

  /**
   * Restore a soft-deleted memory.
   *
   * @param id - Memory ID
   * @returns Restored memory or null if not found
   */
  async restoreMemory(id: string): Promise<MemoryRecord | null> {
    this.ensureInitialized();
    return this.store.restore(id);
  }

  /**
   * Get statistics about stored memories.
   *
   * @returns Statistics
   */
  async getStats(): Promise<MemoryStoreStats> {
    this.ensureInitialized();
    return this.store.getStats();
  }

  /**
   * Prune expired memories.
   * Should be called periodically (e.g., on startup, hourly).
   *
   * @returns Number of expired memories deleted
   */
  async pruneExpired(): Promise<number> {
    this.ensureInitialized();
    return this.store.pruneExpired();
  }

  /**
   * Clear all memories (useful for testing and development).
   * WARNING: This is a destructive operation.
   */
  async clear(): Promise<void> {
    this.ensureInitialized();
    await this.store.clear();
  }

  /**
   * Check if the service is initialized.
   */
  isInitialized(): boolean {
    return this.initialized;
  }
}

/**
 * Global memory service instance.
 * Applications typically use this singleton.
 */
export const memoryService = new MemoryService();
