// shared/services/api/client/cache.ts
import { QueryClient } from "@tanstack/react-query";

// Enhanced types for better type safety
interface PokemonFilters {
   type?: string;
   generation?: number;
   limit?: number;
   offset?: number;
}

interface SearchOptions {
   query: string;
   limit?: number;
}

// API Error interface for better error handling
interface APIError {
   status?: number;
   message?: string;
   code?: string;
}

// Cache versioning and key constants
export const CACHE_CONFIG = {
   /** Cache version for migration handling */
   VERSION: "v1",
   /** Stale time options in milliseconds */
   STALE_TIME: {
      /** Short stale time for frequently changing data */
      SHORT: 5 * 60 * 1000, // 5 minutes
      /** Medium stale time for moderately static data */
      MEDIUM: 10 * 60 * 1000, // 10 minutes
      /** Long stale time for very static data */
      LONG: 30 * 60 * 1000, // 30 minutes
   },
   /** Cache time options in milliseconds */
   CACHE_TIME: {
      /** Short cache time for temporary data */
      SHORT: 10 * 60 * 1000, // 10 minutes
      /** Medium cache time for standard data */
      MEDIUM: 30 * 60 * 1000, // 30 minutes
      /** Long cache time for persistent data */
      LONG: 60 * 60 * 1000, // 1 hour
   },
   /** Cache key prefix for consistent versioning */
   CACHE_KEY_PREFIX: "pokemon-app-cache",
} as const;

// Generate versioned cache key
export const CACHE_KEY = `${CACHE_CONFIG.CACHE_KEY_PREFIX}-${CACHE_CONFIG.VERSION}`;

/**
 * Normalizes and stabilizes object property order for consistent cache keys
 * @param obj - Object to normalize
 * @returns Normalized object with sorted keys, excluding undefined/null values
 */
const normalizeObject = <T extends Record<string, any>>(obj: T): T => {
   const normalized = {} as T;
   Object.keys(obj)
      .sort()
      .forEach((key) => {
         const value = obj[key];
         if (value !== undefined && value !== null) {
            normalized[key as keyof T] = value;
         }
      });
   return normalized;
};

/**
 * Creates a stable string representation of an object for cache keys
 * @param obj - Object to stringify
 * @returns Stable stringified representation
 */
const stableStringify = (obj: any): string => {
   if (!obj || typeof obj !== "object") return String(obj);
   return JSON.stringify(normalizeObject(obj));
};

/**
 * Enhanced QueryClient configuration optimized for Pokemon data
 * Configured with mobile-friendly settings and Pokemon API characteristics
 */
const queryClient = new QueryClient({
   defaultOptions: {
      queries: {
         staleTime: CACHE_CONFIG.STALE_TIME.MEDIUM, // 10 minutes - Pokemon data is relatively static
         retry: (failureCount, error: APIError) => {
            // Don't retry on 404s (Pokemon not found) or client errors (4xx)
            if (error?.status && error.status >= 400 && error.status < 500) {
               return false;
            }
            return failureCount < 3;
         },
         retryDelay: (attemptIndex) =>
            Math.min(1000 * 2 ** attemptIndex, 30000),
         refetchOnWindowFocus: false, // Less relevant for mobile apps
         refetchOnReconnect: true, // Important for mobile network changes
         refetchOnMount: false, // Use cache when available
         refetchInterval: false, // Pokemon data doesn't need polling
         networkMode: "online", // Handle offline scenarios gracefully
      },
      mutations: {
         retry: 1,
         networkMode: "online",
      },
   },
});

/**
 * Factory functions for creating default filter and search objects
 * Provides consistent defaults and prevents cache key variations
 */
export const defaultFilters = {
   /**
    * Creates default Pokemon filters with consistent property order
    * @param overrides - Partial filter overrides
    * @returns Normalized Pokemon filters
    * @example
    * ```typescript
    * const filters = defaultFilters.pokemon({ type: 'fire', limit: 50 });
    * ```
    */
   pokemon: (overrides: Partial<PokemonFilters> = {}): PokemonFilters => {
      const baseFilters: PokemonFilters = {
         generation: undefined,
         limit: 20,
         offset: 0,
         type: undefined,
      };
      return normalizeObject({ ...baseFilters, ...overrides });
   },

   /**
    * Creates default search options with consistent property order
    * @param query - Search query string
    * @param overrides - Partial search option overrides
    * @returns Normalized search options
    * @example
    * ```typescript
    * const searchOpts = defaultFilters.search('pikachu', { limit: 5 });
    * ```
    */
   search: (
      query: string,
      overrides: Partial<Omit<SearchOptions, "query">> = {}
   ): SearchOptions => {
      const baseOptions: SearchOptions = {
         query: query.trim().toLowerCase(), // Normalize query
         limit: 10,
      };
      return normalizeObject({ ...baseOptions, ...overrides });
   },
};

