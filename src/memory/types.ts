/**
 * Memory Types for Konda OS
 *
 * Memory is one of the core differentiators of Konda OS.
 * This module defines the fundamental types for the memory system.
 */

/**
 * Supported memory categories.
 *
 * The long-term design includes multiple memory types serving different purposes:
 * - Conversation: Dialog history and interactions
 * - Project: Project-related context and state
 * - Learning: Skills, patterns, and knowledge acquired
 * - Preference: User preferences and settings
 * - Skill: Capabilities and expertise
 * - Knowledge: General knowledge base
 * - Context: Immediate contextual information
 * - LongTerm: Persistent, important information
 * - Temporary: Short-lived, session-scoped data
 * - Semantic: Embeddings and vector representations (future)
 */
export type MemoryCategory =
  | 'conversation'
  | 'project'
  | 'learning'
  | 'preference'
  | 'skill'
  | 'knowledge'
  | 'context'
  | 'long_term'
  | 'temporary'
  | 'semantic';

/**
 * Memory importance score.
 * 0 = low importance, 1 = critical importance
 */
export type ImportanceScore = number & { readonly __brand: 'ImportanceScore' };

/**
 * Memory confidence score.
 * 0 = low confidence, 1 = high confidence
 */
export type ConfidenceScore = number & { readonly __brand: 'ConfidenceScore' };

/**
 * Helper to create branded confidence score.
 */
export function createConfidenceScore(value: number): ConfidenceScore {
  if (value < 0 || value > 1) {
    throw new Error('Confidence score must be between 0 and 1');
  }
  return value as ConfidenceScore;
}

/**
 * Helper to create branded importance score.
 */
export function createImportanceScore(value: number): ImportanceScore {
  if (value < 0 || value > 1) {
    throw new Error('Importance score must be between 0 and 1');
  }
  return value as ImportanceScore;
}

/**
 * Metadata about the source of a memory.
 */
export interface MemorySource {
  /**
   * Type of source (e.g., 'conversation', 'user_input', 'system_action', 'ai_inference')
   */
  type: string;

  /**
   * Identifier of the source (e.g., conversation ID, API endpoint)
   */
  id?: string;

  /**
   * Additional metadata about the source
   */
  metadata?: Record<string, unknown>;
}

/**
 * Core memory record representing a single piece of information.
 */
export interface MemoryRecord {
  /**
   * Unique identifier for this memory.
   * Generated automatically if not provided.
   */
  id: string;

  /**
   * The actual content of the memory.
   * Can be text, structured data, or other serializable formats.
   */
  content: string;

  /**
   * Category/type of memory for organizational and retrieval purposes.
   */
  category: MemoryCategory;

  /**
   * Source of this memory (e.g., user input, AI inference, system action).
   */
  source: MemorySource;

  /**
   * When this memory was first created.
   */
  createdAt: Date;

  /**
   * When this memory was last updated.
   */
  updatedAt: Date;

  /**
   * Optional expiration time. If set, memory may be automatically pruned after this date.
   * Allows for temporary/session-scoped memory.
   */
  expiresAt?: Date;

  /**
   * Importance score (0-1).
   * Used for prioritizing which memories to retain when storage is constrained.
   */
  importance: ImportanceScore;

  /**
   * Confidence score (0-1).
   * Indicates how certain we are about the accuracy of this memory.
   */
  confidence: ConfidenceScore;

  /**
   * Optional project or context association.
   * Allows organizing memories by project/workspace.
   */
  projectId?: string;

  /**
   * Optional contextual metadata.
   * Extensible field for application-specific data.
   */
  metadata?: Record<string, unknown>;

  /**
   * Whether this memory has been explicitly marked for deletion.
   * Allows soft-delete pattern where users can undo deletion.
   */
  isDeleted?: boolean;

  /**
   * When this memory was marked for deletion (if applicable).
   */
  deletedAt?: Date;
}

/**
 * Request to create a new memory.
 */
export interface CreateMemoryRequest {
  /**
   * The content to store.
   */
  content: string;

  /**
   * Category of the memory.
   */
  category: MemoryCategory;

  /**
   * Source of the memory.
   */
  source: MemorySource;

  /**
   * Optional expiration time.
   */
  expiresAt?: Date;

  /**
   * Importance score (defaults to 0.5).
   */
  importance?: ImportanceScore;

  /**
   * Confidence score (defaults to 1.0 for user-provided, lower for inferred).
   */
  confidence?: ConfidenceScore;

  /**
   * Optional project ID.
   */
  projectId?: string;

  /**
   * Optional metadata.
   */
  metadata?: Record<string, unknown>;
}

/**
 * Request to update an existing memory.
 */
export interface UpdateMemoryRequest {
  /**
   * Memory ID to update.
   */
  id: string;

  /**
   * New content (optional).
   */
  content?: string;

  /**
   * New importance score (optional).
   */
  importance?: ImportanceScore;

  /**
   * New confidence score (optional).
   */
  confidence?: ConfidenceScore;

  /**
   * New expiration time (optional).
   */
  expiresAt?: Date;

  /**
   * New metadata (merged with existing).
   */
  metadata?: Record<string, unknown>;
}

/**
 * Query criteria for searching/filtering memories.
 */
export interface MemoryQuery {
  /**
   * Filter by category.
   */
  category?: MemoryCategory | MemoryCategory[];

  /**
   * Filter by project ID.
   */
  projectId?: string;

  /**
   * Search in content (simple text matching).
   */
  contentSearch?: string;

  /**
   * Only return memories created after this date.
   */
  createdAfter?: Date;

  /**
   * Only return memories created before this date.
   */
  createdBefore?: Date;

  /**
   * Minimum importance score.
   */
  minImportance?: ImportanceScore;

  /**
   * Minimum confidence score.
   */
  minConfidence?: ConfidenceScore;

  /**
   * Include deleted memories (default: false).
   */
  includeDeleted?: boolean;

  /**
   * Pagination limit.
   */
  limit?: number;

  /**
   * Pagination offset.
   */
  offset?: number;
}

/**
 * Result of a memory query.
 */
export interface MemoryQueryResult {
  /**
   * Matching memory records.
   */
  memories: MemoryRecord[];

  /**
   * Total number of matching records (may exceed length if paginated).
   */
  total: number;

  /**
   * Whether there are more results available.
   */
  hasMore: boolean;
}

/**
 * Statistics about the memory store.
 */
export interface MemoryStoreStats {
  /**
   * Total number of memories (including deleted).
   */
  totalMemories: number;

  /**
   * Number of active (non-deleted) memories.
   */
  activeMemories: number;

  /**
   * Number of deleted memories.
   */
  deletedMemories: number;

  /**
   * Breakdown by category.
   */
  byCategory: Record<MemoryCategory, number>;

  /**
   * Average importance score across all memories.
   */
  avgImportance: number;

  /**
   * Average confidence score across all memories.
   */
  avgConfidence: number;
}
