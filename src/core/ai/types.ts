/**
 * Core AI type definitions used across the Konda OS AI layer.
 * These types establish the contracts for AI services, models, and providers.
 */

import type { AIModel } from "./models/Model.types";

export type { AIModel } from "./models/Model.types";

/**
 * Represents a text generation request.
 */
export interface AIGenerationRequest {
  model: string;
  prompt: string;
  temperature?: number;
  topP?: number;
  topK?: number;
  maxTokens?: number;
  system?: string;
  stream?: boolean;
}

/**
 * Represents a text generation response.
 */
export interface AIGenerationResponse {
  text: string;
  model: string;
  tokensGenerated?: number;
  tokensPrompt?: number;
  duration?: number;
}

/**
 * Represents the status/health of an AI provider.
 */
export type AIProviderStatus =
  | "healthy"
  | "unhealthy"
  | "unknown";

/**
 * Health check result for an AI provider.
 */
export interface AIProviderHealth {
  status: AIProviderStatus;
  message?: string;
  timestamp: number;
}

/**
 * Result of listing available models.
 */
export interface AIModelsResponse {
  models: AIModel[];
  timestamp: number;
}
