import type { ProviderConfig } from '../../config/ProviderConfig';
import { BaseProviderAdapter, type ProviderAdapterResponse, type ProviderMessage, type ProviderModelInfo } from '../base/ProviderAdapter';

export class OpenAIAdapter extends BaseProviderAdapter<ProviderMessage> {
  readonly id = 'openai';
  readonly displayName = 'OpenAI';

  constructor(config: ProviderConfig) {
    super(config);
  }

  async sendMessage(message: ProviderMessage): Promise<ProviderAdapterResponse> {
    return {
      providerId: this.id,
      model: message.model ?? this.config.defaultModel,
      text: message.prompt,
      finishReason: 'stop',
    };
  }

  async *streamMessage(message: ProviderMessage): AsyncIterable<ProviderAdapterResponse> {
    yield await this.sendMessage(message);
  }

  async listModels(): Promise<ProviderModelInfo[]> {
    return [{ id: this.config.defaultModel, name: this.config.defaultModel }];
  }
}

export class GeminiAdapter extends BaseProviderAdapter<ProviderMessage> {
  readonly id = 'gemini';
  readonly displayName = 'Google Gemini';

  constructor(config: ProviderConfig) {
    super(config);
  }

  async sendMessage(message: ProviderMessage): Promise<ProviderAdapterResponse> {
    return {
      providerId: this.id,
      model: message.model ?? this.config.defaultModel,
      text: message.prompt,
      finishReason: 'stop',
    };
  }

  async *streamMessage(message: ProviderMessage): AsyncIterable<ProviderAdapterResponse> {
    yield await this.sendMessage(message);
  }
}

export class AnthropicAdapter extends BaseProviderAdapter<ProviderMessage> {
  readonly id = 'anthropic';
  readonly displayName = 'Anthropic';

  constructor(config: ProviderConfig) {
    super(config);
  }

  async sendMessage(message: ProviderMessage): Promise<ProviderAdapterResponse> {
    return {
      providerId: this.id,
      model: message.model ?? this.config.defaultModel,
      text: message.prompt,
      finishReason: 'stop',
    };
  }

  async *streamMessage(message: ProviderMessage): AsyncIterable<ProviderAdapterResponse> {
    yield await this.sendMessage(message);
  }
}

export class GroqAdapter extends BaseProviderAdapter<ProviderMessage> {
  readonly id = 'groq';
  readonly displayName = 'Groq';

  constructor(config: ProviderConfig) {
    super(config);
  }

  async sendMessage(message: ProviderMessage): Promise<ProviderAdapterResponse> {
    return {
      providerId: this.id,
      model: message.model ?? this.config.defaultModel,
      text: message.prompt,
      finishReason: 'stop',
    };
  }

  async *streamMessage(message: ProviderMessage): AsyncIterable<ProviderAdapterResponse> {
    yield await this.sendMessage(message);
  }
}

export class OpenRouterAdapter extends BaseProviderAdapter<ProviderMessage> {
  readonly id = 'openrouter';
  readonly displayName = 'OpenRouter';

  constructor(config: ProviderConfig) {
    super(config);
  }

  async sendMessage(message: ProviderMessage): Promise<ProviderAdapterResponse> {
    return {
      providerId: this.id,
      model: message.model ?? this.config.defaultModel,
      text: message.prompt,
      finishReason: 'stop',
    };
  }

  async *streamMessage(message: ProviderMessage): AsyncIterable<ProviderAdapterResponse> {
    yield await this.sendMessage(message);
  }
}

export class OllamaAdapter extends BaseProviderAdapter<ProviderMessage> {
  readonly id = 'ollama';
  readonly displayName = 'Ollama';

  constructor(config: ProviderConfig) {
    super(config);
  }

  async sendMessage(message: ProviderMessage): Promise<ProviderAdapterResponse> {
    return {
      providerId: this.id,
      model: message.model ?? this.config.defaultModel,
      text: message.prompt,
      finishReason: 'stop',
    };
  }

  async *streamMessage(message: ProviderMessage): AsyncIterable<ProviderAdapterResponse> {
    yield await this.sendMessage(message);
  }
}
