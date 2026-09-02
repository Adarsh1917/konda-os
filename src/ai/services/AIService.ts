import type {
  AIRequest,
  AIResponse,
} from "../types/AI.types";
import { appAIService } from "../AIService";
import type { IAIService } from "../AIService";

export class AIService {
  private readonly service: Pick<IAIService, "generate" | "getSelectedModel" | "getHealth" | "listModels">;

  constructor(
    service: Pick<IAIService, "generate" | "getSelectedModel" | "getHealth" | "listModels"> = appAIService,
  ) {
    this.service = service;
  }

  async ask({ prompt, model }: AIRequest): Promise<AIResponse> {
    try {
      const response = await this.service.generate({
        model: model ?? this.service.getSelectedModel(),
        prompt,
      });

      return {
        success: true,
        content: response.text,
        model: response.model,
        duration: response.duration ?? 0,
      };
    } catch {
      return {
        success: false,
        content: "Unable to reach the configured AI service. Please try again.",
        model: model ?? this.service.getSelectedModel(),
        duration: 0,
      };
    }
  }

  async health() {
    return this.service.getHealth();
  }

  async models() {
    return this.service.listModels();
  }
}

export const ai =
  new AIService();