/**
 * API Error Structure
 */
export interface APIError {
   code: string;
   message: string;
   retryable: boolean;
}

/**
 * HTTP Client Configuration
 */
export interface HTTPConfig {
   timeout?: number;
   enableLogging?: boolean;
}

/**
 * Base Filter Interface
 */
interface BaseFilter {
   limit?: number;
   offset?: number;
}

/**
 * Pokemon Query Filters
 */
export interface PokemonFilter extends BaseFilter {
   type?: string;
   generation?: number;
   habitat?: string;
   color?: string;
   shape?: string;
}

/**
 * Move Query Filters
 */
export interface MoveFilter extends BaseFilter {
   type?: string;
   damageClass?: string;
   category?: string;
   minPower?: number;
   maxPower?: number;
}

/**
 * Item Query Filters
 */
export interface ItemFilter extends BaseFilter {
   category?: string;
   pocket?: string;
}

/**
 * Location Query Filters
 */
export interface LocationFilter extends BaseFilter {
   region?: string;
}

/**
 * Search Configuration
 */
export interface SearchConfig {
   query: string;
   limit?: number;
   fuzzy?: boolean;
   caseSensitive?: boolean;
}

/**
 * User Preferences
 */
export interface UserPreferences {
   theme: "light" | "dark" | "auto";
   language: string;
   favorites: number[];
   recentlyViewed: number[];
   maxRecentItems: number;
}

/**
 * Cache Configuration
 */
export interface CacheConfig {
   ttl?: number; // Time to live in milliseconds
   maxItems?: number;
   enablePersistence?: boolean;
}

/**
 * Pagination Response
 */
export interface PaginatedResponse<T> {
   data: T[];
   total: number;
   hasMore: boolean;
   nextOffset?: number;
}

/**
 * Service Response Envelope
 */
export interface ServiceResponse<T> {
   data: T;
   cached: boolean;
   timestamp: number;
}

/**
 * Default Configurations
 */
export const DEFAULT_PREFERENCES: UserPreferences = {
   theme: "auto",
   language: "en",
   favorites: [],
   recentlyViewed: [],
   maxRecentItems: 50,
};

export const DEFAULT_HTTP_CONFIG: HTTPConfig = {
   timeout: 10000,
   enableLogging: __DEV__,
};

export const DEFAULT_CACHE_CONFIG: CacheConfig = {
   ttl: 5 * 60 * 1000, // 5 minutes
   maxItems: 1000,
   enablePersistence: true,
};

export const DEFAULT_SEARCH_CONFIG: Partial<SearchConfig> = {
   limit: 20,
   fuzzy: true,
   caseSensitive: false,
};

/**
 * Type Guards
 */
export const isAPIError = (error: unknown): error is APIError => {
   return (
      typeof error === "object" &&
      error !== null &&
      "code" in error &&
      "message" in error &&
      "retryable" in error
   );
};

export const isPaginatedResponse = <T>(
   response: unknown
): response is PaginatedResponse<T> => {
   return (
      typeof response === "object" &&
      response !== null &&
      "data" in response &&
      "total" in response &&
      "hasMore" in response &&
      Array.isArray((response as any).data)
   );
};

/**
 * Error Factory
 */
export const createAPIError = (
   code: string,
   message: string,
   retryable = false
): APIError => ({
   code,
   message,
   retryable,
});

/**
 * Common Error Codes
 */
export const ERROR_CODES = {
   NETWORK_ERROR: "NETWORK_ERROR",
   NOT_FOUND: "NOT_FOUND",
   TIMEOUT: "TIMEOUT",
   RATE_LIMITED: "RATE_LIMITED",
   SERVER_ERROR: "SERVER_ERROR",
   CACHE_ERROR: "CACHE_ERROR",
   VALIDATION_ERROR: "VALIDATION_ERROR",
   UNKNOWN_ERROR: "UNKNOWN_ERROR",
} as const;

export type ErrorCode = keyof typeof ERROR_CODES;

/**
 * HTTP Status Mappings
 */
export const HTTP_STATUS = {
   OK: 200,
   NOT_FOUND: 404,
   RATE_LIMITED: 429,
   SERVER_ERROR: 500,
} as const;
