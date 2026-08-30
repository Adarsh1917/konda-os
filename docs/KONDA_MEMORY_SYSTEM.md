# Konda OS Memory System Foundation

## Overview

The Memory System is one of the core differentiators of Konda OS. This document describes the foundational architecture of the memory system, as implemented in Milestone 5.

**Important**: This is the **foundation** of the memory system. Many advanced features described as "future" are deliberately not implemented in this milestone.

## Memory Philosophy

Konda OS memory must be:

- **User-Controlled**: Users decide what is remembered and can delete memories at any time
- **Intentional**: The system doesn't automatically dump every conversation into permanent memory
- **Structured**: Memories are organized by category and metadata for retrieval
- **Transparent**: Users can see what is stored, how it's categorized, and why
- **Private**: By default, memories remain local and under user control
- **Deletable**: Users have explicit control over memory deletion

## Architecture

### Layer 1: Storage Abstraction (IMemoryStore)

The storage layer is completely abstracted from business logic. This allows:

- Testing with in-memory storage
- Future replacement with persistent storage (SQLite, etc.)
- Future support for different storage backends

**Interface**: `IMemoryStore`

```
Application
    ↓
MemoryService
    ↓
IMemoryStore (abstraction boundary)
    ↓
InMemoryMemoryStore (current implementation)
```

All implementations of `IMemoryStore` must support:
- Create memory
- Retrieve memory by ID
- Query/search memories
- Update memory
- Soft-delete (mark deleted)
- Hard-delete (permanent)
- Restore soft-deleted memory
- Get statistics
- Prune expired memories

### Layer 2: MemoryService (Application API)

The `MemoryService` is the primary interface for applications to interact with memory. It provides:

- Memory creation with validation
- Retrieval and search
- Categorized listing
- Project-based organization
- Safe deletion (soft-delete by default)
- Expiration management
- Statistics

**Key Methods**:
```typescript
createMemory(request: CreateMemoryRequest): Promise<MemoryRecord>
getMemory(id: string): Promise<MemoryRecord | null>
listMemories(query?: Partial<MemoryQuery>): Promise<MemoryQueryResult>
searchMemories(query: string, category?: MemoryCategory): Promise<MemoryQueryResult>
updateMemory(request: UpdateMemoryRequest): Promise<MemoryRecord | null>
deleteMemory(id: string): Promise<MemoryRecord | null> // soft-delete
permanentlyDeleteMemory(id: string): Promise<boolean> // hard-delete
restoreMemory(id: string): Promise<MemoryRecord | null>
getStats(): Promise<MemoryStoreStats>
pruneExpired(): Promise<number>
```

### Layer 3: AI Context Integration

The AI Context Integration layer prepares memory for integration with the AI Orchestrator.

**Components**:

1. `IMemoryContextProvider`: Interface for AI context requests
2. `SimpleMemoryContextProvider`: Basic implementation
   - Retrieves relevant memories by text search
   - Retrieves conversation-specific memories
   - Retrieves high-importance memories

**Future**: This boundary will support semantic search when embeddings are added.

## Memory Record Structure

Every memory has:

```typescript
interface MemoryRecord {
  id: string                    // unique identifier
  content: string               // actual stored content
  category: MemoryCategory      // organizational category
  source: MemorySource          // origin (conversation, user, system, AI, etc.)
  createdAt: Date               // creation timestamp
  updatedAt: Date               // last modification timestamp
  expiresAt?: Date              // optional expiration (for temporary memory)
  importance: ImportanceScore   // 0-1 score (used for prioritization)
  confidence: ConfidenceScore   // 0-1 score (certainty of accuracy)
  projectId?: string            // optional project/context association
  metadata?: Record             // extensible custom metadata
  isDeleted?: boolean           // soft-delete flag
  deletedAt?: Date              // when marked for deletion
}
```

### Importance Score (0-1)

Used to prioritize which memories to retain when storage is constrained:

- **0.0-0.3**: Low importance (temporary thoughts, intermediate states)
- **0.3-0.7**: Medium importance (useful information, project details)
- **0.7-1.0**: High importance (preferences, critical facts, long-term learning)

### Confidence Score (0-1)

Indicates how certain the system is about the accuracy:

- **0.0-0.3**: Low confidence (speculation, tentative)
- **0.3-0.7**: Medium confidence (inferred, pattern-based)
- **0.7-1.0**: High confidence (user-provided, verified)

## Memory Categories

The current implementation supports 10 memory categories:

