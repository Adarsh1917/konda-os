import { AIContextManager } from "../context";

import type {
  AIRequest,
  AIResponse,
} from "./Orchestrator.types";

export class AIOrchestrator {
  private readonly context =
    new AIContextManager();

  async execute(
    request: AIRequest
  ): Promise<AIResponse> {

    const currentContext =
      this.context.getContext();

    console.log(
      "AI Request:",
      request.prompt
    );

    console.log(
      "Context:",
      currentContext
    );

    return {
      success: true,

      response:
        "AI Context loaded successfully.",

      model: "none",

      agent: "none",
    };
  }

  getContextManager(): AIContextManager {
    return this.context;
  }
}