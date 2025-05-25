import { QueryClient } from "@tanstack/react-query";
import { APIError, SearchOptions, PokemonFilters } from "./Types";

/**
 * Configuration constants for cache and stale times
 */
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

/**
 * Normalize object keys to ensure consistent cache keys
 * @param obj - Object to normalize
 * @returns Normalized object with sorted keys
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
 * Stable stringify for objects to use in cache keys
 * @param obj - Any object
 * @returns A stable, stringified representation
 */
const stableStringify = (obj: any): string => {
   if (!obj || typeof obj !== "object") return String(obj);
   return JSON.stringify(normalizeObject(obj));
};

/**
 * Default filters generator for common queries
 */
export const defaultFilters = {
   /**
    * Generates default Pokémon list filters
    * @param overrides - Optional override values
    * @returns Complete filter object
    */
   pokemon: (overrides: Partial<PokemonFilters> = {}): PokemonFilters => {
      const baseFilters: PokemonFilters = {
         limit: 20,
         offset: 0,
         type: undefined,
         generation: undefined,
      };
      return normalizeObject({ ...baseFilters, ...overrides });
   },

   /**
    * Generates default search options for queries
    * @param query - Search string
    * @param overrides - Optional override values
    * @returns Complete search options
    */
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

/**
 * Cache key factory for React Query keys
 */
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

/**
 * Type guard to check if an error is an APIError
 * @param error - Unknown error object
 * @returns Boolean indicating if error matches APIError
 */
const isAPIError = (error: unknown): error is APIError => {
   return (
      typeof error === "object" &&
      error !== null &&
      "code" in error &&
      "message" in error &&
      "retryable" in error
   );
};

/**
 * React Query client with global configuration
 */
export const queryClient = new QueryClient({
   defaultOptions: {
      queries: {
         staleTime: CACHE_CONFIG.STALE_TIME.MEDIUM,
         retry: (failureCount, error) => {
            if (isAPIError(error)) {
               const statusCode = parseInt(error.code);
               if (statusCode >= 400 && statusCode < 500) {
                  return false;
               }
               if (error.retryable === false) {
                  return false;
               }
            }
            if (error instanceof Error && "status" in error) {
               const status = (error as any).status;
               if (
                  typeof status === "number" &&
                  status >= 400 &&
                  status < 500
               ) {
                  return false;
               }
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
