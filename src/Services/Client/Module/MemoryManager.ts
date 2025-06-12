import { CacheManager } from "./CacheManager";
import { CacheOptions } from "../Types";

/**
 * Singleton class responsible for managing memory cleanup operations across the application.
 * Provides a centralized mechanism for registering cleanup callbacks that can be triggered
 * when memory needs to be freed, such as during component unmounting, navigation changes,
 * or low memory conditions in React Native applications.
 *
 * The singleton pattern ensures that cleanup operations are coordinated globally,
 * preventing memory leaks and optimizing resource usage in mobile environments.
 *
 * @example
 * ```typescript
 * // Get the singleton instance
 * const memoryManager = MemoryManager.getInstance();
 *
 * // Register a cleanup callback
 * const unregister = memoryManager.addCleanupCallback(() => {
 *    console.log("Cleaning up resources...");
 *    // Perform cleanup operations
 * });
 *
 * // Later, unregister the callback if needed
 * unregister();
 *
 * // Trigger all cleanup callbacks
 * memoryManager.cleanup();
 * ```
 */
export class MemoryManager {
   /** The singleton instance of MemoryManager */
   private static instance: MemoryManager;

   /** Set of registered cleanup callback functions */
   private cleanupCallbacks: Set<() => void> = new Set();

   /**
    * Gets the singleton instance of the MemoryManager.
    * Creates a new instance if one doesn't exist, otherwise returns the existing instance.
    * This ensures that all parts of the application share the same memory management state.
    *
    * @returns {MemoryManager} The singleton MemoryManager instance
    *
    * @example
    * ```typescript
    * // Multiple calls return the same instance
    * const manager1 = MemoryManager.getInstance();
    * const manager2 = MemoryManager.getInstance();
    * console.log(manager1 === manager2); // true
    *
    * // Use the instance to manage cleanup callbacks
    * const memoryManager = MemoryManager.getInstance();
    * ```
    */
   static getInstance(): MemoryManager {
      if (!MemoryManager.instance) {
         MemoryManager.instance = new MemoryManager();
      }
      return MemoryManager.instance;
   }

   /**
    * Registers a cleanup callback function and returns an unregister function.
    * The callback will be invoked when cleanup() is called, allowing components
    * or services to perform necessary cleanup operations like clearing timers,
    * canceling network requests, or releasing resources.
    *
    * @param callback - A function to be called during memory cleanup operations.
    *                   Should contain logic to free resources, clear caches, or
    *                   perform other cleanup tasks.
    * @returns {() => void} A function that can be called to unregister the callback.
    *                       Calling this function removes the callback from the cleanup list.
    *
    * @example
    * ```typescript
    * const memoryManager = MemoryManager.getInstance();
    *
    * // Register cleanup for a component with timers
    * const unregisterTimer = memoryManager.addCleanupCallback(() => {
    *    clearInterval(myTimer);
    *    console.log("Timer cleared");
    * });
    *
    * // Register cleanup for network requests
    * const unregisterNetwork = memoryManager.addCleanupCallback(() => {
    *    abortController.abort();
    *    console.log("Network requests canceled");
    * });
    *
    * // Later, unregister specific callbacks if needed
    * unregisterTimer(); // Only removes the timer cleanup
    *
    * // Or let cleanup() call all remaining callbacks
    * memoryManager.cleanup(); // Calls the network cleanup callback
    * ```
    */
   addCleanupCallback(callback: () => void): () => void {
      this.cleanupCallbacks.add(callback);
      return () => this.cleanupCallbacks.delete(callback);
   }

   /**
    * Manually triggers cleanup by invoking all registered cleanup callbacks.
    * This method should be called when the application needs to free memory,
    * such as during low memory warnings, navigation changes, or application
    * background in React Native.
    *
    * All registered callbacks are executed synchronously in the order they were added.
    * After cleanup, the callbacks remain registered and can be triggered again
    * by subsequent calls to this method.
    *
    * @example
    * ```typescript
    * const memoryManager = MemoryManager.getInstance();
    *
    * // Register some cleanup callbacks
    * memoryManager.addCleanupCallback(() => {
    *    // Clear image cache
    *    ImageCache.clear();
    * });
    *
    * memoryManager.addCleanupCallback(() => {
    *    // Clear API response cache
    *    ApiCache.clear();
    * });
    *
    * // Trigger cleanup when needed
    * memoryManager.cleanup(); // Both callbacks are executed
    *
    * // In React Native, you might call this on memory warnings:
    * // AppState.addEventListener('memoryWarning', () => {
    * //    memoryManager.cleanup();
    * // });
    * ```
    */
   cleanup(): void {
      console.log("Triggering memory cleanup");
      this.cleanupCallbacks.forEach((callback) => callback());
   }
}

