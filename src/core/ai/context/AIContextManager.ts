import type { AIContext } from "./AIContext.types";

export class AIContextManager {
  private context: AIContext = {
    openFiles: [],
    metadata: {},
  };

  getContext(): AIContext {
    return this.context;
  }

  update(
    partial: Partial<AIContext>
  ): void {
    this.context = {
      ...this.context,
      ...partial,
    };
  }

  reset(): void {
    this.context = {
      openFiles: [],
      metadata: {},
    };
  }
}