/**
 * Hierarchical cache key structure for React Query
 * Organized by resource type with factory functions for type safety and consistency
 * All keys include versioning and use stable stringification to prevent cache misses
 */
export const cacheKeys = {
   pokemon: {
      /** Base key for all Pokemon-related queries */
      all: ["pokemon", CACHE_CONFIG.VERSION] as const,

      /** Base key for Pokemon list queries */
      lists: () => [...cacheKeys.pokemon.all, "list"] as const,

      /**
       * Cache key for Pokemon list with filters
       * @param filters - Optional filters object, uses defaults if not provided
       */
      list: (filters: PokemonFilters = {}) =>
         [
            ...cacheKeys.pokemon.lists(),
            stableStringify(defaultFilters.pokemon(filters)),
         ] as const,

      /** Base key for Pokemon detail queries */
      details: () => [...cacheKeys.pokemon.all, "detail"] as const,

      /**
       * Cache key for individual Pokemon detail
       * @param id - Pokemon ID (number or string)
       */
      detail: (id: number | string) =>
         [...cacheKeys.pokemon.details(), String(id)] as const,

      /**
       * Cache key for Pokemon species data
       * @param id - Pokemon species ID
       */
      species: (id: number | string) =>
         [...cacheKeys.pokemon.all, "species", String(id)] as const,

      /**
       * Cache key for Pokemon evolution chain
       * @param id - Evolution chain ID
       */
      evolution: (id: number | string) =>
         [...cacheKeys.pokemon.all, "evolution", String(id)] as const,

      /**
       * Cache key for Pokemon search results
       * @param query - Search query string
       * @param options - Optional search options
       */
      search: (
         query: string,
         options: Partial<Omit<SearchOptions, "query">> = {}
      ) =>
         [
            ...cacheKeys.pokemon.all,
            "search",
            stableStringify(defaultFilters.search(query, options)),
         ] as const,

      /** Cache key for user's favorite Pokemon */
      favorites: () => [...cacheKeys.pokemon.all, "favorites"] as const,

      /** Cache key for user's Pokemon team */
      team: () => [...cacheKeys.pokemon.all, "team"] as const,
   },

   types: {
      /** Base key for all type-related queries */
      all: ["types", CACHE_CONFIG.VERSION] as const,

      /** Cache key for types list */
      list: () => [...cacheKeys.types.all, "list"] as const,

      /**
       * Cache key for individual type detail
       * @param id - Type ID
       */
      detail: (id: number | string) =>
         [...cacheKeys.types.all, "detail", String(id)] as const,

      /**
       * Cache key for type effectiveness data
       * @param id - Type ID
       */
      effectiveness: (id: number | string) =>
         [...cacheKeys.types.all, "effectiveness", String(id)] as const,
   },

   moves: {
      /** Base key for all move-related queries */
      all: ["moves", CACHE_CONFIG.VERSION] as const,

      /** Cache key for moves list */
      list: () => [...cacheKeys.moves.all, "list"] as const,

      /**
       * Cache key for individual move detail
       * @param id - Move ID
       */
      detail: (id: number | string) =>
         [...cacheKeys.moves.all, "detail", String(id)] as const,

      /**
       * Cache key for moves filtered by type
       * @param typeId - Type ID to filter by
       */
      byType: (typeId: number | string) =>
         [...cacheKeys.moves.all, "type", String(typeId)] as const,
   },

   abilities: {
      /** Base key for all ability-related queries */
      all: ["abilities", CACHE_CONFIG.VERSION] as const,

      /** Cache key for abilities list */
      list: () => [...cacheKeys.abilities.all, "list"] as const,

      /**
       * Cache key for individual ability detail
       * @param id - Ability ID
       */
      detail: (id: number | string) =>
         [...cacheKeys.abilities.all, "detail", String(id)] as const,

      /**
       * Cache key for abilities by Pokemon
       * @param pokemonId - Pokemon ID
       */
      byPokemon: (pokemonId: number | string) =>
         [...cacheKeys.abilities.all, "pokemon", String(pokemonId)] as const,
   },

   locations: {
      /** Base key for all location-related queries */
      all: ["locations", CACHE_CONFIG.VERSION] as const,

      /** Cache key for locations list */
      list: () => [...cacheKeys.locations.all, "list"] as const,

      /**
       * Cache key for individual location detail
       * @param id - Location ID
       */
      detail: (id: number | string) =>
         [...cacheKeys.locations.all, "detail", String(id)] as const,
   },

   generations: {
      /** Base key for all generation-related queries */
      all: ["generations", CACHE_CONFIG.VERSION] as const,

      /** Cache key for generations list */
      list: () => [...cacheKeys.generations.all, "list"] as const,

      /**
       * Cache key for individual generation detail
       * @param id - Generation ID
       */
      detail: (id: number | string) =>
         [...cacheKeys.generations.all, "detail", String(id)] as const,
   },
} as const;

