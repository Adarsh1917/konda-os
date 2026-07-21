export interface AIMessage {
  role: "system" | "user" | "assistant";
  content: string;
}

export interface AIProvider {
  name: string;

  sendMessage(messages: AIMessage[]): Promise<string>;
}