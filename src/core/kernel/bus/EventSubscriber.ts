import type {
  EventHandler,
} from "../types/Kernel.types";

export interface EventSubscriber {
  id: string;

  subscribe(
    event: string,
    handler: EventHandler
  ): () => void;
}