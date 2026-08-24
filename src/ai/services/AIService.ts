import { ollama } from "./OllamaService";

import type {
  AIRequest,
} from "../types/AI.types";

export class AIService {
  async ask({
    prompt,
    model = "odysseus",
  }: AIRequest) {
    return ollama.generate(
      model,
      prompt
    );
  }

  async health() {
    return ollama.health();
  }

  async models() {
    return ollama.listModels();
  }
}

export const ai =
  new AIService();