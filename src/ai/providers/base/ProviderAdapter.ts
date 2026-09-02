import type { AIModel } from '../../../core/ai/models/Model.types';
import type { ProviderConfig } from '../../config/ProviderConfig';

export interface ProviderMessage {
  prompt: string;
  model?: string;
  systemPrompt?: string;
  temperature?: number;
  maxTokens?: number;
  stream?: boolean;
}

export interface ProviderAdapterResponse {
  providerId: string;
  model: string;
  text: string;
  finishReason?: string;
  usage?: {
    promptTokens?: number;
    completionTokens?: number;
    totalTokens?: number;
  };
}

export type ProviderModelInfo = AIModel;

export function providerCapabilitiesToModelCapabilities(config: ProviderConfig): AIModel['capabilities'] {
  const capabilities: AIModel['capabilities'] = [];

  if (config.chatEnabled) {
    capabilities.push('chat');
  }
  if (config.codingEnabled) {
    capabilities.push('coding');
  }
  if (config.reasoningEnabled) {
    capabilities.push('reasoning');
  }
  if (config.visionEnabled) {
    capabilities.push('vision');
  }

  return capabilities;
}

export interface ProviderAdapter<TMessage = ProviderMessage> {
  id: string;
  displayName: string;
  config: ProviderConfig;
  sendMessage(message: TMessage): Promise<ProviderAdapterResponse>;
  streamMessage(message: TMessage): AsyncIterable<ProviderAdapterResponse> | Promise<ProviderAdapterResponse>;
  checkHealth(): Promise<boolean>;
  listModels(): Promise<ProviderModelInfo[]>;
}

export abstract class BaseProviderAdapter<TMessage = ProviderMessage> implements ProviderAdapter<TMessage> {
  abstract readonly id: string;
  abstract readonly displayName: string;
  readonly config: ProviderConfig;

  protected constructor(config: ProviderConfig) {
    this.config = config;
  }

  abstract sendMessage(message: TMessage): Promise<ProviderAdapterResponse>;

  abstract streamMessage(message: TMessage): AsyncIterable<ProviderAdapterResponse> | Promise<ProviderAdapterResponse>;

  async checkHealth(): Promise<boolean> {
    return this.config.enabled && Boolean(this.config.apiKey || this.config.id === 'ollama');
  }

  async listModels(): Promise<ProviderModelInfo[]> {
    return [
      {
        id: this.config.defaultModel,
        name: this.config.defaultModel,
        provider: this.config.id,
        capabilities: providerCapabilitiesToModelCapabilities(this.config),
        installed: true,
        enabled: this.config.enabled,
      },
    ];
  }
}