/**
 * A mobile-optimized version of CacheManager specifically designed for React Native applications.
 * Extends the base CacheManager with mobile-friendly default settings and additional
 * monitoring capabilities tailored for resource-constrained mobile environments.
 *
 * The mobile defaults prioritize memory efficiency while maintaining reasonable performance,
 * with shorter TTL values and lower item limits compared to desktop applications.
 *
 * @example
 * ```typescript
 * // Create with mobile-optimized defaults
 * const mobileCache = new MobileCacheManager();
 *
 * // Create with custom mobile configuration
 * const customMobileCache = new MobileCacheManager({
 *    ttl: 3 * 60 * 1000,  // 3 minutes for faster refresh
 *    maxItems: 75         // Fewer items for memory efficiency
 * });
 *
 * // Get cache statistics
 * const stats = mobileCache.getCacheStats();
 * console.log(stats.message); // "Cache configured for mobile usage"
 *
 * // Use like a regular CacheManager
 * const client = mobileCache.getClient();
 * const pokemon = await client.pokemon.getPokemonByName("pikachu");
 * ```
 */
export class MobileCacheManager extends CacheManager {
   /**
    * Creates an instance of MobileCacheManager with mobile-optimized defaults.
    *
    * Default mobile configuration:
    * - TTL: 5 minutes (300,000 milliseconds) - Shorter than typical desktop caching
    * - Max Items: 100 - Conservative limit for mobile memory constraints
    *
    * These defaults can be overridden by providing custom values in the config parameter.
    * The mobile optimization focuses on balancing performance with memory usage,
    * making it suitable for React Native applications where memory is more constrained.
    *
    * @param config - Optional configuration to override mobile defaults
    * @param config.ttl - Time to live in milliseconds (default: 5 minutes)
    * @param config.maxItems - Maximum number of items to cache (default: 100)
    *
    * @example
    * ```typescript
    * // Use mobile defaults (5min TTL, 100 items max)
    * const defaultMobile = new MobileCacheManager();
    *
    * // Override TTL for faster refresh on mobile
    * const fastRefresh = new MobileCacheManager({
    *    ttl: 2 * 60 * 1000  // 2 minutes
    * });
    *
    * // Override both settings for memory-constrained devices
    * const memoryOptimized = new MobileCacheManager({
    *    ttl: 3 * 60 * 1000,  // 3 minutes
    *    maxItems: 50         // Reduce cache size
    * });
    * ```
    */
   constructor(config: CacheOptions = {}) {
      const mobileConfig: CacheOptions = {
         ttl: config.ttl || 5 * 60 * 1000, // 5 minutes
         maxItems: config.maxItems || 100,
      };

      super(mobileConfig);
   }

   /**
    * Returns comprehensive cache information with mobile-specific context.
    * Extends the base cache information with a message indicating mobile optimization,
    * making it easy to identify mobile cache instances in logs and debugging tools.
    *
    * @example
    * ```typescript
    * const mobileCache = new MobileCacheManager({
    *    ttl: 3 * 60 * 1000,
    *    maxItems: 75
    * });
    *
    * const stats = mobileCache.getCacheStats();
    * console.log(stats);
    * // Output:
    * // {
    * //   ttl: "3 minutes",
    * //   ttlMinutes: 3,
    * //   ttlMs: 180000,
    * //   maxItems: 75,
    * //   message: "Cache configured for mobile usage"
    * // }
    *
    * // Useful for logging mobile cache status
    * console.log(`Mobile cache: ${stats.ttl} TTL, ${stats.maxItems} max items`);
    * console.log(stats.message);
    * ```
    */
   getCacheStats() {
      return {
         ...this.getInfo(),
         message: "Cache configured for mobile usage",
      };
   }
}
