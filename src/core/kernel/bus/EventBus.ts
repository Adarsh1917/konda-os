import { EventEmitter } from "./EventEmitter";

import type {
  EventHandler,
  KernelEvent,
} from "../types/Kernel.types";

export class EventBus {
  private emitters = new Map<
    string,
    EventEmitter
  >();

  subscribe(
    eventType: string,
    handler: EventHandler
  ): () => void {
    let emitter =
      this.emitters.get(eventType);

    if (!emitter) {
      emitter = new EventEmitter();

      this.emitters.set(
        eventType,
        emitter
      );
    }

    return emitter.subscribe(handler);
  }

  async publish(
    event: KernelEvent
  ): Promise<void> {
    const emitter =
      this.emitters.get(event.type);

    if (!emitter) {
      return;
    }

    await emitter.emit(event);
  }

  has(
    eventType: string
  ): boolean {
    return this.emitters.has(
      eventType
    );
  }

  clear(): void {
    this.emitters.clear();
  }
}