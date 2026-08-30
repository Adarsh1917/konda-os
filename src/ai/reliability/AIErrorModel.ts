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
  | 'provider_error'
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

  // Connection errors
  if (
    message.includes('Failed to connect') ||
    message.includes('ECONNREFUSED') ||
    message.includes('ECONNRESET') ||
    message.includes('ETIMEDOUT')
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
  if (message.includes('timeout') || message.includes('Timeout')) {
    return {
      category: 'timeout',
      message: 'AI request timed out',
      originalError,
      retryable: true,
      timestamp,
    };
  }

  // Provider unavailable
  if (
    message.includes('not running') ||
    message.includes('unavailable') ||
    message.includes('503') ||
    message.includes('service unavailable')
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
  if (message.toLowerCase().includes('model') && (message.toLowerCase().includes('not found') || message.toLowerCase().includes('unknown'))) {
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
    message.includes('invalid') ||
    message.includes('bad request') ||
    message.includes('400') ||
    message.includes('malformed')
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
