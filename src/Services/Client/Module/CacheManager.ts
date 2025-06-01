import { MainClient } from "pokenode-ts";
import { CacheOptions } from "../Types";

export class CacheManager {
   private client!: MainClient;
   private readonly config: CacheOptions;

   constructor(config: CacheOptions = {}) {
      this.config = {
         ttl: config.ttl || 10 * 60 * 1000,
         maxItems: config.maxItems || 500,
      };

      this.initializeClient();
   }

   private initializeClient(): void {
      // Note: pokenode-ts MainClient might not support maxItems in cacheOptions
      // We'll only use supported options
      this.client = new MainClient({
         cacheOptions: {
            ttl: this.config.ttl,
            // maxItems: this.config.maxItems, // Remove if not supported
         },
      });
   }

   getClient(): MainClient {
      return this.client;
   }

   clear(): void {
      console.log("Clearing cache by reinitializing client");
      this.initializeClient();
   }

   getInfo() {
      return {
         ttl: `${Math.floor(this.config.ttl! / 60000)} minutes`,
         maxItems: this.config.maxItems,
      };
   }
}
