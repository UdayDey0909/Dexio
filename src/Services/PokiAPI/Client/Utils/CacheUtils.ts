import { CACHE_CONFIG, cacheKeys, queryClient } from "../Cache";

/**
 * Cache utility functions for working with React Query
 */
export const cacheUtils = {
   /**
    * Invalidate all cached Pokémon queries
    */
   invalidatePokemon: () =>
      queryClient.invalidateQueries({ queryKey: cacheKeys.pokemon.all }),

   /**
    * Invalidate cache for a specific Pokémon detail
    * @param id - Pokémon ID or name
    */
   invalidatePokemonDetail: (id: number | string) =>
      queryClient.invalidateQueries({ queryKey: cacheKeys.pokemon.detail(id) }),

   /**
    * Prefetch Pokémon detail and store in cache
    * @param id - Pokémon ID or name
    */
   prefetchPokemonDetail: (id: number | string) =>
      queryClient.prefetchQuery({
         queryKey: cacheKeys.pokemon.detail(id),
         staleTime: CACHE_CONFIG.STALE_TIME.LONG,
      }),

   /**
    * Get cached Pokémon data if present
    * @param id - Pokémon ID or name
    * @returns Cached data or undefined
    */
   getCachedPokemon: <T = any>(id: number | string): T | undefined =>
      queryClient.getQueryData(cacheKeys.pokemon.detail(id)),

   /**
    * Set Pokémon data into cache
    * @param id - Pokémon ID or name
    * @param data - Pokémon data
    */
   setCachedPokemon: <T = any>(id: number | string, data: T) =>
      queryClient.setQueryData(cacheKeys.pokemon.detail(id), data),

   /**
    * Clear all cached queries and mutations
    */
   clearAll: () => queryClient.clear(),

   /**
    * Get summary of current query and mutation cache
    * @returns Object containing counts
    */
   getCacheStats: () => ({
      queryCount: queryClient.getQueryCache().getAll().length,
      mutationCount: queryClient.getMutationCache().getAll().length,
   }),

   /**
    * Get cache statistics with memory usage
    */
   getStats: () => ({
      queryCount: queryClient.getQueryCache().getAll().length,
      mutationCount: queryClient.getMutationCache().getAll().length,
      memoryUsage: queryClient
         .getQueryCache()
         .getAll()
         .reduce((acc, query) => {
            return acc + (JSON.stringify(query.state.data || {}).length || 0);
         }, 0),
   }),

   /**
    * Clear stale queries
    */
   clearStale: () => {
      queryClient
         .getQueryCache()
         .getAll()
         .forEach((query) => {
            if (query.isStale()) {
               queryClient.removeQueries({ queryKey: query.queryKey });
            }
         });
   },

   /**
    * Preload critical data
    */
   preloadCritical: async () => {
      const criticalQueries = [
         {
            queryKey: cacheKeys.types.list(),
            staleTime: CACHE_CONFIG.STALE_TIME.EXTRA_LONG,
         },
         {
            queryKey: cacheKeys.generations.list(),
            staleTime: CACHE_CONFIG.STALE_TIME.EXTRA_LONG,
         },
      ];

      await Promise.allSettled(
         criticalQueries.map((query) => queryClient.prefetchQuery(query))
      );
   },

   /**
    * Export cache data for debugging
    */
   exportData: () => {
      const queries = queryClient.getQueryCache().getAll();
      return queries.map((query) => ({
         queryKey: query.queryKey,
         state: query.state.status,
         dataSize: JSON.stringify(query.state.data || {}).length,
         lastUpdated: query.state.dataUpdatedAt,
         isStale: query.isStale(),
      }));
   },
};
