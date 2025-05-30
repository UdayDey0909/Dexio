import { QueryClient } from "@tanstack/react-query";
import { APIError, SearchOptions, PokemonFilters } from "./Types";

/**
 * @module Cache
 * Provides cache configuration, key factories, a query client instance,
 * and utility methods for managing cached Pokémon-related data.
 */

/**
 * Centralized cache configuration for query behaviors.
 *
 * @constant
 * @property {string} VERSION - Used for cache versioning and invalidation across app updates.
 * @property {number} STALE_TIME - Time in ms before data is considered stale.
 * @property {number} CACHE_TIME - Time in ms before unused data is garbage collected.
 * @property {number} RETRY_COUNT - Maximum retry attempts for failed queries.
 */
export const CACHE_CONFIG = {
   VERSION: "v1.2",
   STALE_TIME: 15 * 60 * 1000,
   CACHE_TIME: 30 * 60 * 1000,
   RETRY_COUNT: 2,
} as const;

/**
 * Factory object for generating stable cache keys for various resources.
 *
 * @constant
 */
export const cacheKeys = {
   pokemon: {
      /** Key for all Pokémon resources */
      all: ["pokemon", CACHE_CONFIG.VERSION] as const,

      /**
       * Key for list of Pokémon with optional filters.
       * @param {PokemonFilters} [filters] Optional filters to apply to the list.
       * @returns {readonly any[]} Cache key as a readonly tuple identifying the filtered Pokémon list.
       */
      list: (filters?: PokemonFilters): readonly any[] =>
         filters
            ? (["pokemon", CACHE_CONFIG.VERSION, "list", filters] as const)
            : (["pokemon", CACHE_CONFIG.VERSION, "list"] as const),

      /**
       * Key for individual Pokémon details.
       * @param {number|string} id - Pokémon ID or name.
       * @returns {readonly any[]} Cache key tuple identifying this Pokémon detail.
       */
      detail: (id: number | string): readonly any[] =>
         ["pokemon", CACHE_CONFIG.VERSION, "detail", String(id)] as const,

      /**
       * Key for Pokémon search queries.
       * @param {string} query - Search string.
       * @param {number} [limit=10] - Maximum number of results.
       * @returns {readonly any[]} Cache key tuple identifying this search.
       */
      search: (query: string, limit?: number): readonly any[] =>
         [
            "pokemon",
            CACHE_CONFIG.VERSION,
            "search",
            query,
            limit || 10,
         ] as const,
   },

   types: {
      /** Key for all types */
      all: ["types", CACHE_CONFIG.VERSION] as const,

      /**
       * Key for type list.
       * @returns {readonly any[]} Cache key tuple identifying the list of types.
       */
      list: (): readonly any[] =>
         ["types", CACHE_CONFIG.VERSION, "list"] as const,

      /**
       * Key for individual type detail.
       * @param {number|string} id - Type ID or name.
       * @returns {readonly any[]} Cache key tuple identifying the type detail.
       */
      detail: (id: number | string): readonly any[] =>
         ["types", CACHE_CONFIG.VERSION, "detail", String(id)] as const,
   },

   moves: {
      /** Key for all moves */
      all: ["moves", CACHE_CONFIG.VERSION] as const,

      /**
       * Key for move list.
       * @returns {readonly any[]} Cache key tuple identifying the list of moves.
       */
      list: (): readonly any[] =>
         ["moves", CACHE_CONFIG.VERSION, "list"] as const,

      /**
       * Key for move detail.
       * @param {number|string} id - Move ID or name.
       * @returns {readonly any[]} Cache key tuple identifying the move detail.
       */
      detail: (id: number | string): readonly any[] =>
         ["moves", CACHE_CONFIG.VERSION, "detail", String(id)] as const,
   },

   /** Key for user preferences */
   preferences: ["preferences", CACHE_CONFIG.VERSION] as const,
} as const;

/**
 * Type guard to check if an object is an APIError.
 *
 * @param {unknown} error - Error object to validate.
 * @returns {error is APIError} Whether the error is an APIError.
 */
