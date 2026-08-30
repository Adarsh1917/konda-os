/**
 * AI Context Integration for Memory System
 *
 * This module defines the integration boundary between the Memory System
 * and the AIContextManager.
 *
 * It is currently a placeholder for future sophisticated memory retrieval.
 */

import type { MemoryRecord, MemoryCategory } from './types';
import type { MemoryService } from './MemoryService';
import { memoryService } from './MemoryService';

/**
 * Interface that AIContextManager can use to request relevant memories.
 * This is the primary integration point with the AI system.
 */
export interface IMemoryContextProvider {
  /**
   * Get relevant memories for an AI request.
   *
   * In a simple implementation, this just searches/filters by category.
   * In future, this could perform semantic search using embeddings.
   *
   * @param query - Context query (e.g., "show me project memories")
   * @param category - Optional category filter
   * @param limit - Maximum memories to return
   * @returns Relevant memories
   */
  getRelevantMemories(
    query: string,
    category?: MemoryCategory,
    limit?: number,
  ): Promise<MemoryRecord[]>;

  /**
   * Get conversation-specific memories.
   * These are memories from past conversations relevant to the current context.
   *
   * @param conversationId - ID of current/past conversation
   * @param limit - Maximum memories to return
   * @returns Conversation memories
   */
  getConversationMemories(conversationId: string, limit?: number): Promise<MemoryRecord[]>;

  /**
   * Get high-importance memories that should always be included in context.
   * These are critical facts, preferences, or long-term memories.
   *
   * @param limit - Maximum memories to return
   * @returns High-importance memories
   */
  getHighImportanceMemories(limit?: number): Promise<MemoryRecord[]>;
}

/**
 * Simple memory context provider implementation.
 *
 * This provides basic memory retrieval for AI context.
 * Future implementations can add semantic search, embeddings, ranking, etc.
 */
export class SimpleMemoryContextProvider implements IMemoryContextProvider {
  private service: MemoryService;

  constructor(service: MemoryService) {
    this.service = service;
  }

  async getRelevantMemories(
    query: string,
    category?: MemoryCategory,
    limit = 10,
  ): Promise<MemoryRecord[]> {
    const result = await this.service.listMemories({
      contentSearch: query,
      category,
      limit,
      minImportance: 0.3 as never, // Only include moderately important or more
    });

    return result.memories;
  }

  async getConversationMemories(conversationId: string, limit = 10): Promise<MemoryRecord[]> {
    const result = await this.service.listMemories({
      category: 'conversation',
      projectId: conversationId, // Use projectId as conversation ID in basic implementation
      limit,
    });

    return result.memories;
  }

  async getHighImportanceMemories(limit = 5): Promise<MemoryRecord[]> {
    const result = await this.service.listMemories({
      minImportance: 0.8 as never, // High importance threshold
      limit,
    });

    return result.memories;
  }
}

/**
 * Global memory context provider for AI system.
 * Assigned to singleton memoryService.
 */
export const memoryContextProvider = new SimpleMemoryContextProvider(memoryService);

/**
 * Utility to inject relevant memories into an AI context.
 * This would be called by AIContextManager before making an AI request.
 *
 * Example usage:
 * ```typescript
 * const memories = await enrichContextWithMemories(userQuery);
 * const context = { ...userQuery, relevantMemories: memories };
 * ```
 */
export async function enrichContextWithMemories(
  userQuery: string,
  category?: MemoryCategory,
): Promise<MemoryRecord[]> {
  return memoryContextProvider.getRelevantMemories(userQuery, category);
}

/**
 * Future: Semantic search stub
 * When embeddings/vector database is added, this can be implemented.
 *
 * Example future usage:
 * ```typescript
 * const embedding = await generateEmbedding(userQuery);
 * const results = await semanticSearchMemories(embedding, topK=10);
 * ```
 */
export async function semanticSearchMemories(
  // embedding: number[],
  // topK: number = 10,
): Promise<MemoryRecord[]> {
  // Future implementation: use vector similarity search
  // For now, return empty array
  return [];
}
