import { ErrorHandler } from "./ErrorHandler";

export class RetryManager {
   constructor(
      private maxAttempts: number = 3,
      private baseDelay: number = 1000
   ) {
      // Ensure at least 1 attempt
      this.maxAttempts = Math.max(1, this.maxAttempts);
   }

   async executeWithRetry<T>(
      operation: () => Promise<T> | T,
      errorMessage?: string
   ): Promise<T> {
      let lastError: Error;

      for (let attempt = 1; attempt <= this.maxAttempts; attempt++) {
         try {
            const result = await Promise.resolve(operation());
            return result;
         } catch (error) {
            lastError =
               error instanceof Error ? error : new Error(String(error));

            // Always check if error is retryable for consistent error handling
            const pokemonError = ErrorHandler.handle(lastError, errorMessage);

            // Don't retry on last attempt
            if (attempt === this.maxAttempts) break;

            // Only continue retrying if error is retryable
            if (pokemonError.isRetryable) {
               const delay = Math.max(
                  0,
                  this.baseDelay * Math.pow(2, attempt - 1)
               ); // Exponential backoff with min 0
               await this.delay(delay);
               continue;
            }

            // Don't retry non-retryable errors
            break;
         }
      }

      throw lastError!;
   }

   private delay(ms: number): Promise<void> {
      return new Promise((resolve) => setTimeout(resolve, ms));
   }
}
