/**
 * AI error model and categorization.
 *
 * Structured error categories allow the application to understand why an AI request failed
 * and make intelligent decisions about retry, fallback, or user communication.
 */

/**
 * Categories of AI errors.
 */
export type AIErrorCategory =
  | 'provider_unavailable'
  | 'connection_error'
  | 'timeout'
  | 'model_not_found'
  | 'invalid_request'
  | 'authentication_error'
  | 'rate_limit'
  | 'provider_error'
  | 'routing_failure'
  | 'unknown_error';

/**
 * Structured AI error information.
 */
export interface AIErrorInfo {
  category: AIErrorCategory;
  message: string;
  originalError?: Error;
  retryable: boolean;
  timestamp: number;
}

/**
 * Classify an error into a structured category.
 */
export function classifyAIError(error: unknown): AIErrorInfo {
  const timestamp = Date.now();
  const originalError = error instanceof Error ? error : new Error(String(error));
  const message = originalError.message;

  const normalizedMessage = message.toLowerCase();

  // Authentication and API key errors
  if (
    normalizedMessage.includes('api key') ||
    normalizedMessage.includes('authentication') ||
    normalizedMessage.includes('unauthorized') ||
    normalizedMessage.includes('forbidden') ||
    normalizedMessage.includes('invalid or expired api key')
  ) {
    return {
      category: 'authentication_error',
      message: 'AI provider authentication failed',
      originalError,
      retryable: false,
      timestamp,
    };
  }

  // Connection errors
  if (
    normalizedMessage.includes('failed to connect') ||
    normalizedMessage.includes('econnrefused') ||
    normalizedMessage.includes('econnreset') ||
    normalizedMessage.includes('etimedout') ||
    normalizedMessage.includes('network failed') ||
    normalizedMessage.includes('network error') ||
    normalizedMessage.includes('fetch failed')
  ) {
    return {
      category: 'connection_error',
      message: 'Failed to connect to AI provider',
      originalError,
      retryable: true,
      timestamp,
    };
  }

  // Timeout errors
  if (normalizedMessage.includes('timeout') || normalizedMessage.includes('timed out')) {
    return {
      category: 'timeout',
      message: 'AI request timed out',
      originalError,
      retryable: true,
      timestamp,
    };
  }

  // Rate limit errors
  if (
    normalizedMessage.includes('rate limit') ||
    normalizedMessage.includes('429') ||
    normalizedMessage.includes('too many requests')
  ) {
    return {
      category: 'rate_limit',
      message: 'AI provider rate limit exceeded',
      originalError,
      retryable: true,
      timestamp,
    };
  }

  // Provider unavailable
  if (
    normalizedMessage.includes('not running') ||
    normalizedMessage.includes('unavailable') ||
    normalizedMessage.includes('503') ||
    normalizedMessage.includes('502') ||
    normalizedMessage.includes('504') ||
    normalizedMessage.includes('500') ||
    normalizedMessage.includes('service unavailable') ||
    normalizedMessage.includes('temporarily unavailable') ||
    normalizedMessage.includes('internal server error') ||
    normalizedMessage.includes('bad gateway') ||
    normalizedMessage.includes('gateway timeout')
  ) {
    return {
      category: 'provider_unavailable',
      message: 'AI provider is unavailable',
      originalError,
      retryable: true,
      timestamp,
    };
  }

  // Model not found
  if (normalizedMessage.includes('model') && (normalizedMessage.includes('not found') || normalizedMessage.includes('unknown'))) {
    return {
      category: 'model_not_found',
      message: 'Requested model not found',
      originalError,
      retryable: false,
      timestamp,
    };
  }

  // Invalid request
  if (
    normalizedMessage.includes('invalid') ||
    normalizedMessage.includes('bad request') ||
    normalizedMessage.includes('400') ||
    normalizedMessage.includes('malformed')
  ) {
    return {
      category: 'invalid_request',
      message: 'Invalid request to AI provider',
      originalError,
      retryable: false,
      timestamp,
    };
  }

  // Generic provider error
  if (message.includes('Provider') || message.includes('provider')) {
    return {
      category: 'provider_error',
      message: 'AI provider error',
      originalError,
      retryable: false,
      timestamp,
    };
  }

  // Unknown error
  return {
    category: 'unknown_error',
    message: `Unknown AI error: ${message}`,
    originalError,
    retryable: false,
    timestamp,
  };
}
