import { GoogleGenAI } from '@google/genai';
import Groq from 'groq-sdk';
import type { AIConfig } from '../../config/AIConfig';
import type { ProviderConfig } from '../../config/ProviderConfig';
import type { AIProviderHealth, AIGenerationRequest, AIGenerationResponse, AIModel } from '../../../core/ai/types';
import { providerRegistry } from '../../registry/ProviderRegistry';
import {
  BaseProviderAdapter,
  providerCapabilitiesToModelCapabilities,
  type ProviderAdapterResponse,
  type ProviderMessage,
  type ProviderModelInfo,
} from '../base/ProviderAdapter';
import type { IAIProvider } from '../IAIProvider';

const GEMINI_KEY_PATTERN = /AIza[0-9A-Za-z\-_]+/g;

function redactSensitiveText(value: string, secrets: string[] = []): string {
  let sanitized = value;

  for (const secret of secrets.filter(Boolean)) {
    sanitized = sanitized.split(secret).join('[REDACTED]');
  }

  sanitized = sanitized.replace(GEMINI_KEY_PATTERN, '[REDACTED]');
  sanitized = sanitized.replace(/(Authorization\s*:\s*)(Bearer\s+)?[^\s,;]+/gi, '$1[REDACTED]');
  sanitized = sanitized.replace(/(apiKey\s*[:=]\s*)(?:"[^"]*"|'[^']*'|[^,\s]+)/gi, '$1[REDACTED]');

  return sanitized;
}

function normalizeGeminiFailure(error: unknown, apiKey?: string): Error {
  const originalError = error instanceof Error ? error : new Error(String(error));
  const lowerMessage = redactSensitiveText(originalError.message, apiKey ? [apiKey] : []).toLowerCase();

  if (lowerMessage.includes('api key') || lowerMessage.includes('authentication') || lowerMessage.includes('unauthorized') || lowerMessage.includes('forbidden')) {
    return new Error('Gemini authentication failed: invalid or expired API key.');
  }

  if (lowerMessage.includes('rate limit') || lowerMessage.includes('429') || lowerMessage.includes('too many requests')) {
    return new Error('Gemini rate limit exceeded. Please retry later.');
  }

  if (lowerMessage.includes('timeout') || lowerMessage.includes('timed out') || lowerMessage.includes('network') || lowerMessage.includes('fetch failed') || lowerMessage.includes('econnrefused') || lowerMessage.includes('econnreset')) {
    return new Error('Gemini request timed out or network failed. Please retry.');
  }

  if (lowerMessage.includes('invalid') || lowerMessage.includes('malformed') || lowerMessage.includes('bad request') || lowerMessage.includes('400')) {
    return new Error('Gemini invalid request: the payload or model configuration is invalid.');
  }

  if (lowerMessage.includes('server') || lowerMessage.includes('unavailable') || lowerMessage.includes('503')) {
    return new Error('Gemini provider server error: the service is temporarily unavailable.');
  }

  return new Error(`Gemini provider error: ${redactSensitiveText(originalError.message, apiKey ? [apiKey] : [])}`);
}

function normalizeGroqFailure(error: unknown, apiKey?: string): Error {
  const originalError = error instanceof Error ? error : new Error(String(error));
  const safeMessage = redactSensitiveText(originalError.message, apiKey ? [apiKey] : []);
  const status = typeof (error as { status?: unknown })?.status === 'number' ? (error as { status: number }).status : undefined;
  const lowerMessage = safeMessage.toLowerCase();

  if (status === 401 || status === 403 || lowerMessage.includes('api key') || lowerMessage.includes('authentication') || lowerMessage.includes('unauthorized') || lowerMessage.includes('forbidden')) {
    return new Error('Groq authentication failed: invalid or expired API key.');
  }
  if (status === 429 || lowerMessage.includes('rate limit') || lowerMessage.includes('too many requests')) {
    return new Error('Groq rate limit exceeded. Please retry later.');
  }
  if (lowerMessage.includes('timeout') || lowerMessage.includes('timed out')) {
    return new Error('Groq request timed out. Please retry.');
  }
  if (lowerMessage.includes('network') || lowerMessage.includes('fetch failed') || lowerMessage.includes('econnrefused') || lowerMessage.includes('econnreset')) {
    return new Error('Groq network failure. Please retry.');
  }
  if (status === 404 || (lowerMessage.includes('model') && (lowerMessage.includes('not found') || lowerMessage.includes('does not exist')))) {
    return new Error('Groq model not found: check the configured model name.');
  }
  if (status === 400 || lowerMessage.includes('invalid') || lowerMessage.includes('malformed') || lowerMessage.includes('bad request')) {
    return new Error('Groq invalid request: the payload or model configuration is invalid.');
  }
  if ((status !== undefined && status >= 500) || lowerMessage.includes('server') || lowerMessage.includes('unavailable')) {
    return new Error('Groq provider server error: the service is temporarily unavailable.');
  }

  return new Error(`Groq provider error: ${safeMessage}`);
}

function normalizeOpenRouterFailure(error: unknown, apiKey?: string): Error {
  const originalError = error instanceof Error ? error : new Error(String(error));
  const safeMessage = redactSensitiveText(originalError.message, apiKey ? [apiKey] : []);
  const status = typeof (error as { status?: unknown })?.status === 'number' ? (error as { status: number }).status : undefined;
  const lowerMessage = safeMessage.toLowerCase();

  if (status === 401 || status === 403 || lowerMessage.includes('api key') || lowerMessage.includes('authentication') || lowerMessage.includes('unauthorized') || lowerMessage.includes('forbidden')) {
    return new Error('OpenRouter authentication failed: invalid or expired API key.');
  }
  if (status === 429 || lowerMessage.includes('rate limit') || lowerMessage.includes('too many requests')) {
    return new Error('OpenRouter rate limit exceeded. Please retry later.');
  }
  if (originalError.name === 'AbortError' || lowerMessage.includes('timeout') || lowerMessage.includes('timed out')) {
    return new Error('OpenRouter request timed out. Please retry.');
  }
  if (lowerMessage.includes('network') || lowerMessage.includes('fetch failed') || lowerMessage.includes('econnrefused') || lowerMessage.includes('econnreset')) {
    return new Error('OpenRouter network failure. Please retry.');
  }
  if (status === 404 || (lowerMessage.includes('model') && (lowerMessage.includes('not found') || lowerMessage.includes('does not exist')))) {
    return new Error('OpenRouter model not found: check the configured model name.');
  }
  if (status === 400 || lowerMessage.includes('invalid') || lowerMessage.includes('malformed') || lowerMessage.includes('bad request')) {
    return new Error('OpenRouter invalid request: the payload or model configuration is invalid.');
  }
  if ((status !== undefined && status >= 500) || lowerMessage.includes('server') || lowerMessage.includes('unavailable')) {
    return new Error('OpenRouter provider server error: the service is temporarily unavailable.');
  }

  return new Error(`OpenRouter provider error: ${safeMessage}`);
}

function extractGeminiText(response: Record<string, unknown>): string {
  const directText = typeof response.text === 'string' ? response.text : '';
  if (directText) {
    return directText;
  }

  const candidates = Array.isArray((response as { candidates?: unknown[] }).candidates) ? (response as { candidates?: unknown[] }).candidates ?? [] : [];
  for (const candidate of candidates) {
    const candidateObj = candidate as Record<string, unknown>;
    const content = (candidateObj.content as Record<string, unknown> | undefined) ?? {};
    const parts = Array.isArray(content.parts) ? (content.parts as unknown[]) : [];
    const textFromParts = parts
      .map((part) => typeof part === 'object' && part !== null && 'text' in part ? String((part as { text?: string }).text ?? '') : '')
      .join('');
    if (textFromParts) {
      return textFromParts;
    }
  }

  return '';
}

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
    return [{
      id: this.config.defaultModel,
      name: this.config.defaultModel,
      provider: this.id,
      capabilities: ['chat', 'coding', 'reasoning', 'vision'],
      contextWindow: 128000,
      installed: true,
      enabled: this.config.enabled,
    }];
  }
}

