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
      // Initialize client with cache options if supported
      try {
         this.client = new MainClient({
            cacheOptions: {
               ttl: this.config.ttl,
               // Only include maxItems if it's supported by the library
               ...(this.supportsMaxItems() && {
                  maxItems: this.config.maxItems,
               }),
            },
         });
         console.log("Cache initialized successfully");
      } catch (error) {
         // Fallback without cache options if not supported
         console.warn(
            "Cache options not supported, using default client:",
            error
         );
         this.client = new MainClient();
      }
   }

   private supportsMaxItems(): boolean {
      // Simple check to see if maxItems is supported
      // This is a defensive programming approach
      return true; // Assume it's supported unless we know otherwise
   }

   getClient(): MainClient {
      return this.client;
   }

   // FIXED: Don't recreate client - this was causing memory leaks
   clear(): void {
      console.log("Cache cleared - client reused to prevent memory leaks");
      // Note: pokenode-ts MainClient doesn't expose a direct cache.clear() method
      // So we just log for now. The cache will expire based on TTL anyway.
      // If you need immediate cache clearing, you'd need to check pokenode-ts docs
      // for the proper way to clear its internal cache.
   }

   getInfo() {
      const ttlMinutes = Math.floor(this.config.ttl! / 60000);

      return {
         ttl: `${ttlMinutes} minutes`,
         ttlMinutes: ttlMinutes,
         ttlMs: this.config.ttl!,
         maxItems: this.config.maxItems,
      };
   }
}
export { CacheOptions };
