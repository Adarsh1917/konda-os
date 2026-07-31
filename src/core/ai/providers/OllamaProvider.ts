import type { AIMessage, AIProvider } from "../types/ai";

const OLLAMA_BASE_URL = "http://127.0.0.1:11434";
const DEFAULT_MODEL = "qwen2.5-coder:7b";

interface OllamaResponse {
  message?: {
    role: string;
    content: string;
  };
}

export class OllamaProvider implements AIProvider {
  readonly name = "Ollama";


  async sendMessage(messages: AIMessage[]): Promise<string> {
    try {
      const response = await fetch(
        `${OLLAMA_BASE_URL}/api/chat`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            model: DEFAULT_MODEL,
            stream: false,
            messages,
          }),
        }
      );

      if (!response.ok) {
        const errorText = await response.text();

        throw new Error(
          `Ollama request failed (${response.status}): ${errorText}`
        );
      }

      const data: OllamaResponse =
        await response.json();

      return (
        data.message?.content ??
        "No response from model."
      );
    } catch (error) {
      console.error(error);

      return "❌ Unable to connect to Ollama.\n\nMake sure:\n1. Ollama is running.\n2. qwen2.5-coder:7b is installed.\n3. Port 11434 is accessible.";
    }
  }
}