import { MainClient } from "pokenode-ts";
import { CacheOptions, CacheInfo } from "../Types";

export class CacheManager {
   private client!: MainClient;
   private readonly config: CacheOptions;

   constructor(config: CacheOptions = {}) {
      this.config = {
         ttl: config.ttl || 5 * 60 * 1000, // 5 minutes for mobile
         maxItems: config.maxItems || 100,
      };

      this.initializeClient();
   }

   private initializeClient(): void {
      try {
         this.client = new MainClient({
            cacheOptions: {
               ttl: this.config.ttl,
            },
         });
      } catch (error) {
         console.warn(
            "Cache initialization failed, using default client:",
            error
         );
         this.client = new MainClient();
      }
   }

   getClient(): MainClient {
      return this.client;
   }

   clear(): void {
      console.log("Cache cleared - TTL-based expiration will handle cleanup");
   }

   getInfo(): CacheInfo {
      const ttlMinutes = Math.floor(this.config.ttl! / 60000);

      return {
         ttl: `${ttlMinutes} minutes`,
         ttlMinutes: ttlMinutes,
         ttlMs: this.config.ttl!,
         maxItems: this.config.maxItems,
      };
   }
}
