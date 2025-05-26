import { QueryClient } from "@tanstack/react-query";
import { APIError, SearchOptions, PokemonFilters } from "./Types";

/**
 * Configuration constants for cache and stale times
 */
export const CACHE_CONFIG = {
   VERSION: "v1.1", // Incremented for new structure
   STALE_TIME: {
      SHORT: 5 * 60 * 1000, // 5 minutes
      MEDIUM: 15 * 60 * 1000, // 15 minutes
      LONG: 30 * 60 * 1000, // 30 minutes
      EXTRA_LONG: 60 * 60 * 1000, // 1 hour
   },
   CACHE_TIME: {
      SHORT: 10 * 60 * 1000, // 10 minutes
      MEDIUM: 30 * 60 * 1000, // 30 minutes
      LONG: 60 * 60 * 1000, // 1 hour
      EXTRA_LONG: 2 * 60 * 60 * 1000, // 2 hours
   },
   RETRY: {
      MAX_ATTEMPTS: 3,
      DELAY_BASE: 1000,
      DELAY_MAX: 30000,
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

   /**
    * Generates default pagination options
    * @param overrides - Optional override values
    * @returns Complete pagination options
    */
   pagination: (overrides: { limit?: number; offset?: number } = {}) => {
      const baseOptions = {
         limit: 20,
         offset: 0,
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

   /**
    * Generate infinite query key
    */
   infinite(filters?: any) {
      const key = [...this.base, "infinite"] as const;
      return filters ? ([...key, stableStringify(filters)] as const) : key;
   }
}

/**
 * Standard resource cache key configuration
 */
interface StandardResourceKeys {
   all: readonly string[];
   list: () => readonly string[];
   details: () => readonly string[];
   detail: (id: number | string) => readonly string[];
}

/**
 * Extended resource cache key configuration with filtering
 */
interface FilteredResourceKeys extends StandardResourceKeys {
   lists: () => readonly string[];
   infinite: (filters?: any) => readonly string[];
}

/**
 * Factory method to create standard resource cache keys
 */
const makeResourceKeys = (name: string): StandardResourceKeys => {
   const builder = new CacheKeyBuilder(name, CACHE_CONFIG.VERSION);
   return {
      all: builder.base,
      list: () => builder.list(),
      details: () => builder.details(),
      detail: (id: number | string) => builder.detail(id),
   };
};

/**
 * Factory method to create resource keys with filters support
 */
const makeFilteredResourceKeys = (
   name: string,
   filterFn?: (filters?: any) => any
): FilteredResourceKeys => {
   const builder = new CacheKeyBuilder(name, CACHE_CONFIG.VERSION);
   return {
      all: builder.base,
      lists: () => builder.lists(),
      list: (filters?: any) =>
         builder.list(filterFn ? filterFn(filters) : filters),
      details: () => builder.details(),
      detail: (id: number | string) => builder.detail(id),
      infinite: (filters?: any) => builder.infinite(filters),
   };
};

/**
 * Pokemon-specific cache keys with advanced functionality
 */
const createPokemonKeys = () => {
   const builder = new CacheKeyBuilder("pokemon", CACHE_CONFIG.VERSION);
   return {
      ...makeFilteredResourceKeys("pokemon", defaultFilters.pokemon),
      // Pokemon-specific nested resources
      species: (id: number | string) => builder.nested("species", id),
      evolution: (id: number | string) => builder.nested("evolution", id),
      moves: (id: number | string) => builder.nested("moves", id),
      encounters: (id: number | string) => builder.nested("encounters", id),
      // Search functionality
      search: (
         query: string,
         options: Partial<Omit<SearchOptions, "query">> = {}
      ) => builder.search(query, options),
      // Favorites (client-side only)
      favorites: () => [...builder.base, "favorites"] as const,
      // Recently viewed
      recent: () => [...builder.base, "recent"] as const,
   };
};

/**
 * Comprehensive cache key factory with improved structure and extensibility
 */
export const cacheKeys = {
   // Pokemon keys (most complex resource)
   pokemon: createPokemonKeys(),

   // Core resource keys
   types: makeResourceKeys("types"),
   moves: makeResourceKeys("moves"),
   abilities: makeResourceKeys("abilities"),
   stats: makeResourceKeys("stats"),
   natures: makeResourceKeys("natures"),

   // Game-related resources
   generations: makeResourceKeys("generations"),
   regions: makeResourceKeys("regions"),
   versions: makeResourceKeys("versions"),
   versionGroups: makeResourceKeys("version-groups"),

   // Item-related resources
   items: makeResourceKeys("items"),
   itemCategories: makeResourceKeys("item-categories"),
   itemAttributes: makeResourceKeys("item-attributes"),
   itemPockets: makeResourceKeys("item-pockets"),

   // Location-related resources
   locations: makeResourceKeys("locations"),
   locationAreas: makeResourceKeys("location-areas"),

   // Berry-related resources
   berries: makeResourceKeys("berries"),
   berryFlavors: makeResourceKeys("berry-flavors"),
   berryFirmness: makeResourceKeys("berry-firmness"),

   // Contest-related resources
   contestTypes: makeResourceKeys("contest-types"),
   contestEffects: makeResourceKeys("contest-effects"),
   superContestEffects: makeResourceKeys("super-contest-effects"),

   // Battle-related resources
   encounterMethods: makeResourceKeys("encounter-methods"),
   encounterConditions: makeResourceKeys("encounter-conditions"),
   encounterConditionValues: makeResourceKeys("encounter-condition-values"),

   // Evolution-related resources
   evolutionChains: makeResourceKeys("evolution-chains"),
   evolutionTriggers: makeResourceKeys("evolution-triggers"),

   // Growth and characteristics
   growthRates: makeResourceKeys("growth-rates"),
   pokeathlonStats: makeResourceKeys("pokeathlon-stats"),
   characteristics: makeResourceKeys("characteristics"),

   // Machines and learning
   machines: makeResourceKeys("machines"),
   moveDamageClasses: makeResourceKeys("move-damage-classes"),
   moveTargets: makeResourceKeys("move-targets"),
   moveCategories: makeResourceKeys("move-categories"),
   moveAilments: makeResourceKeys("move-ailments"),
   moveBattleStyles: makeResourceKeys("move-battle-styles"),
   moveLearnMethods: makeResourceKeys("move-learn-methods"),

   // Languages and common resources
   languages: makeResourceKeys("languages"),

   // Global cache operations
   global: {
      all: ["global", CACHE_CONFIG.VERSION] as const,
      user: ["global", CACHE_CONFIG.VERSION, "user"] as const,
      preferences: ["global", CACHE_CONFIG.VERSION, "preferences"] as const,
      session: ["global", CACHE_CONFIG.VERSION, "session"] as const,
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
 * Enhanced retry logic for different error types
 */
const createRetryFn = () => {
   return (failureCount: number, error: unknown) => {
      // Handle APIError type
      if (isAPIError(error)) {
         const statusCode = parseInt(error.code);

         // Don't retry client errors (4xx)
         if (statusCode >= 400 && statusCode < 500) {
            return false;
         }

         // Respect retryable flag
         if (error.retryable === false) {
            return false;
         }
      }

      // Handle standard HTTP errors
      if (error instanceof Error && "status" in error) {
         const status = (error as any).status;
         if (typeof status === "number" && status >= 400 && status < 500) {
            return false;
         }
      }

      // Retry up to max attempts for server errors and network issues
      return failureCount < CACHE_CONFIG.RETRY.MAX_ATTEMPTS;
   };
};

/**
 * Enhanced retry delay with exponential backoff and jitter
 */
const createRetryDelay = () => {
   return (attemptIndex: number) => {
      const baseDelay =
         CACHE_CONFIG.RETRY.DELAY_BASE * Math.pow(2, attemptIndex);
      const jitter = Math.random() * 0.1 * baseDelay; // Add 10% jitter
      return Math.min(baseDelay + jitter, CACHE_CONFIG.RETRY.DELAY_MAX);
   };
};

/**
 * React Query client with enhanced global configuration
 */
export const queryClient = new QueryClient({
   defaultOptions: {
      queries: {
         staleTime: CACHE_CONFIG.STALE_TIME.MEDIUM,
         gcTime: CACHE_CONFIG.CACHE_TIME.LONG, // Updated from cacheTime
         retry: createRetryFn(),
         retryDelay: createRetryDelay(),
         refetchOnWindowFocus: false,
         refetchOnReconnect: true,
         refetchOnMount: false,
         networkMode: "online",
         // Enhanced error handling
         throwOnError: false,
         // Improved staleness detection
         refetchInterval: false,
         refetchIntervalInBackground: false,
         // Optimistic updates support
         notifyOnChangeProps: "all",
      },
      mutations: {
         retry: 1,
         networkMode: "online",
         // Enhanced mutation error handling
         throwOnError: false,
         // Mutation timeout
         gcTime: CACHE_CONFIG.CACHE_TIME.SHORT,
      },
   },
   // Global error handler
   mutationCache: undefined,
   queryCache: undefined,
});
