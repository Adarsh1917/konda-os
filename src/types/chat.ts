export interface Message {
  id: string;
  sender: "user" | "ai";
  text: string;
}

export interface Chat {
  id: string;
  title: string;
  messages: Message[];
}