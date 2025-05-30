import { QueryClient } from "@tanstack/react-query";
import { APIError, SearchOptions, PokemonFilters } from "./Types";

/**
 * Simplified cache configuration
 */
export const CACHE_CONFIG = {
   VERSION: "v1.2",
   STALE_TIME: 15 * 60 * 1000, // 15 minutes
   CACHE_TIME: 30 * 60 * 1000, // 30 minutes
   RETRY_COUNT: 2,
} as const;

/**
 * Simple cache key factory - no over-engineering
 */
export const cacheKeys = {
   pokemon: {
      all: ["pokemon", CACHE_CONFIG.VERSION] as const,
      list: (filters?: PokemonFilters) =>
         filters
            ? (["pokemon", CACHE_CONFIG.VERSION, "list", filters] as const)
            : (["pokemon", CACHE_CONFIG.VERSION, "list"] as const),
      detail: (id: number | string) =>
         ["pokemon", CACHE_CONFIG.VERSION, "detail", String(id)] as const,
      search: (query: string, limit?: number) =>
         [
            "pokemon",
            CACHE_CONFIG.VERSION,
            "search",
            query,
            limit || 10,
         ] as const,
   },

   // Basic resource keys
   types: {
      all: ["types", CACHE_CONFIG.VERSION] as const,
      list: () => ["types", CACHE_CONFIG.VERSION, "list"] as const,
      detail: (id: number | string) =>
         ["types", CACHE_CONFIG.VERSION, "detail", String(id)] as const,
   },

   moves: {
      all: ["moves", CACHE_CONFIG.VERSION] as const,
      list: () => ["moves", CACHE_CONFIG.VERSION, "list"] as const,
      detail: (id: number | string) =>
         ["moves", CACHE_CONFIG.VERSION, "detail", String(id)] as const,
   },

   // User preferences
   preferences: ["preferences", CACHE_CONFIG.VERSION] as const,
} as const;

/**
 * Simple error type guard
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
 * Simple retry function - no complex logic needed
 */
const shouldRetry = (failureCount: number, error: unknown) => {
   // Don't retry client errors (4xx)
   if (isAPIError(error)) {
      const statusCode = parseInt(error.code);
      if (statusCode >= 400 && statusCode < 500) {
         return false;
      }
   }

   // Retry up to max attempts for server errors
   return failureCount < CACHE_CONFIG.RETRY_COUNT;
};

/**
 * React Query client with essential configuration only
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
 * Essential cache utilities - removed over-engineering
 */
export const cacheUtils = {
   /**
    * Invalidate all Pokemon queries
    */
   invalidatePokemon: () =>
      queryClient.invalidateQueries({ queryKey: cacheKeys.pokemon.all }),

   /**
    * Invalidate specific Pokemon
    */
   invalidatePokemonDetail: (id: number | string) =>
      queryClient.invalidateQueries({ queryKey: cacheKeys.pokemon.detail(id) }),

   /**
    * Get cached Pokemon data
    */
   getCachedPokemon: <T = any>(id: number | string): T | undefined =>
      queryClient.getQueryData(cacheKeys.pokemon.detail(id)),

   /**
    * Set Pokemon data in cache
    */
   setCachedPokemon: <T = any>(id: number | string, data: T) =>
      queryClient.setQueryData(cacheKeys.pokemon.detail(id), data),

   /**
    * Clear all cache
    */
   clearAll: () => queryClient.clear(),

   /**
    * Basic cache stats
    */
   getCacheStats: () => ({
      queryCount: queryClient.getQueryCache().getAll().length,
      mutationCount: queryClient.getMutationCache().getAll().length,
   }),

   /**
    * Prefetch common data (optional performance boost)
    */
   prefetchCommon: async () => {
      try {
         await queryClient.prefetchQuery({
            queryKey: cacheKeys.types.list(),
         });
      } catch (error) {
         console.warn("Failed to prefetch common data:", error);
      }
   },
};
