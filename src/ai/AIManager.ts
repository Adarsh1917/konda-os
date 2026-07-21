import type { AIMessage, AIProvider } from "./types/ai";

export class AIManager {
  private provider: AIProvider;

  constructor(provider: AIProvider) {
    this.provider = provider;
  }

  setProvider(provider: AIProvider): void {
    this.provider = provider;
  }

  getProviderName(): string {
    return this.provider.name;
  }

  async chat(userMessage: string): Promise<string> {
    const messages: AIMessage[] = [
      {
        role: "user",
        content: userMessage,
      },
    ];

    return this.provider.sendMessage(messages);
  }
}