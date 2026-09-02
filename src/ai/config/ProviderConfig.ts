export type ProviderTaskType = 'chat' | 'coding' | 'reasoning' | 'vision';

export interface ProviderCapabilities {
  chat: boolean;
  coding: boolean;
  reasoning: boolean;
  vision: boolean;
}

export interface ProviderConfig {
  id: string;
  displayName: string;
  enabled: boolean;
  apiKey: string;
  baseUrl?: string;
  defaultModel: string;
  priority: number;
  capabilities: ProviderCapabilities;
  requestTimeout: number;
  chatEnabled: boolean;
  codingEnabled: boolean;
  reasoningEnabled: boolean;
  visionEnabled: boolean;
}

export interface ProviderDefinition {
  id: string;
  displayName: string;
  defaultModel: string;
  baseUrl?: string;
  priority: number;
  capabilities: ProviderCapabilities;
  requestTimeout: number;
  envVarName: string;
}

export const SUPPORTED_PROVIDER_DEFINITIONS: ProviderDefinition[] = [
  {
    id: 'openai',
    displayName: 'OpenAI',
    defaultModel: 'gpt-4o-mini',
    baseUrl: 'https://api.openai.com/v1',
    priority: 100,
    capabilities: {
      chat: true,
      coding: true,
      reasoning: true,
      vision: true,
    },
    requestTimeout: 30000,
    envVarName: 'OPENAI_API_KEY',
  },
  {
    id: 'gemini',
    displayName: 'Google Gemini',
    defaultModel: 'gemini-1.5-flash',
    baseUrl: 'https://generativelanguage.googleapis.com',
    priority: 95,
    capabilities: {
      chat: true,
      coding: true,
      reasoning: true,
      vision: true,
    },
    requestTimeout: 30000,
    envVarName: 'GEMINI_API_KEY',
  },
  {
    id: 'anthropic',
    displayName: 'Anthropic',
    defaultModel: 'claude-3-5-sonnet',
    baseUrl: 'https://api.anthropic.com',
    priority: 90,
    capabilities: {
      chat: true,
      coding: true,
      reasoning: true,
      vision: true,
    },
    requestTimeout: 40000,
    envVarName: 'ANTHROPIC_API_KEY',
  },
  {
    id: 'groq',
    displayName: 'Groq',
    defaultModel: 'llama-3.1-8b-instant',
    baseUrl: 'https://api.groq.com/openai/v1',
    priority: 80,
    capabilities: {
      chat: true,
      coding: true,
      reasoning: false,
      vision: false,
    },
    requestTimeout: 25000,
    envVarName: 'GROQ_API_KEY',
  },
  {
    id: 'openrouter',
    displayName: 'OpenRouter',
    defaultModel: 'openai/gpt-4o-mini',
    baseUrl: 'https://openrouter.ai/api/v1',
    priority: 75,
    capabilities: {
      chat: true,
      coding: true,
      reasoning: true,
      vision: true,
    },
    requestTimeout: 30000,
    envVarName: 'OPENROUTER_API_KEY',
  },
  {
    id: 'ollama',
    displayName: 'Ollama',
    defaultModel: 'llama3.1',
    baseUrl: 'http://localhost:11434',
    priority: 50,
    capabilities: {
      chat: true,
      coding: true,
      reasoning: true,
      vision: false,
    },
    requestTimeout: 120000,
    envVarName: 'OLLAMA_API_KEY',
  },
];

export const SUPPORTED_PROVIDER_IDS = SUPPORTED_PROVIDER_DEFINITIONS.map((provider) => provider.id);

export const getProviderDefinition = (providerId: string): ProviderDefinition | undefined =>
  SUPPORTED_PROVIDER_DEFINITIONS.find((provider) => provider.id === providerId);

export const resolveProviderConfig = (
  providerId: string,
  env: Record<string, string | undefined> = process.env as Record<string, string | undefined>,
): ProviderConfig => {
  const definition = getProviderDefinition(providerId);

  if (!definition) {
    throw new Error(`Unsupported provider configuration requested: ${providerId}`);
  }

  const apiKey = env[definition.envVarName] ?? '';
  const baseUrl = env[`${providerId.toUpperCase()}_BASE_URL`] ?? definition.baseUrl;
  const rawEnabled = env[`${providerId.toUpperCase()}_ENABLED`];
  const enabledValue = rawEnabled === undefined ? Boolean(apiKey || providerId === 'ollama') : rawEnabled === 'true';

  return {
    id: definition.id,
    displayName: definition.displayName,
    enabled: enabledValue,
    apiKey,
    baseUrl,
    defaultModel: env[`${providerId.toUpperCase()}_MODEL`] ?? definition.defaultModel,
    priority: Number(env[`${providerId.toUpperCase()}_PRIORITY`] ?? String(definition.priority)),
    capabilities: {
      ...definition.capabilities,
      vision: Boolean(env[`${providerId.toUpperCase()}_VISION`] ? env[`${providerId.toUpperCase()}_VISION`] === 'true' : definition.capabilities.vision),
    },
    requestTimeout: Number(env[`${providerId.toUpperCase()}_TIMEOUT`] ?? String(definition.requestTimeout)),
    chatEnabled: env[`${providerId.toUpperCase()}_CHAT`] === 'false' ? false : definition.capabilities.chat,
    codingEnabled: env[`${providerId.toUpperCase()}_CODING`] === 'false' ? false : definition.capabilities.coding,
    reasoningEnabled: env[`${providerId.toUpperCase()}_REASONING`] === 'false' ? false : definition.capabilities.reasoning,
    visionEnabled: env[`${providerId.toUpperCase()}_VISION`] === 'false' ? false : definition.capabilities.vision,
  };
};