const isAPIError = (error: unknown): error is APIError => {
   return (
      typeof error === "object" &&
      error !== null &&
      "code" in error &&
      "message" in error
   );
};

/**
 * Retry logic for failed queries.
 *
 * Does not retry for 4xx client errors.
 *
 * @param {number} failureCount - Current retry attempt count.
 * @param {unknown} error - The error encountered.
 * @returns {boolean} Whether to retry the request.
 */
const shouldRetry = (failureCount: number, error: unknown): boolean => {
   if (isAPIError(error)) {
      const statusCode = parseInt(error.code);
      if (statusCode >= 400 && statusCode < 500) {
         return false; // Do not retry on client-side errors
      }
   }
   return failureCount < CACHE_CONFIG.RETRY_COUNT;
};

/**
 * A preconfigured React Query client with cache and retry settings.
 *
 * @constant
 */
export const queryClient = new QueryClient({
   defaultOptions: {
      queries: {
         staleTime: CACHE_CONFIG.STALE_TIME,
         gcTime: CACHE_CONFIG.CACHE_TIME,
         retry: shouldRetry,
         refetchOnWindowFocus: false,
         refetchOnReconnect: true,
         refetchOnMount: false,
         throwOnError: false,
      },
      mutations: {
         retry: 1,
         throwOnError: false,
      },
   },
});

/**
 * Utility methods for interacting with the cache.
 *
 * @namespace cacheUtils
 */
export const cacheUtils = {
   /**
    * Invalidate all Pokémon cache entries.
    *
    * @function
    * @returns {Promise<void>} Promise that resolves when invalidation is complete.
    * @example
    * cacheUtils.invalidatePokemon();
    */
   invalidatePokemon: (): Promise<void> =>
      queryClient.invalidateQueries({ queryKey: cacheKeys.pokemon.all }),

   /**
    * Invalidate cache for a specific Pokémon by ID.
    *
    * @function
    * @param {number|string} id - Pokémon ID or name.
    * @returns {Promise<void>} Promise that resolves when invalidation is complete.
    * @example
    * cacheUtils.invalidatePokemonDetail(25);
    */
   invalidatePokemonDetail: (id: number | string): Promise<void> =>
      queryClient.invalidateQueries({ queryKey: cacheKeys.pokemon.detail(id) }),

   /**
    * Retrieve Pokémon data from cache.
    *
    * @function
    * @template T
    * @param {number|string} id - Pokémon ID or name.
    * @returns {T | undefined} Cached data if available, otherwise undefined.
    * @example
    * const pikachu = cacheUtils.getCachedPokemon<Pokemon>(25);
    */
   getCachedPokemon: <T = any>(id: number | string): T | undefined =>
      queryClient.getQueryData(cacheKeys.pokemon.detail(id)),

   /**
    * Manually set Pokémon data into cache.
    *
    * @function
    * @template T
    * @param {number|string} id - Pokémon ID or name.
    * @param {T} data - Data to store in cache.
    * @returns {void}
    * @example
    * cacheUtils.setCachedPokemon(25, pikachuData);
    */
   setCachedPokemon: <T = any>(id: number | string, data: T): void =>
      void queryClient.setQueryData(cacheKeys.pokemon.detail(id), data),

   /**
    * Clears the entire client-side cache.
    *
    * @function
    * @returns {void}
    * @example
    * cacheUtils.clearAll();
    */
   clearAll: (): void => queryClient.clear(),

   /**
    * Prefetch common data (e.g., Pokémon types) to warm up the cache.
    *
    * @async
    * @function
    * @returns {Promise<void>} Promise that resolves when prefetch is done.
    * @example
    * await cacheUtils.prefetchCommon();
    */
   prefetchCommon: async (): Promise<void> => {
      try {
         await queryClient.prefetchQuery({
            queryKey: cacheKeys.types.list(),
            queryFn: async () => {
               // Placeholder for real fetch logic, e.g. fetch types from API
               return [];
            },
         });
      } catch (error) {
         console.warn("Failed to prefetch common data:", error);
      }
   },
};
