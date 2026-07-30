import type { AIMessage, AIProvider } from "./types/ai";

export class AIManager {
  private provider: AIProvider;

  private conversation: AIMessage[] = [];

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

  clearConversation(): void {
    this.conversation = [];
  }

  async sendMessage(userMessage: string): Promise<string> {
  console.log("AIManager: sendMessage called");

  const messages = this.buildConversation(userMessage);

  console.log("Messages:", messages);

  const reply = await this.provider.sendMessage(messages);

  console.log("Reply:", reply);

  return reply;
}


    const reply = await this.provider.sendMessage(
      this.conversation
    );

    this.conversation.push({
      role: "assistant",
      content: reply,
    });

    return reply;
  }
}