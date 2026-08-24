export interface AIRequest {
  id: string;

  prompt: string;

  userId?: string;

  projectId?: string;

  conversationId?: string;
}

export interface AIResponse {
  success: boolean;

  response: string;

  model: string;

  agent: string;
}