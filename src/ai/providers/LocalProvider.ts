import type {
  AIMessage,
  AIProvider,
} from "../types/ai";

const OLLAMA_URL =
  "http://127.0.0.1:11434/api/chat";

const MODEL =
  "qwen2.5-coder:7b";

export class LocalProvider
  implements AIProvider
{
  name = "Ollama";

  async sendMessage(
    messages: AIMessage[]
  ): Promise<string> {
    const response = await fetch(
      OLLAMA_URL,
      {
        method: "POST",

        headers: {
          "Content-Type":
            "application/json",
        },

        body: JSON.stringify({
          model: MODEL,
          stream: false,
          messages: messages.map(
            (message) => ({
              role: message.role,
              content: message.content,
            })
          ),
        }),
      }
    );

    if (!response.ok) {
      throw new Error(
        `Ollama Error (${response.status})`
      );
    }

    const data =
      await response.json();

    return (
      data.message?.content ??
      "No response."
    );
  }
}