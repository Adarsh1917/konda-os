export type AIRole =
  | "system"
  | "user"
  | "assistant";

export interface AIMessage {
  role: AIRole;
  content: string;
}

export interface AIProvider {
  readonly name: string;

  sendMessage(
    messages: AIMessage[]
  ): Promise<string>;
}

export interface AIModel {
  id: string;
  name: string;
  installed?: boolean;
}