1. **conversation**: Dialog history and interactions
2. **project**: Project-related context and state
3. **learning**: Skills, patterns, knowledge acquired
4. **preference**: User preferences and settings
5. **skill**: Capabilities and expertise
6. **knowledge**: General knowledge base
7. **context**: Immediate contextual information
8. **long_term**: Persistent, important information
9. **temporary**: Short-lived, session-scoped data
10. **semantic**: Embeddings and vector representations (future)

Applications may store related memories in multiple categories. For example, "Python is my favorite language" could be stored as both `preference` and `skill`.

## Memory Lifecycle

### Create

```typescript
const memory = await memoryService.createMemory({
  content: "User prefers TypeScript over JavaScript",
  category: 'preference',
  source: { type: 'user_input', id: 'conv-123' },
  importance: 0.8,  // high importance preference
  confidence: 1.0,  // user directly stated
});
```

### Store

Memory is persisted immediately by the underlying store.

### Retrieve

```typescript
// By ID
const memory = await memoryService.getMemory(memoryId);

// By search
const results = await memoryService.searchMemories('TypeScript');

// By category
const prefs = await memoryService.getMemoriesByCategory('preference');

// By project
const projectMemories = await memoryService.getProjectMemories('project-id');
```

### Update

```typescript
const updated = await memoryService.updateMemory({
  id: memoryId,
  content: "User strongly prefers TypeScript",
  importance: 0.9,  // increase importance
  metadata: { reason: "used in daily work" }
});
```

### Delete

**Soft-Delete** (recommended, allows recovery):
```typescript
const deleted = await memoryService.deleteMemory(memoryId);
// Sets isDeleted=true, deletedAt=now
```

**Restore**:
```typescript
const restored = await memoryService.restoreMemory(memoryId);
```

**Hard-Delete** (permanent, use with caution):
```typescript
const permanentlyDeleted = await memoryService.permanentlyDeleteMemory(memoryId);
// Memory is completely removed from storage
```

## Privacy & User Control

### Core Principles

1. **No Hidden Memory**: Users control what is stored
2. **Explicit Creation**: Memories are created by explicit request, not automatic surveillance
3. **Easy Deletion**: Users can delete any memory at any time
4. **No Permanent Secrets**: The system doesn't lock users into memory they didn't create
5. **Soft-Delete Pattern**: By default, deletes are reversible

### Current Implementation

- Soft-delete by default (users can undo)
- Hard-delete available when explicitly requested
- No automatic memory capture
- All memories created through explicit `createMemory()` calls
- Memories not automatically persisted from AI responses

### Future Enhancements

- Audit log (who created/modified each memory)
- Data export
- Batch deletion policies
- Memory retention policies
- User-controlled expiration rules

## Expiration

Temporary memories can be configured to auto-expire:

```typescript
const temporary = await memoryService.createMemory({
  content: "Session token: abc123",
  category: 'temporary',
  source: { type: 'system_action' },
  expiresAt: new Date(Date.now() + 1000 * 60 * 60), // 1 hour
});
```

Expired memories are cleaned up via `pruneExpired()`:

```typescript
const pruned = await memoryService.pruneExpired();
console.log(`Deleted ${pruned} expired memories`);
```

The application should call `pruneExpired()` periodically (e.g., on startup, hourly).

## Storage Abstraction

The `IMemoryStore` interface allows different implementations:

### InMemoryMemoryStore (current)

- Fast, suitable for development and testing
- No persistence across restarts
- Limited by available RAM
- Fully deterministic

### Future Implementations

- **SQLiteMemoryStore**: Local persistent storage
- **IndexedDBMemoryStore**: Browser-based persistence
- **CloudMemoryStore**: Cloud-backed with sync
- **HybridMemoryStore**: Multiple layers (cache + persistent)

To use a custom store:

```typescript
const customStore = new SQLiteMemoryStore('./memory.db');
const service = new MemoryService(customStore);
await service.initialize();
```

## AI Context Integration (Future)

The memory system will integrate with the AI Orchestrator through the `AIContextIntegration` module.

**Future Flow**:

```
User Request
    ↓
AI Orchestrator
    ↓
AIContextManager
    ↓
enrichContextWithMemories(userQuery)
    ↓
relevant memories retrieved
    ↓
Memory + user query → AI Provider
    ↓
Response + new memories → store
```

**Currently Prepared For**:

1. `IMemoryContextProvider` interface for AI context requests
2. `SimpleMemoryContextProvider` for basic retrieval
3. Integration boundary in `AIContextIntegration.ts`
4. Future semantic search stub

**Not Yet Implemented**:

