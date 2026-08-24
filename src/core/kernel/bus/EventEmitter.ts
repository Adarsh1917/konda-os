import type {
  EventHandler,
  KernelEvent,
} from "../types/Kernel.types";

export class EventEmitter {
  private handlers = new Set<EventHandler>();

  subscribe(handler: EventHandler): () => void {
    this.handlers.add(handler);

    return () => {
      this.handlers.delete(handler);
    };
  }

  async emit(
    event: KernelEvent
  ): Promise<void> {
    for (const handler of this.handlers) {
      await handler(event);
    }
  }

  clear(): void {
    this.handlers.clear();
  }

  get size(): number {
    return this.handlers.size;
  }
}