import type { AIMessage, AIProvider } from "./types/ai";

export class AIManager {
  private provider: AIProvider;

  constructor(provider: AIProvider) {
    this.provider = provider;
  }

  setProvider(provider: AIProvider): void {
    this.provider = provider;
  }

  getProvider(): AIProvider {
    return this.provider;
  }

  getProviderName(): string {
    return this.provider.name;
  }

  private buildConversation(userMessage: string): AIMessage[] {
    return [
      {
        role: "user",
        content: userMessage,
      },
    ];
  }

  async sendMessage(userMessage: string): Promise<string> {
    const messages = this.buildConversation(userMessage);

    return this.provider.sendMessage(messages);
  }
}