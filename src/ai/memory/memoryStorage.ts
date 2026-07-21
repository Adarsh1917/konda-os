import type { Memory } from "./memoryTypes";

const STORAGE_KEY = "konda_memory";

export function getMemory(): Memory[] {
  const data = localStorage.getItem(STORAGE_KEY);

  if (!data) return [];

  return JSON.parse(data);
}

export function saveMemory(memories: Memory[]) {
  localStorage.setItem(
    STORAGE_KEY,
    JSON.stringify(memories)
  );
}