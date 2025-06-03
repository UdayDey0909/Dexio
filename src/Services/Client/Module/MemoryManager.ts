import { CacheManager } from "./CacheManager";
import { CacheOptions } from "../Types";

/**
 * Singleton class responsible for managing memory cleanup operations.
 */
export class MemoryManager {
   private static instance: MemoryManager;
   private cleanupCallbacks: Set<() => void> = new Set();

   /**
    * Gets the singleton instance of the MemoryManager.
    * @returns {MemoryManager} The singleton instance.
    */
   static getInstance(): MemoryManager {
      if (!MemoryManager.instance) {
         MemoryManager.instance = new MemoryManager();
      }
      return MemoryManager.instance;
   }

   /**
    * Registers a cleanup callback and returns a function to unregister it.
    * @param callback A function to be called during memory cleanup.
    * @returns A function that can be called to unregister the callback.
    */
   addCleanupCallback(callback: () => void): () => void {
      this.cleanupCallbacks.add(callback);
      return () => this.cleanupCallbacks.delete(callback);
   }

   /**
    * Manually triggers cleanup by invoking all registered cleanup callbacks.
    */
   cleanup(): void {
      console.log("Triggering memory cleanup");
      this.cleanupCallbacks.forEach((callback) => callback());
   }
}

/**
 * A mobile-optimized version of CacheManager using reduced TTL and item limits.
 */
export class MobileCacheManager extends CacheManager {
   /**
    * Creates an instance of MobileCacheManager with mobile defaults.
    * @param config Optional overrides for TTL and maxItems.
    */
   constructor(config: CacheOptions = {}) {
      const mobileConfig: CacheOptions = {
         ttl: config.ttl || 5 * 60 * 1000, // 5 minutes
         maxItems: config.maxItems || 100,
      };

      super(mobileConfig);
   }

   /**
    * Returns current cache information with a mobile-specific message.
    * @returns Object containing cache statistics and a message.
    */
   getCacheStats() {
      return {
         ...this.getInfo(),
         message: "Cache configured for mobile usage",
      };
   }
}