- Automatic memory retrieval in AI responses
- Vector embeddings
- Semantic similarity search
- Memory ranking by relevance
- Automatic memory creation from AI responses

## Statistics & Observability

Get memory store statistics:

```typescript
const stats = await memoryService.getStats();

{
  totalMemories: 42,
  activeMemories: 40,
  deletedMemories: 2,
  byCategory: {
    conversation: 15,
    preference: 8,
    knowledge: 10,
    learning: 5,
    skill: 2
  },
  avgImportance: 0.62,
  avgConfidence: 0.81
}
```

## Testing

All memory operations work deterministically with `InMemoryMemoryStore`:

```typescript
const memoryService = new MemoryService(new InMemoryMemoryStore());
await memoryService.initialize();

// Create, read, update, delete, search, etc.
```

Test coverage includes:

- ✅ Memory creation with validation
- ✅ Retrieval and querying
- ✅ Pagination and filtering
- ✅ Content search (case-insensitive)
- ✅ Category filtering
- ✅ Project-based organization
- ✅ Update with metadata merging
- ✅ Soft-delete and restore
- ✅ Hard-delete
- ✅ Expiration and pruning
- ✅ Statistics calculation
- ✅ Storage abstraction
- ✅ AI context integration
- ✅ Privacy behavior

## Current Limitations

1. **No Persistence**: Memories are lost when the application restarts (development phase)
2. **No Semantic Search**: Text search is literal substring matching
3. **No Vector Database**: Embeddings not yet implemented
4. **No Cloud Sync**: All memory is local
5. **No Automatic Memory Creation**: AI responses don't auto-save as memories
6. **No Memory Ranking**: All retrieved memories are unsorted
7. **No Filtering by Confidence**: All memories retrieved regardless of confidence
8. **No Memory Relationships**: No linking between memories
9. **No Knowledge Graph**: No semantic relationships tracked

These are intentionally deferred for future milestones.

## File Structure

```
src/memory/
├── types.ts                          # Core type definitions
├── store.ts                          # Storage abstraction & implementations
├── MemoryService.ts                  # Application-facing API
├── AIContextIntegration.ts           # AI system integration boundary
├── index.ts                          # Public exports
└── __tests__/
    └── Memory.test.ts                # Comprehensive test suite (36 tests)
```

## Usage Examples

### Basic Memory Creation

```typescript
import { memoryService } from 'src/memory';
import { createImportanceScore, createConfidenceScore } from 'src/memory';

// Initialize
await memoryService.initialize();

// Create memory
const memory = await memoryService.createMemory({
  content: 'User works on web development projects',
  category: 'learning',
  source: { type: 'conversation', id: 'conv-1' },
  importance: createImportanceScore(0.7),
  confidence: createConfidenceScore(0.95),
  metadata: { tags: ['web', 'development'] }
});
```

### Search and Retrieve

```typescript
// Search
const results = await memoryService.searchMemories('web development');
results.memories.forEach(m => console.log(m.content));

// By category
const learned = await memoryService.getMemoriesByCategory('learning');
console.log(`${learned.total} learning memories`);
```

### Update and Delete

```typescript
// Update
const updated = await memoryService.updateMemory({
  id: memory.id,
  importance: createImportanceScore(0.9)
});

// Soft-delete
await memoryService.deleteMemory(memory.id);

// Restore
await memoryService.restoreMemory(memory.id);
```

### Statistics

```typescript
const stats = await memoryService.getStats();
console.log(`Average memory importance: ${stats.avgImportance.toFixed(2)}`);
console.log(`Memories by category:`, stats.byCategory);
```

## Next Steps (Recommended Milestones)

1. **Persistent Storage**: Implement SQLiteMemoryStore for local persistence
2. **Embeddings**: Add vector database and embeddings for semantic search
3. **AI Integration**: Wire memory into AIOrchestrator and AIContextManager
4. **Memory UI**: Build interface for viewing, searching, managing memories
5. **Auto-save**: Implement automatic memory creation from conversations
6. **Knowledge Graph**: Add memory relationships and semantic connections
7. **Long-term Memory**: Implement memory consolidation and promotion
8. **Privacy Controls**: Add user-controlled retention policies

## Milestone 5 Summary

- ✅ Memory type system with 10 categories
- ✅ Storage abstraction with in-memory implementation
- ✅ MemoryService application API
- ✅ AI context integration boundary
- ✅ Privacy-first deletion model
- ✅ Expiration support
- ✅ 36 comprehensive tests (all passing)
- ✅ Deterministic, testable architecture
- ✅ Zero production dependencies added
