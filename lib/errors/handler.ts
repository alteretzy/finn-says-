/**
 * Custom Error Classes & Retry Utilities
 * Production-grade error handling for multi-source API architecture
 */

export class APIError extends Error {
    constructor(
        message: string,
        public statusCode: number,
        public source: string,
        public retryable: boolean = true
    ) {
        super(message);
        this.name = 'APIError';
    }
}

export class DataValidationError extends Error {
    constructor(
        message: string,
        public field: string,
        public received: unknown
    ) {
        super(message);
        this.name = 'DataValidationError';
    }
}

export class RateLimitError extends APIError {
    constructor(source: string, public resetTime: number) {
        super('Rate limit exceeded', 429, source, false);
        this.name = 'RateLimitError';
    }
}

/**
 * Retry a function with exponential backoff
 */
export async function withRetry<T>(
    fn: () => Promise<T>,
    maxAttempts = 3,
    delayMs = 1000
): Promise<T> {
    let lastError: Error = new Error('Unknown error');

    for (let attempt = 1; attempt <= maxAttempts; attempt++) {
        try {
            return await fn();
        } catch (error) {
            lastError = error as Error;

            // Don't retry on non-retryable errors
            if (error instanceof APIError && !error.retryable) {
                throw error;
            }

            if (attempt < maxAttempts) {
                await new Promise((resolve) =>
                    setTimeout(resolve, delayMs * Math.pow(2, attempt - 1))
                );
            }
        }
    }

    throw lastError;
}

/**
 * Log API errors with context
 */
export function logAPIError(context: string, error: unknown): void {
    const err = error instanceof Error ? error : new Error(String(error));
    console.error(`[${context}] ${err.name}: ${err.message}`);
    if (err instanceof APIError) {
        console.error(`  Source: ${err.source}, Status: ${err.statusCode}, Retryable: ${err.retryable}`);
    }
}
