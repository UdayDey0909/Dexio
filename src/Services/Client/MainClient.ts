import { MainClient } from "pokenode-ts";

export class BaseService {
   protected api: MainClient;
   private requestCount: number = 0;
   private lastRequestTime: number = 0;
   private readonly rateLimit: number = 100; // requests per minute

   constructor() {
      this.api = new MainClient({
         cacheOptions: {
            ttl: 10 * 60 * 1000, // 10 minutes cache
         },
      });
   }

   // Enhanced error handling wrapper
   protected async executeWithErrorHandling<T>(
      operation: () => Promise<T>,
      errorMessage: string
   ): Promise<T> {
      try {
         await this.checkRateLimit();
         const result = await operation();
         this.requestCount++;
         return result;
      } catch (error) {
         const errorDetails =
            error instanceof Error ? error.message : "Unknown error";
         console.error(`${errorMessage}: ${errorDetails}`);
         throw new Error(`${errorMessage}: ${errorDetails}`);
      }
   }

   // Rate limiting
   private async checkRateLimit(): Promise<void> {
      const now = Date.now();
      if (now - this.lastRequestTime < 60000) {
         // Within 1 minute
         if (this.requestCount >= this.rateLimit) {
            const waitTime = 60000 - (now - this.lastRequestTime);
            console.warn(`Rate limit reached. Waiting ${waitTime}ms`);
            await new Promise((resolve) => setTimeout(resolve, waitTime));
            this.requestCount = 0;
            this.lastRequestTime = Date.now();
         }
      } else {
         this.requestCount = 0;
         this.lastRequestTime = now;
      }
   }

   // Input validation helpers
   protected validateIdentifier(
      identifier: string | number,
      name: string
   ): void {
      if (identifier === null || identifier === undefined) {
         throw new Error(`${name} identifier cannot be null or undefined`);
      }
      if (typeof identifier === "string" && identifier.trim().length === 0) {
         throw new Error(`${name} identifier cannot be empty string`);
      }
      if (
         typeof identifier === "number" &&
         (identifier < 1 || !Number.isInteger(identifier))
      ) {
         throw new Error(`${name} identifier must be a positive integer`);
      }
   }

   protected validatePaginationParams(offset: number, limit: number): void {
      if (offset < 0 || !Number.isInteger(offset)) {
         throw new Error("Offset must be a non-negative integer");
      }
      if (limit < 1 || limit > 1000 || !Number.isInteger(limit)) {
         throw new Error("Limit must be between 1 and 1000");
      }
   }

   // Enhanced URL ID extraction
   protected extractIdFromUrl(url: string): number | null {
      if (!url || typeof url !== "string") return null;

      const match = url.match(/\/(\d+)\/$/);
      return match ? parseInt(match[1], 10) : null;
   }

   // Extract name from URL
   protected extractNameFromUrl(url: string): string | null {
      if (!url || typeof url !== "string") return null;

      const parts = url.split("/").filter((part) => part.length > 0);
      return parts.length >= 2 ? parts[parts.length - 1] : null;
   }

   // Batch operation with concurrency control
   protected async batchOperation<T, R>(
      items: T[],
      operation: (item: T) => Promise<R>,
      concurrency: number = 5
   ): Promise<R[]> {
      const results: R[] = [];

      for (let i = 0; i < items.length; i += concurrency) {
         const batch = items.slice(i, i + concurrency);
         const batchPromises = batch.map((item) => operation(item));
         const batchResults = await Promise.allSettled(batchPromises);

         batchResults.forEach((result, index) => {
            if (result.status === "fulfilled") {
               results.push(result.value);
            } else {
               console.error(
                  `Batch operation failed for item ${i + index}:`,
                  result.reason
               );
            }
         });

         // Small delay between batches to be respectful to the API
         if (i + concurrency < items.length) {
            await new Promise((resolve) => setTimeout(resolve, 100));
         }
      }

      return results;
   }

   // Cache management
   clearCache(): void {
      console.log("Clearing cache by reinitializing service");
      this.api = new MainClient({
         cacheOptions: {
            ttl: 10 * 60 * 1000,
         },
      });
      this.requestCount = 0;
      this.lastRequestTime = 0;
   }

   getCacheInfo() {
      return {
         ttl: "10 minutes",
         maxItems: 500,
         requestCount: this.requestCount,
         lastRequestTime: new Date(this.lastRequestTime).toISOString(),
         logLevel:
            typeof __DEV__ !== "undefined" && __DEV__ ? "debug" : "error",
      };
   }

   // Service health check
   getServiceHealth() {
      return {
         isHealthy: true,
         requestCount: this.requestCount,
         lastRequestTime: this.lastRequestTime,
         rateLimit: this.rateLimit,
      };
   }
}
