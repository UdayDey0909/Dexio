import { CacheManager, CacheOptions } from "./CacheManager";

export class MemoryManager {
   private static instance: MemoryManager;
   private cleanupCallbacks: Set<() => void> = new Set();

   static getInstance(): MemoryManager {
      if (!MemoryManager.instance) {
         MemoryManager.instance = new MemoryManager();
      }
      return MemoryManager.instance;
   }

   // Simple callback registration for cleanup
   addCleanupCallback(callback: () => void): () => void {
      this.cleanupCallbacks.add(callback);
      return () => this.cleanupCallbacks.delete(callback);
   }

   // Manual cleanup trigger (for testing or explicit cleanup)
   cleanup(): void {
      console.log("Triggering memory cleanup");
      this.cleanupCallbacks.forEach((callback) => callback());
   }
}

// Simplified CacheManager - just use the base version with mobile-friendly defaults
export class MobileCacheManager extends CacheManager {
   constructor(config: CacheOptions = {}) {
      // Mobile-optimized defaults
      const mobileConfig: CacheOptions = {
         ttl: config.ttl || 5 * 60 * 1000, // 5 minutes
         maxItems: config.maxItems || 100, // Reduced from 200 to 100
      };

      super(mobileConfig);
   }

   // Optional: Add a method to get current cache info for debugging
   getCacheStats() {
      return {
         ...this.getInfo(),
         message: "Cache configured for mobile usage",
      };
   }
}
