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

            // Only retry network-related errors
            if (this.isRetryableError(lastError)) {
               const delay = this.baseDelay * attempt; // Simple linear backoff
               await this.delay(delay);
               continue;
            }

            // Don't retry non-network errors
            break;
         }
      }

      throw lastError!;
   }

   private isRetryableError(error: Error): boolean {
      const message = error.message.toLowerCase();
      return (
         message.includes("network") ||
         message.includes("timeout") ||
         message.includes("connection") ||
         message.includes("fetch")
      );
   }

   private delay(ms: number): Promise<void> {
      return new Promise((resolve) => setTimeout(resolve, ms));
   }
}
