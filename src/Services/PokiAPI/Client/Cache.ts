// src/services/pokemon-api/client/cache.ts
import { QueryClient } from "@tanstack/react-query";

interface APIError {
   code: string;
   message: string;
   details?: string;
   retryable: boolean;
}

export interface PokemonFilters {
   type?: string;
   generation?: number;
   limit?: number;
   offset?: number;
}

export interface SearchOptions {
   query: string;
   limit?: number;
}

export const CACHE_CONFIG = {
   VERSION: "v1",
   STALE_TIME: {
      SHORT: 5 * 60 * 1000, // 5 minutes
      MEDIUM: 15 * 60 * 1000, // 15 minutes
      LONG: 30 * 60 * 1000, // 30 minutes
   },
   CACHE_TIME: {
      SHORT: 10 * 60 * 1000, // 10 minutes
      MEDIUM: 30 * 60 * 1000, // 30 minutes
      LONG: 60 * 60 * 1000, // 1 hour
   },
} as const;

// Utility for creating stable cache keys
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

const stableStringify = (obj: any): string => {
   if (!obj || typeof obj !== "object") return String(obj);
   return JSON.stringify(normalizeObject(obj));
};

// Default filter factories
export const defaultFilters = {
   pokemon: (overrides: Partial<PokemonFilters> = {}): PokemonFilters => {
      const baseFilters: PokemonFilters = {
         limit: 20,
         offset: 0,
         type: undefined,
         generation: undefined,
      };
      return normalizeObject({ ...baseFilters, ...overrides });
   },

   search: (
      query: string,
      overrides: Partial<Omit<SearchOptions, "query">> = {}
   ): SearchOptions => {
      const baseOptions: SearchOptions = {
         query: query.trim().toLowerCase(),
         limit: 10,
      };
      return normalizeObject({ ...baseOptions, ...overrides });
   },
};

// Cache key factory
export const cacheKeys = {
   pokemon: {
      all: ["pokemon", CACHE_CONFIG.VERSION] as const,
      lists: () => [...cacheKeys.pokemon.all, "list"] as const,
      list: (filters: PokemonFilters = {}) =>
         [
            ...cacheKeys.pokemon.lists(),
            stableStringify(defaultFilters.pokemon(filters)),
         ] as const,
      details: () => [...cacheKeys.pokemon.all, "detail"] as const,
      detail: (id: number | string) =>
         [...cacheKeys.pokemon.details(), String(id)] as const,
      species: (id: number | string) =>
         [...cacheKeys.pokemon.all, "species", String(id)] as const,
      evolution: (id: number | string) =>
         [...cacheKeys.pokemon.all, "evolution", String(id)] as const,
      search: (
         query: string,
         options: Partial<Omit<SearchOptions, "query">> = {}
      ) =>
         [
            ...cacheKeys.pokemon.all,
            "search",
            stableStringify(defaultFilters.search(query, options)),
         ] as const,
   },

   types: {
      all: ["types", CACHE_CONFIG.VERSION] as const,
      list: () => [...cacheKeys.types.all, "list"] as const,
      detail: (id: number | string) =>
         [...cacheKeys.types.all, "detail", String(id)] as const,
   },

   moves: {
      all: ["moves", CACHE_CONFIG.VERSION] as const,
      list: () => [...cacheKeys.moves.all, "list"] as const,
      detail: (id: number | string) =>
         [...cacheKeys.moves.all, "detail", String(id)] as const,
   },

   abilities: {
      all: ["abilities", CACHE_CONFIG.VERSION] as const,
      list: () => [...cacheKeys.abilities.all, "list"] as const,
      detail: (id: number | string) =>
         [...cacheKeys.abilities.all, "detail", String(id)] as const,
   },
} as const;

// Query client configuration
export const queryClient = new QueryClient({
   defaultOptions: {
      queries: {
         staleTime: CACHE_CONFIG.STALE_TIME.MEDIUM,
         retry: (failureCount, error: APIError) => {
            if (
               error?.code &&
               parseInt(error.code) >= 400 &&
               parseInt(error.code) < 500
            ) {
               return false;
            }
            return failureCount < 3;
         },
         retryDelay: (attemptIndex) =>
            Math.min(1000 * 2 ** attemptIndex, 30000),
         refetchOnWindowFocus: false,
         refetchOnReconnect: true,
         refetchOnMount: false,
         networkMode: "online",
      },
      mutations: {
         retry: 1,
         networkMode: "online",
      },
   },
});

// Cache utilities
export const cacheUtils = {
   invalidatePokemon: () =>
      queryClient.invalidateQueries({ queryKey: cacheKeys.pokemon.all }),

   invalidatePokemonDetail: (id: number | string) =>
      queryClient.invalidateQueries({ queryKey: cacheKeys.pokemon.detail(id) }),

   prefetchPokemonDetail: (id: number | string) =>
      queryClient.prefetchQuery({
         queryKey: cacheKeys.pokemon.detail(id),
         staleTime: CACHE_CONFIG.STALE_TIME.LONG,
      }),

   getCachedPokemon: <T = any>(id: number | string): T | undefined =>
      queryClient.getQueryData(cacheKeys.pokemon.detail(id)),

   setCachedPokemon: <T = any>(id: number | string, data: T) =>
      queryClient.setQueryData(cacheKeys.pokemon.detail(id), data),

   clearAll: () => queryClient.clear(),

   getCacheStats: () => ({
      queryCount: queryClient.getQueryCache().getAll().length,
      mutationCount: queryClient.getMutationCache().getAll().length,
   }),
};
