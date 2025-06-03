import { MainClient } from "pokenode-ts";
import { CacheOptions, CacheInfo } from "../Types";

/**
 * Manages caching behavior for the MainClient.
 * Allows configuration of TTL and max cache items.
 */
export class CacheManager {
   private client!: MainClient;
   private readonly config: CacheOptions;

   /**
    * Initializes a new instance of the CacheManager class.
    * @param config Optional configuration for TTL and max items.
    */
   constructor(config: CacheOptions = {}) {
      this.config = {
         ttl: config.ttl || 5 * 60 * 1000, // 5 minutes
         maxItems: config.maxItems || 100,
      };

      this.initializeClient();
   }

   /**
    * Initializes the MainClient instance with cache options.
    * Falls back to default initialization on failure.
    */
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

   /**
    * Returns the initialized MainClient instance.
    * @returns {MainClient} The client instance.
    */
   getClient(): MainClient {
      return this.client;
   }

   /**
    * Clears the cache (note: TTL-based expiration is used).
    */
   clear(): void {
      console.log("Cache cleared - TTL-based expiration will handle cleanup");
   }

   /**
    * Returns the current cache configuration and TTL information.
    * @returns {CacheInfo} TTL and cache limit information.
    */
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
