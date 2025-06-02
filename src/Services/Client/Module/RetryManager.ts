export class RetryManager {
   private readonly retryAttempts: number;
   private readonly retryDelay: number;

   constructor(retryAttempts: number = 3, retryDelay: number = 1000) {
      this.retryAttempts = retryAttempts;
      this.retryDelay = retryDelay;
   }

   async executeWithRetry<T>(
      operation: () => Promise<T>,
      errorMessage: string,
      customRetryAttempts?: number
   ): Promise<T> {
      const maxAttempts = customRetryAttempts || this.retryAttempts;
      let lastError: Error = new Error("Unknown error");

      for (let attempt = 1; attempt <= maxAttempts; attempt++) {
         try {
            const result = await operation();
            return result;
         } catch (error) {
            lastError =
               error instanceof Error ? error : new Error(String(error));

            if (attempt === maxAttempts) {
               break;
            }

            if (this.shouldRetry(lastError)) {
               const delay = this.retryDelay * Math.pow(2, attempt - 1); // Exponential backoff
               console.warn(
                  `Attempt ${attempt} failed, retrying in ${delay}ms:`,
                  lastError.message
               );
               await this.delay(delay);
            } else {
               break;
            }
         }
      }

      const errorDetails = lastError?.message || "Unknown error";
      console.error(`${errorMessage}: ${errorDetails}`);
      throw new Error(`${errorMessage}: ${errorDetails}`);
   }

   protected shouldRetry(error: Error): boolean {
      const retryableErrors = [
         "network",
         "timeout",
         "rate limit",
         "connection",
         "ECONNRESET",
         "ETIMEDOUT",
      ];

      const errorMessage = error.message.toLowerCase();
      return retryableErrors.some((retryableError) =>
         errorMessage.includes(retryableError)
      );
   }

   private async delay(ms: number): Promise<void> {
      return new Promise((resolve) => setTimeout(resolve, ms));
   }

   getConfig() {
      return {
         attempts: this.retryAttempts,
         delay: this.retryDelay,
      };
   }
}
