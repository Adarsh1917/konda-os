import type { Memory } from "./memoryTypes";
import { getMemory, saveMemory } from "./memoryStorage";

export class MemoryManager {
  getAll(): Memory[] {
    return getMemory();
  }

  add(content: string) {
    const memories = getMemory();

    memories.push({
      id: crypto.randomUUID(),
      content,
      createdAt: Date.now(),
    });

    saveMemory(memories);
  }

  clear() {
    saveMemory([]);
  }
}