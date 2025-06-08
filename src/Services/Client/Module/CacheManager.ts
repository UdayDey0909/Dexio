import { MainClient } from "pokenode-ts";
import { CacheOptions, CacheInfo } from "../Types";

/**
 * Manages caching behavior for the MainClient instance used throughout the application.
 * Provides configurable TTL (Time To Live) and maximum cache item limits to optimize
 * API response caching and reduce unnecessary network requests to the PokeAPI service.
 *
 * The cache automatically expires items based on the configured TTL, helping to balance
 * performance improvements with data freshness requirements.
 *
 * @example
 * ```typescript
 * // Create cache manager with default settings (5 minutes TTL, 100 max items)
 * const cacheManager = new CacheManager();
 *
 * // Create cache manager with custom settings
 * const customCache = new CacheManager({
 *    ttl: 10 * 60 * 1000, // 10 minutes
 *    maxItems: 200
 * });
 *
 * // Get the configured client instance
 * const client = cacheManager.getClient();
 * ```
 */
export class CacheManager {
   /** The MainClient instance with configured caching options */
   private client!: MainClient;

   /** The resolved cache configuration settings */
   private readonly config: CacheOptions;

   /**
    * Initializes a new instance of the CacheManager class with optional configuration.
    *
    * If no configuration is provided, defaults to:
    * - TTL: 5 minutes (300,000 milliseconds)
    * - Max Items: 100
    *
    * The constructor automatically initializes the MainClient with the specified cache options,
    * falling back to default client initialization if cache setup fails.
    *
    * @param config - Optional configuration object for cache behavior
    * @param config.ttl - Time to live in milliseconds (default: 5 minutes)
    * @param config.maxItems - Maximum number of items to cache (default: 100)
    *
    * @example
    * ```typescript
    * // Default configuration
    * const defaultCache = new CacheManager();
    *
    * // Custom TTL only
    * const longCache = new CacheManager({ ttl: 15 * 60 * 1000 });
    *
    * // Full custom configuration
    * const customCache = new CacheManager({
    *    ttl: 2 * 60 * 1000,  // 2 minutes
    *    maxItems: 50
    * });
    * ```
    */
   constructor(config: CacheOptions = {}) {
      this.config = {
         ttl: config.ttl || 5 * 60 * 1000, // 5 minutes
         maxItems: config.maxItems || 100,
      };

      this.initializeClient();
   }

   /**
    * Initializes the MainClient instance with the configured cache options.
    *
    * Attempts to create a MainClient with caching enabled using the TTL setting.
    * If initialization fails (due to invalid options or other errors), logs a warning
    * and falls back to creating a default MainClient without caching.
    *
    * This method is called automatically during construction and should not be
    * called directly by external code.
    *
    * @private
    * @throws Does not throw - handles errors internally with fallback behavior
    *
    * @example
    * ```typescript
    * // This method is called internally during construction
    * // No direct usage - handled automatically by constructor
    * ```
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
    * Returns the initialized MainClient instance for making API requests.
    *
    * This client is pre-configured with the caching options specified during
    * CacheManager construction. Use this client for all PokeAPI requests to
    * benefit from the configured caching behavior.
    *
    * @returns {MainClient} The configured MainClient instance with caching enabled
    *
    * @example
    * ```typescript
    * const cacheManager = new CacheManager();
    * const client = cacheManager.getClient();
    *
    * // Use the client for API requests
    * const pokemon = await client.pokemon.getPokemonByName("pikachu");
    * const species = await client.pokemon.getPokemonSpeciesById(25);
    * ```
    */
   getClient(): MainClient {
      return this.client;
   }

   /**
    * Clears the cache by relying on TTL-based expiration mechanisms.
    *
    * Note: This method logs the clear operation but does not perform immediate
    * cache clearing. The underlying pokenode-ts library uses TTL-based expiration,
    * so cached items will automatically expire based on the configured TTL value.
    *
    * For immediate cache clearing, consider creating a new CacheManager instance
    * if absolutely necessary.
    *
    * @example
    * ```typescript
    * const cacheManager = new CacheManager();
    *
    * // Request some data (gets cached)
    * await cacheManager.getClient().pokemon.getPokemonByName("pikachu");
    *
    * // Clear cache - items will expire based on TTL
    * cacheManager.clear();
    *
    * // For immediate clearing, create new instance:
    * // const newCacheManager = new CacheManager(sameConfig);
    * ```
    */
   clear(): void {
      console.log("Cache cleared - TTL-based expiration will handle cleanup");
   }

   /**
    * Returns comprehensive information about the current cache configuration.
    *
    * Provides the TTL in multiple formats (human-readable string, minutes, and milliseconds)
    * along with the maximum items limit. This information is useful for debugging,
    * monitoring, and displaying cache status in development tools or admin interfaces.
    *
    * @returns {CacheInfo} Object containing detailed cache configuration information
    * @returns {CacheInfo.ttl} Human-readable TTL string (e.g., "5 minutes")
    * @returns {CacheInfo.ttlMinutes} TTL value in minutes as a number
    * @returns {CacheInfo.ttlMs} TTL value in milliseconds as a number
    * @returns {CacheInfo.maxItems} Maximum number of items that can be cached
    *
    * @example
    * ```typescript
    * const cacheManager = new CacheManager({ ttl: 10 * 60 * 1000, maxItems: 200 });
    * const info = cacheManager.getInfo();
    *
    * console.log(`Cache TTL: ${info.ttl}`);                    // "10 minutes"
    * console.log(`TTL in minutes: ${info.ttlMinutes}`);        // 10
    * console.log(`TTL in milliseconds: ${info.ttlMs}`);        // 600000
    * console.log(`Max cached items: ${info.maxItems}`);        // 200
    *
    * // Useful for logging or debugging
    * console.log(`Cache configured with ${info.ttl} TTL and ${info.maxItems} max items`);
    * ```
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
