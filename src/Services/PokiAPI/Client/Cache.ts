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
 * Generic cache key builder for consistent key generation
 */
class CacheKeyBuilder {
   constructor(private baseKey: string, private version: string) {}

   /**
    * Generate base key with version
    */
   get base() {
      return [this.baseKey, this.version] as const;
   }

   /**
    * Generate list keys
    */
   lists() {
      return [...this.base, "list"] as const;
   }

   /**
    * Generate list key with filters
    */
   list(filters?: any) {
      const key = [...this.lists()] as const;
      return filters ? ([...key, stableStringify(filters)] as const) : key;
   }

   /**
    * Generate details base key
    */
   details() {
      return [...this.base, "detail"] as const;
   }

   /**
    * Generate detail key for specific item
    */
   detail(id: number | string) {
      return [...this.details(), String(id)] as const;
   }

   /**
    * Generate search base key
    */
   searches() {
      return [...this.base, "search"] as const;
   }

   /**
    * Generate search key with options
    */
   search(query: string, options: any = {}) {
      return [
         ...this.searches(),
         stableStringify(defaultFilters.search(query, options)),
      ] as const;
   }

   /**
    * Generate custom nested key
    */
   nested(type: string, id?: number | string) {
      const baseKey = [...this.base, type] as const;
      return id ? ([...baseKey, String(id)] as const) : baseKey;
   }
}

/**
 * Factory method to create standard resource cache keys
 */
const makeResourceKeys = (name: string) => {
   const builder = new CacheKeyBuilder(name, CACHE_CONFIG.VERSION);
   return {
      all: builder.base,
      list: () => builder.lists(),
      detail: (id: number | string) => builder.detail(id),
   };
};

/**
 * Factory method to create resource keys with filters support
 */
const makeFilteredResourceKeys = (
   name: string,
   filterFn?: (filters?: any) => any
) => {
   const builder = new CacheKeyBuilder(name, CACHE_CONFIG.VERSION);
   return {
      all: builder.base,
      lists: () => builder.lists(),
      list: (filters?: any) =>
         builder.list(filterFn ? filterFn(filters) : filters),
      details: () => builder.details(),
      detail: (id: number | string) => builder.detail(id),
   };
};

/**
 * Cache key factory with improved structure and extensibility
 */
export const cacheKeys = {
   // Pokemon keys (complex resource with custom methods)
   pokemon: (() => {
      const builder = new CacheKeyBuilder("pokemon", CACHE_CONFIG.VERSION);
      return {
         ...makeFilteredResourceKeys("pokemon", defaultFilters.pokemon),
         species: (id: number | string) => builder.nested("species", id),
         evolution: (id: number | string) => builder.nested("evolution", id),
         search: (
            query: string,
            options: Partial<Omit<SearchOptions, "query">> = {}
         ) => builder.search(query, options),
      };
   })(),

   // Simple resource keys using factory
   types: makeResourceKeys("types"),
   moves: makeResourceKeys("moves"),
   abilities: makeResourceKeys("abilities"),
   growthRates: makeResourceKeys("growth-rates"),
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
