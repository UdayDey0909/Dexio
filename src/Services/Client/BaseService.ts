import { MainClient } from "pokenode-ts";
import { RetryManager } from "./Module/RetryManager";
import { NetworkManager } from "./Module/NetworkManager";
import { ErrorHandler } from "./Module/ErrorHandler";
import { Validator } from "./Module/Validator";
import { UrlUtils } from "./Module/UrlUtils";
import type { ServiceConfig, ServiceHealth } from "./Types";

export class BaseService {
   protected api: MainClient;
   private retryManager: RetryManager;
   private networkManager: NetworkManager;

   constructor(config: ServiceConfig = {}) {
      const {
         maxRetries = 3,
         retryDelay = 1000,
         cacheTimeout = 10 * 60 * 1000, // Increased cache timeout
      } = config;

      this.retryManager = new RetryManager(maxRetries, retryDelay);
      this.networkManager = new NetworkManager();

      try {
         this.api = new MainClient({
            cacheOptions: { ttl: cacheTimeout },
         });
      } catch (error) {
         console.warn("Cache initialization failed, using fallback:", error);
         this.api = new MainClient();
      }
   }

   protected async executeWithErrorHandling<T>(
      operation: () => Promise<T>,
      errorContext?: string
   ): Promise<T> {
      if (!(await this.networkManager.checkConnection())) {
         throw new Error("No network connection available");
      }

      try {
         return await this.retryManager.executeWithRetry(
            operation,
            errorContext
         );
      } catch (error) {
         const pokemonError = ErrorHandler.handle(error, errorContext);
         const enhancedError = new Error(pokemonError.userMessage);
         enhancedError.cause = error;
         throw enhancedError;
      }
   }

   // OPTIMIZED BATCH OPERATION - Balanced approach
   protected async batchOperation<T, R>(
      items: T[],
      operation: (item: T) => Promise<R>,
      concurrency: number = 6 // Moderate concurrency
   ): Promise<R[]> {
      if (!items?.length) return [];

      Validator.validateArray(items, "Batch items");
      const safeConcurrency = Math.min(concurrency, 8); // Reasonable max

      const results: R[] = [];
      const errors: Array<{ item: T; error: Error }> = [];

      for (let i = 0; i < items.length; i += safeConcurrency) {
         const batch = items.slice(i, i + safeConcurrency);

         // Small delay between batches to avoid rate limiting
         if (i > 0) {
            await new Promise((resolve) => setTimeout(resolve, 80));
         }

         const batchResults = await Promise.allSettled(
            batch.map(async (item) => {
               return operation(item);
            })
         );

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
            }
         }
      }

      if (errors.length > 0) {
         console.warn(
            `Batch completed with ${errors.length}/${items.length} errors`
         );
      }

      return results;
   }

   // Validation methods
   protected validateIdentifier(
      identifier: string | number,
      name: string
   ): void {
      Validator.validateIdentifier(identifier, name);
   }

   protected validatePaginationParams(offset: number, limit: number): void {
      Validator.validatePaginationParams(offset, limit);
   }

   // URL utility methods
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

   getHealthStatus(): ServiceHealth {
      return {
         isHealthy: this.networkManager.isOnline(),
         networkStatus: this.networkManager.isOnline(),
         lastCheck: new Date().toISOString(),
         cacheInfo: {
            ttl: 10 * 60 * 1000, // Updated to match constructor
            maxItems: 100,
         },
         retryConfig: {
            attempts: 3,
            delay: 1000,
         },
      };
   }

   clearCache(): void {
      console.log("Cache clear requested - will expire naturally via TTL");
   }

   cleanup(): void {
      this.networkManager.cleanup();
   }
}