export class GeminiProviderAdapter extends BaseProviderAdapter<ProviderMessage> implements IAIProvider {
  readonly id = 'gemini';
  readonly displayName = 'Google Gemini';

  private readonly client: GoogleGenAI;

  constructor(config: ProviderConfig, client?: GoogleGenAI) {
    super(config);

    const apiKey = (config.apiKey ?? '').trim();
    if (!apiKey) {
      throw new Error('Gemini API key is not configured.');
    }

    this.client = client ?? new GoogleGenAI({
      apiKey,
      httpOptions: config.baseUrl ? { baseUrl: config.baseUrl } : undefined,
    });
  }

  async getHealth(): Promise<AIProviderHealth> {
    if (!this.config.enabled || !this.config.apiKey) {
      return {
        status: 'unhealthy',
        message: 'Gemini provider is disabled or missing an API key.',
        timestamp: Date.now(),
      };
    }

    return {
      status: 'healthy',
      message: 'Gemini provider is configured and ready.',
      timestamp: Date.now(),
    };
  }

  async listModels(): Promise<AIModel[]> {
    const geminiApi = (this.client as any).models;

    try {
      const result = await geminiApi.list();
      const models = Array.isArray((result as any)?.models) ? (result as any).models : [];
      const capabilities = providerCapabilitiesToModelCapabilities(this.config);

      if (models.length === 0) {
        return [{
          id: this.config.defaultModel,
          name: this.config.defaultModel,
          provider: this.id,
          capabilities,
          installed: true,
          enabled: this.config.enabled,
        }];
      }

      return models.map((model: any) => ({
        id: String(model?.name ?? model?.id ?? this.config.defaultModel).replace(/^models\//, ''),
        name: String(model?.displayName ?? model?.name ?? this.config.defaultModel),
        provider: this.id,
        capabilities,
        installed: true,
        enabled: this.config.enabled,
      }));
    } catch {
      return [{
        id: this.config.defaultModel,
        name: this.config.defaultModel,
        provider: this.id,
        capabilities: providerCapabilitiesToModelCapabilities(this.config),
        installed: true,
        enabled: this.config.enabled,
      }];
    }
  }

  async generate(request: AIGenerationRequest): Promise<AIGenerationResponse> {
    const model = (request.model ?? this.config.defaultModel ?? 'gemini-1.5-flash').trim();

    if (!this.config.apiKey) {
      throw new Error('Gemini API key is not configured.');
    }

    const startTime = Date.now();

    try {
      const response = await (this.client as any).models.generateContent({
        model,
        contents: request.system ? [{ text: request.system }, { text: request.prompt }] : request.prompt,
        config: {
          temperature: request.temperature,
          topP: request.topP,
          topK: request.topK,
          maxOutputTokens: request.maxTokens,
        },
      });

      const usageMetadata = (response as any)?.usageMetadata ?? {};
      const text = extractGeminiText((response as Record<string, unknown>) ?? {});

      return {
        text,
        model,
        tokensGenerated: typeof usageMetadata.candidatesTokenCount === 'number' ? usageMetadata.candidatesTokenCount : undefined,
        tokensPrompt: typeof usageMetadata.promptTokenCount === 'number' ? usageMetadata.promptTokenCount : undefined,
        duration: Date.now() - startTime,
      };
    } catch (error) {
      throw normalizeGeminiFailure(error, this.config.apiKey);
    }
  }

  async sendMessage(message: ProviderMessage): Promise<ProviderAdapterResponse> {
    const request: AIGenerationRequest = {
      model: message.model ?? this.config.defaultModel,
      prompt: message.prompt,
      temperature: message.temperature,
      maxTokens: message.maxTokens,
      system: message.systemPrompt,
      stream: message.stream,
    };

    const response = await this.generate(request);

    return {
      providerId: this.id,
      model: response.model,
      text: response.text,
      finishReason: 'stop',
      usage: {
        promptTokens: response.tokensPrompt,
        completionTokens: response.tokensGenerated,
        totalTokens: (response.tokensPrompt ?? 0) + (response.tokensGenerated ?? 0),
      },
    };
  }

  async *streamMessage(message: ProviderMessage): AsyncIterable<ProviderAdapterResponse> {
    yield await this.sendMessage(message);
  }
}

export const GeminiAdapter = GeminiProviderAdapter;

export function registerDefaultProviderAdapters(config: AIConfig, registry = providerRegistry): void {
  const geminiConfig = config.getProvider('gemini');
  if (geminiConfig?.enabled && geminiConfig.apiKey) {
    registry.register(new GeminiProviderAdapter(geminiConfig));
  }

  const groqConfig = config.getProvider('groq');
  if (groqConfig?.enabled && groqConfig.apiKey) {
    registry.register(new GroqAdapter(groqConfig));
  }

  const openRouterConfig = config.getProvider('openrouter');
  if (openRouterConfig?.enabled && openRouterConfig.apiKey) {
    registry.register(new OpenRouterAdapter(openRouterConfig));
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

  private readonly client: Groq;

  constructor(config: ProviderConfig, client?: Groq) {
    super(config);

    const apiKey = (config.apiKey ?? '').trim();
    if (!apiKey) {
      throw new Error('Groq API key is not configured.');
    }

    this.client = client ?? new Groq({
      apiKey,
      baseURL: config.baseUrl,
      timeout: config.requestTimeout,
      maxRetries: 0,
    });
  }

  async getHealth(): Promise<AIProviderHealth> {
    if (!this.config.enabled || !this.config.apiKey) {
      return {
        status: 'unhealthy',
        message: 'Groq provider is disabled or missing an API key.',
        timestamp: Date.now(),
      };
    }

    return {
      status: 'healthy',
      message: 'Groq provider is configured and ready.',
      timestamp: Date.now(),
    };
  }

  async listModels(): Promise<AIModel[]> {
    try {
      const result = await this.client.models.list();
      const capabilities = providerCapabilitiesToModelCapabilities(this.config);
      return result.data.map((model) => ({
        id: model.id,
        name: model.id,
        provider: this.id,
        capabilities,
        installed: true,
        enabled: this.config.enabled,
      }));
    } catch (error) {
      throw normalizeGroqFailure(error, this.config.apiKey);
    }
  }

  async generate(request: AIGenerationRequest): Promise<AIGenerationResponse> {
    const model = (request.model ?? this.config.defaultModel).trim();
    if (!model) {
      throw new Error('Groq invalid request: a model is required.');
    }

    const messages: Groq.Chat.ChatCompletionMessageParam[] = [];
    if (request.system) {
      messages.push({ role: 'system', content: request.system });
    }
    messages.push({ role: 'user', content: request.prompt });
    const startTime = Date.now();

    try {
      const response = await this.client.chat.completions.create({
        model,
        messages,
        temperature: request.temperature,
        top_p: request.topP,
        max_tokens: request.maxTokens,
        stream: false,
      });
      const choice = response.choices[0];
      const usage = response.usage;

      return {
        text: typeof choice?.message?.content === 'string' ? choice.message.content : '',
        model,
        provider: this.id,
        tokensGenerated: usage?.completion_tokens,
        tokensPrompt: usage?.prompt_tokens,
        duration: Date.now() - startTime,
      };
    } catch (error) {
      throw normalizeGroqFailure(error, this.config.apiKey);
    }
  }

  async sendMessage(message: ProviderMessage): Promise<ProviderAdapterResponse> {
    const response = await this.generate({
      model: message.model ?? this.config.defaultModel,
      prompt: message.prompt,
      temperature: message.temperature,
      maxTokens: message.maxTokens,
      system: message.systemPrompt,
      stream: message.stream,
    });

    return {
      providerId: this.id,
      model: response.model,
      text: response.text,
      finishReason: 'stop',
      usage: {
        promptTokens: response.tokensPrompt,
        completionTokens: response.tokensGenerated,
        totalTokens: (response.tokensPrompt ?? 0) + (response.tokensGenerated ?? 0),
      },
    };
  }

  async *streamMessage(message: ProviderMessage): AsyncIterable<ProviderAdapterResponse> {
    yield await this.sendMessage(message);
  }
}

export class OpenRouterAdapter extends BaseProviderAdapter<ProviderMessage> {
  readonly id = 'openrouter';
  readonly displayName = 'OpenRouter';

  private readonly fetcher: typeof fetch;

  constructor(config: ProviderConfig, fetcher: typeof fetch = fetch) {
    super(config);
    if (!config.apiKey.trim()) {
      throw new Error('OpenRouter API key is not configured.');
    }
    this.fetcher = fetcher;
  }

  private async fetchWithTimeout(input: RequestInfo | URL, init: RequestInit = {}): Promise<Response> {
    const controller = new AbortController();
    const timeoutHandle = setTimeout(() => controller.abort(), this.config.requestTimeout);
    try {
      return await this.fetcher(input, { ...init, signal: controller.signal });
    } catch (error) {
      if (error instanceof Error && error.name === 'AbortError') {
        throw new Error(`OpenRouter request timed out after ${this.config.requestTimeout}ms`);
      }
      throw error;
    } finally {
      clearTimeout(timeoutHandle);
    }
  }

  async getHealth(): Promise<AIProviderHealth> {
    if (!this.config.enabled || !this.config.apiKey) {
      return {
        status: 'unhealthy',
        message: 'OpenRouter provider is disabled or missing an API key.',
        timestamp: Date.now(),
      };
    }
    return {
      status: 'healthy',
      message: 'OpenRouter provider is configured and ready.',
      timestamp: Date.now(),
    };
  }

  async listModels(): Promise<AIModel[]> {
    try {
      const response = await this.fetchWithTimeout(`${this.config.baseUrl ?? 'https://openrouter.ai/api/v1'}/models`, {
        headers: { Authorization: `Bearer ${this.config.apiKey}` },
      });
      if (!response.ok) {
        throw Object.assign(new Error(`OpenRouter models request failed with HTTP ${response.status}`), { status: response.status });
      }
      const payload = await response.json() as { data?: Array<{ id?: unknown; name?: unknown }> };
      const capabilities = providerCapabilitiesToModelCapabilities(this.config);
      return (payload.data ?? []).filter((model) => typeof model.id === 'string').map((model) => ({
        id: model.id as string,
        name: typeof model.name === 'string' ? model.name : model.id as string,
        provider: this.id,
        capabilities,
        installed: true,
        enabled: this.config.enabled,
      }));
    } catch (error) {
      throw normalizeOpenRouterFailure(error, this.config.apiKey);
    }
  }

  async generate(request: AIGenerationRequest): Promise<AIGenerationResponse> {
    const model = (request.model ?? this.config.defaultModel).trim();
    if (!model) {
      throw new Error('OpenRouter invalid request: a model is required.');
    }
    const messages: Array<{ role: 'system' | 'user'; content: string }> = [];
    if (request.system) {
      messages.push({ role: 'system', content: request.system });
    }
    messages.push({ role: 'user', content: request.prompt });
    const startTime = Date.now();

    try {
      const response = await this.fetchWithTimeout(`${this.config.baseUrl ?? 'https://openrouter.ai/api/v1'}/chat/completions`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${this.config.apiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model,
          messages,
          temperature: request.temperature,
          top_p: request.topP,
          max_tokens: request.maxTokens,
          stream: false,
        }),
      });
      if (!response.ok) {
        throw Object.assign(new Error(`OpenRouter request failed with HTTP ${response.status}`), { status: response.status });
      }
      const payload = await response.json() as {
        choices?: Array<{ message?: { content?: unknown } }>;
        usage?: { prompt_tokens?: number; completion_tokens?: number };
      };
      return {
        text: typeof payload.choices?.[0]?.message?.content === 'string' ? payload.choices[0].message.content : '',
        model,
        provider: this.id,
        tokensPrompt: payload.usage?.prompt_tokens,
        tokensGenerated: payload.usage?.completion_tokens,
        duration: Date.now() - startTime,
      };
    } catch (error) {
      throw normalizeOpenRouterFailure(error, this.config.apiKey);
    }
  }

  async sendMessage(message: ProviderMessage): Promise<ProviderAdapterResponse> {
    const response = await this.generate({
      model: message.model ?? this.config.defaultModel,
      prompt: message.prompt,
      temperature: message.temperature,
      maxTokens: message.maxTokens,
      system: message.systemPrompt,
      stream: message.stream,
    });
    return {
      providerId: this.id,
      model: response.model,
      text: response.text,
      finishReason: 'stop',
      usage: {
        promptTokens: response.tokensPrompt,
        completionTokens: response.tokensGenerated,
        totalTokens: (response.tokensPrompt ?? 0) + (response.tokensGenerated ?? 0),
      },
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
