// src/Services/Client/MainClient.ts
import { MainClient } from "pokenode-ts";
import { RetryManager } from "./Module/RetryManager";
import { NetworkManager } from "./Module/NetworkManager";
import { ErrorHandler } from "./Module/ErrorHandler";
import { Validator } from "./Module/Validator";
import { UrlUtils } from "./Module/UrlUtils";
import { ServiceConfig } from "./Types";

export class BaseService {
   protected api: MainClient;
   private retryManager: RetryManager;
   private networkManager: NetworkManager;

   constructor(config: ServiceConfig = {}) {
      const {
         maxRetries = 3,
         retryDelay = 1000,
         cacheTimeout = 5 * 60 * 1000, // 5 minutes
      } = config;

      this.retryManager = new RetryManager(maxRetries, retryDelay);
      this.networkManager = new NetworkManager();

      // Initialize API client with basic cache
      try {
         this.api = new MainClient({
            cacheOptions: { ttl: cacheTimeout },
         });
         console.log("BaseService API client initialized with cache");
      } catch (error) {
         console.warn("Cache initialization failed, using fallback:", error);
         this.api = new MainClient(); // Fallback without cache
      }
   }

   /**
    * Execute operation with retry and error handling
    * FIXED: Keeping only this method, removed duplicate execute()
    */
   protected async executeWithErrorHandling<T>(
      operation: () => Promise<T>,
      errorContext?: string
   ): Promise<T> {
      // Check network first
      if (!(await this.networkManager.checkConnection())) {
         throw new Error("No network connection");
      }

      try {
         return await this.retryManager.executeWithRetry(operation);
      } catch (error) {
         const pokemonError = ErrorHandler.handle(error, errorContext);
         throw new Error(pokemonError.userMessage);
      }
   }

   // REMOVED: Duplicate execute() method - use executeWithErrorHandling() everywhere

   /**
    * Batch operations with concurrency control
    * FIXED: Using consistent concurrency limit of 5 (mobile-friendly)
    */
   protected async batchOperation<T, R>(
      items: T[],
      operation: (item: T) => Promise<R>,
      concurrency: number = 5 // Consistent default
   ): Promise<R[]> {
      if (!items?.length) return [];

      // Validate batch size
      Validator.validateArray(items, "Batch items");

      // Ensure concurrency doesn't exceed our limits
      const safeConcurrency = Math.min(concurrency, 10);

      const results: R[] = [];
      const errors: Array<{ item: T; error: Error }> = [];

      for (let i = 0; i < items.length; i += safeConcurrency) {
         const batch = items.slice(i, i + safeConcurrency);
         const batchResults = await Promise.allSettled(batch.map(operation));

         for (let j = 0; j < batchResults.length; j++) {
            const result = batchResults[j];
            if (result.status === "fulfilled") {
               results.push(result.value);
            } else {
               errors.push({
                  item: batch[j],
                  error:
                     result.reason instanceof Error
                        ? result.reason
                        : new Error(String(result.reason)),
               });
               console.warn("Batch operation failed:", result.reason);
            }
         }

         // Small delay between batches to prevent overwhelming the API
         if (i + safeConcurrency < items.length) {
            await new Promise((resolve) => setTimeout(resolve, 100));
         }
      }

      // If there are errors but also results, log them but continue
      if (errors.length > 0) {
         console.warn(
            `Batch operation completed with ${errors.length} errors out of ${items.length} items`
         );
      }

      return results;
   }

   /**
    * Validation methods that your API services use
    */
   protected validateIdentifier(
      identifier: string | number,
      name: string
   ): void {
      Validator.validateIdentifier(identifier, name);
   }

   protected validatePaginationParams(offset: number, limit: number): void {
      Validator.validatePaginationParams(offset, limit);
   }

   /**
    * URL utility methods that your API services use
    */
   protected extractIdFromUrl(url: string): number | null {
      return UrlUtils.extractIdFromUrl(url);
   }

   protected extractNameFromUrl(url: string): string | null {
      return UrlUtils.extractNameFromUrl(url);
   }

   protected buildApiUrl(
      endpoint: string,
      identifier?: string | number
   ): string {
      return UrlUtils.buildApiUrl(endpoint, identifier);
   }

   protected isValidApiUrl(url: string): boolean {
      return UrlUtils.isValidApiUrl(url);
   }

   // Utility methods
   isOnline(): boolean {
      return this.networkManager.isOnline();
   }

   async checkConnection(): Promise<boolean> {
      return this.networkManager.checkConnection();
   }

   /**
    * Get service health status
    */
   getHealthStatus() {
      return {
         isHealthy: this.networkManager.isOnline(),
         networkStatus: this.networkManager.isOnline(),
         lastCheck: new Date().toISOString(),
      };
   }

   /**
    * Clear cache method for consistency
    */
   clearCache(): void {
      console.log("Cache clear requested - will expire naturally via TTL");
   }
}
