import type {
  AIMessage,
  AIModel,
} from "./types";

import OllamaProvider from "./providers/OllamaProvider";
import type { AIProvider } from "./providers/AIProvider";

class AIService {
  private provider: AIProvider;

  constructor() {
    this.provider = new OllamaProvider();
  }

  setProvider(provider: AIProvider) {
    this.provider = provider;
  }

  getProvider(): AIProvider {
    return this.provider;
  }

  async isAvailable() {
    return this.provider.isAvailable();
  }

  async listModels(): Promise<AIModel[]> {
    return this.provider.listModels();
  }

  async chat(
    messages: AIMessage[]
  ): Promise<AIMessage> {
    return this.provider.chat(messages);
  }

  async ask(
    prompt: string
  ): Promise<string> {
    const response =
      await this.chat([
        {
          role: "user",
          content: prompt,
        },
      ]);

    return response.content;
  }
}

const aiService =
  new AIService();

export default aiService;