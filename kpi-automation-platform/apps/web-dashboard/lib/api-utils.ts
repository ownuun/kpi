/**
 * API utility functions for error handling and response formatting
 */

/**
 * Determine HTTP status code based on error
 */
export function getErrorStatusCode(error: unknown): number {
  if (error instanceof Error) {
    const message = error.message;

    // Authentication errors
    if (message.includes('401') || message.includes('Unauthorized')) {
      return 401;
    }

    // Permission errors
    if (message.includes('403') || message.includes('Forbidden')) {
      return 403;
    }

    // Not found errors
    if (message.includes('404') || message.includes('Not found')) {
      return 404;
    }

    // Validation errors
    if (message.includes('400') || message.includes('Bad request') || message.includes('Invalid')) {
      return 400;
    }

    // Rate limit errors
    if (message.includes('429') || message.includes('Too many requests')) {
      return 429;
    }
  }

  // Default to 500 for unknown errors
  return 500;
}

/**
 * Determine error code based on error
 */
export function getErrorCode(error: unknown): string {
  if (error instanceof Error) {
    const message = error.message.toLowerCase();

    if (message.includes('unauthorized') || message.includes('401')) {
      return 'UNAUTHORIZED';
    }
    if (message.includes('forbidden') || message.includes('403')) {
      return 'FORBIDDEN';
    }
    if (message.includes('not found') || message.includes('404')) {
      return 'NOT_FOUND';
    }
    if (message.includes('invalid') || message.includes('validation') || message.includes('400')) {
      return 'VALIDATION_ERROR';
    }
    if (message.includes('timeout')) {
      return 'TIMEOUT';
    }
    if (message.includes('network') || message.includes('connection')) {
      return 'NETWORK_ERROR';
    }
    if (message.includes('rate limit') || message.includes('429')) {
      return 'RATE_LIMIT_EXCEEDED';
    }
    if (message.includes('postiz_api_key') || message.includes('not configured')) {
      return 'CONFIGURATION_ERROR';
    }
  }

  return 'INTERNAL_ERROR';
}

/**
 * Format error response
 */
export function formatErrorResponse(error: unknown, defaultMessage: string) {
  const statusCode = getErrorStatusCode(error);
  const errorCode = getErrorCode(error);

  return {
    success: false,
    error: {
      code: errorCode,
      message: error instanceof Error ? error.message : defaultMessage,
    },
    statusCode,
  };
}

/**
 * Retry function with exponential backoff
 */
export async function retryWithBackoff<T>(
  fn: () => Promise<T>,
  options: {
    maxAttempts?: number;
    initialDelay?: number;
    maxDelay?: number;
    shouldRetry?: (error: unknown) => boolean;
  } = {}
): Promise<T> {
  const {
    maxAttempts = 3,
    initialDelay = 1000,
    maxDelay = 10000,
    shouldRetry = (error) => {
      // Don't retry on client errors (4xx)
      if (error instanceof Error) {
        const statusCode = getErrorStatusCode(error);
        return statusCode >= 500 || statusCode === 429;
      }
      return true;
    },
  } = options;

  let lastError: unknown;

  for (let attempt = 0; attempt < maxAttempts; attempt++) {
    try {
      return await fn();
    } catch (error) {
      lastError = error;

      // Don't retry if we shouldn't
      if (!shouldRetry(error)) {
        throw error;
      }

      // Don't wait on the last attempt
      if (attempt < maxAttempts - 1) {
        const delay = Math.min(initialDelay * Math.pow(2, attempt), maxDelay);
        await new Promise((resolve) => setTimeout(resolve, delay));
      }
    }
  }

  throw lastError;
}
