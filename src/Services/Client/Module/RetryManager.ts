import { ErrorHandler } from "./ErrorHandler";

export class RetryManager {
   constructor(
      private maxAttempts: number = 3,
      private baseDelay: number = 1000
   ) {}

   async executeWithRetry<T>(
      operation: () => Promise<T>,
      errorMessage?: string
   ): Promise<T> {
      let lastError: Error;

      for (let attempt = 1; attempt <= this.maxAttempts; attempt++) {
         try {
            return await operation();
         } catch (error) {
            lastError =
               error instanceof Error ? error : new Error(String(error));

            // Don't retry on last attempt
            if (attempt === this.maxAttempts) break;

            // Check if error is retryable
            const pokemonError = ErrorHandler.handle(lastError, errorMessage);
            if (pokemonError.isRetryable) {
               const delay = this.baseDelay * Math.pow(2, attempt - 1); // Exponential backoff
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
