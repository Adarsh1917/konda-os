import type {
  AIResponse,
} from "../types/AI.types";

const BASE_URL =
  "http://127.0.0.1:11434";

export class OllamaService {
  async health() {
    try {
      const response = await fetch(
        `${BASE_URL}/api/tags`
      );

      return response.ok;
    } catch {
      return false;
    }
  }

  async listModels() {
    try {
      const response = await fetch(
        `${BASE_URL}/api/tags`
      );

      if (!response.ok) {
        return [];
      }

      const data = await response.json() as {
        models?: unknown[];
      };

      return data.models ?? [];
    } catch {
      return [];
    }
  }

  async generate(
    model: string,
    prompt: string
  ): Promise<AIResponse> {
    const started =
      performance.now();

    try {
      const response = await fetch(
        `${BASE_URL}/api/generate`,
        {
          method: "POST",

          headers: {
            "Content-Type":
              "application/json",
          },

          body: JSON.stringify({
            model,
            prompt,
            stream: false,
          }),
        }
      );

      const data = await response.json().catch(
        () => ({})
      ) as {
        error?: string;
        response?: string;
      };

      return {
        success: response.ok,

        model,

        duration:
          performance.now() -
          started,

        content:
          data.response ??
          data.error ??
          (response.ok
            ? ""
            : `Ollama returned ${response.status}.`),
      };
    } catch (error) {
      return {
        success: false,
        model,
        duration:
          performance.now() -
          started,
        content:
          error instanceof Error
            ? `Unable to reach Ollama: ${error.message}`
            : "Unable to reach Ollama.",
      };
    }
  }
}

export const ollama =
  new OllamaService();
