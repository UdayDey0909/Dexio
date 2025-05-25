/**
 * Common API response interfaces shared across all endpoints
 */

/**
 * Standard PokeAPI resource reference
 */
export interface NamedAPIResource {
   name: string;
   url: string;
}

/**
 * Standard PokeAPI list response structure
 */
export interface APIListResponse<T = NamedAPIResource> {
   count: number;
   results: T[];
   next?: string | null;
   previous?: string | null;
}

/**
 * Common query hook options
 */
export interface QueryHookOptions {
   enabled?: boolean;
   staleTime?: number;
}

/**
 * Infinite query hook options
 */
export interface InfiniteQueryHookOptions extends QueryHookOptions {
   keepPreviousData?: boolean;
}

/**
 * Pagination parameters
 */
export interface PaginationParams {
   limit?: number;
   offset?: number;
}

/**
 * Search parameters
 */
export interface SearchParams {
   query: string;
   limit?: number;
}

/**
 * Utility function to validate IDs across all endpoints
 * @param id - The ID to validate
 * @param entityName - Name of the entity for error messages
 * @throws APIError if validation fails
 */
export const validateId = (id: any, entityName: string): void => {
   if (id === null || id === undefined || id === "") {
      throw {
         code: "INVALID_ID",
         message: `${entityName} ID is required and cannot be null, undefined, or empty`,
         retryable: false,
      };
   }
};

/**
 * Utility function to transform API list responses consistently
 * @param data - Raw API response data
 * @returns Normalized APIListResponse
 */
export const transformListResponse = <T = NamedAPIResource>(
   data: any
): APIListResponse<T> => {
   return {
      count: data.count || 0,
      results: data.results || [],
      next: data.next || null,
      previous: data.previous || null,
   };
};
