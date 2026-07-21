import type { AIMessage, AIProvider } from "../types/ai";

export class LocalProvider implements AIProvider {
  name = "Local AI";

  async sendMessage(messages: AIMessage[]): Promise<string> {
    console.log("Local Provider", messages);

    return "🖥️ Local AI is coming soon.";
  }
}