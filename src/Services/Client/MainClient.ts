import { MainClient } from "pokenode-ts";
import { RetryManager } from "./Module/RetryManager";
import { NetworkManager } from "./Module/NetworkManager";
import { ErrorHandler, PokemonError } from "./Module/ErrorHandler";
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
      } catch {
         this.api = new MainClient(); // Fallback without cache
      }
   }

   /**
    * Execute operation with retry and error handling
    */
   protected async execute<T>(
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
         throw pokemonError;
      }
   }

   /**
    * Get Pokemon by name or ID
    */
   protected async getPokemonResource<T>(
      getByName: (name: string) => Promise<T>,
      getById: (id: number) => Promise<T>,
      identifier: string | number
   ): Promise<T> {
      if (!identifier) {
         throw new Error("Identifier is required");
      }

      return this.execute(async () => {
         if (typeof identifier === "string") {
            return await getByName(identifier.toLowerCase().trim());
         } else {
            return await getById(identifier);
         }
      });
   }

   /**
    * Batch operations with simple concurrency control
    */
   protected async batchProcess<T, R>(
      items: T[],
      operation: (item: T) => Promise<R>,
      batchSize: number = 5
   ): Promise<R[]> {
      if (!items?.length) return [];

      const results: R[] = [];

      for (let i = 0; i < items.length; i += batchSize) {
         const batch = items.slice(i, i + batchSize);
         const batchResults = await Promise.allSettled(batch.map(operation));

         for (const result of batchResults) {
            if (result.status === "fulfilled") {
               results.push(result.value);
            } else {
               console.warn("Batch operation failed:", result.reason);
            }
         }

         // Small delay between batches
         if (i + batchSize < items.length) {
            await new Promise((resolve) => setTimeout(resolve, 100));
         }
      }

      return results;
   }

   // Utility methods
   isOnline(): boolean {
      return this.networkManager.isOnline();
   }

   async checkConnection(): Promise<boolean> {
      return this.networkManager.checkConnection();
   }
}