/**
 * Utility functions for common cache operations
 * Provides a convenient API for cache management throughout the application
 */
export const cacheUtils = {
   /**
    * Invalidate all Pokemon-related queries
    * Useful when Pokemon data structure changes globally
    */
   invalidatePokemon: () =>
      queryClient.invalidateQueries({ queryKey: cacheKeys.pokemon.all }),

   /**
    * Invalidate specific Pokemon detail cache
    * @param id - Pokemon ID to invalidate
    */
   invalidatePokemonDetail: (id: number | string) =>
      queryClient.invalidateQueries({ queryKey: cacheKeys.pokemon.detail(id) }),

   /**
    * Prefetch Pokemon detail data
    * @param id - Pokemon ID to prefetch
    * @param staleTime - Optional custom stale time for prefetched data (default: 15 minutes)
    */
   prefetchPokemonDetail: (id: number | string, staleTime = 15 * 60 * 1000) =>
      queryClient.prefetchQuery({
         queryKey: cacheKeys.pokemon.detail(id),
         staleTime,
      }),

   /**
    * Clear all cached data
    * Use with caution - removes all queries and mutations from cache
    */
   clearAll: () => queryClient.clear(),

   /**
    * Get cached Pokemon data without triggering a fetch
    * @param id - Pokemon ID
    * @returns Cached Pokemon data or undefined
    */
   getCachedPokemon: <T = any>(id: number | string): T | undefined =>
      queryClient.getQueryData(cacheKeys.pokemon.detail(id)),

   /**
    * Manually set Pokemon data in cache
    * @param id - Pokemon ID
    * @param data - Pokemon data to cache
    */
   setCachedPokemon: <T = any>(id: number | string, data: T) =>
      queryClient.setQueryData(cacheKeys.pokemon.detail(id), data),

   /**
    * Remove all Pokemon-related queries from cache
    * Less aggressive than clearAll, only affects Pokemon data
    */
   removePokemonQueries: () =>
      queryClient.removeQueries({ queryKey: cacheKeys.pokemon.all }),

   /**
    * Get current cache statistics
    * @returns Object with query and mutation counts
    */
   getCacheStats: () => ({
      queryCount: queryClient.getQueryCache().getAll().length,
      mutationCount: queryClient.getMutationCache().getAll().length,
      totalMemoryUsage: queryClient
         .getQueryCache()
         .getAll()
         .reduce((total, query) => {
            const dataSize = JSON.stringify(query.state.data || {}).length;
            return total + dataSize;
         }, 0),
   }),

   /**
    * Check if data exists in cache for a specific Pokemon
    * @param id - Pokemon ID to check
    * @returns boolean indicating if data is cached
    */
   hasCachedPokemon: (id: number | string): boolean => {
      const data = queryClient.getQueryData(cacheKeys.pokemon.detail(id));
      return data !== undefined;
   },

   /**
    * Get cache age for a specific query
    * @param queryKey - Query key to check
    * @returns Age in milliseconds or null if not found
    */
   getCacheAge: (queryKey: readonly unknown[]): number | null => {
      const query = queryClient.getQueryCache().find({ queryKey });
      return query?.state.dataUpdatedAt
         ? Date.now() - query.state.dataUpdatedAt
         : null;
   },

   /**
    * Check if cached data is stale
    * @param queryKey - Query key to check
    * @param staleTime - Custom stale time in milliseconds
    * @returns boolean indicating if data is stale
    */
   isCacheStale: (
      queryKey: readonly unknown[],
      staleTime = CACHE_CONFIG.STALE_TIME.MEDIUM
   ): boolean => {
      const age = cacheUtils.getCacheAge(queryKey);
      return age === null || age > staleTime;
   },

   /**
    * Batch invalidate multiple query patterns
    * @param patterns - Array of query key patterns to invalidate
    */
   batchInvalidate: (patterns: readonly unknown[][]) => {
      patterns.forEach((pattern) => {
         queryClient.invalidateQueries({ queryKey: pattern });
      });
   },
};

export { queryClient };

// Export types for use in other files
export type { PokemonFilters, SearchOptions, APIError };
