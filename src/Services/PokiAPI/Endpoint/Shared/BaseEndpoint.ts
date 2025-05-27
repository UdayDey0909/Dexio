import { httpClient } from "../../Client/HTTP";
import { CACHE_CONFIG } from "../../Client/Cache";
import { PaginatedResults } from "../../Interface/Common";
import { APIError, SearchOptions } from "../../Client/Types";

/**
 * Base endpoint configuration interface
 */
export interface EndpointConfig {
   baseUrl: string;
   resourceName: string;
   defaultLimit?: number;
   cacheTime?: {
      list: number;
      detail: number;
   };
}

/**
 * Standard filter options for list queries
 */
export interface BaseFilters {
   limit?: number;
   offset?: number;
}

/**
 * Generic list response wrapper
 */
export interface ListResponse<T> {
   count: number;
   next: string | null;
   previous: string | null;
   results: T[];
}

/**
 * Base endpoint class providing common CRUD operations
 */
export class BaseEndpoint<TDetail = any, TListItem = any> {
   protected config: EndpointConfig;
   protected cacheKeyFactory: any;

   constructor(config: EndpointConfig, cacheKeyFactory: any) {
      this.config = config;
      this.cacheKeyFactory = cacheKeyFactory;
   }

   /**
    * Get paginated list of resources
    * @param filters - Optional filters for the query
    * @returns Promise resolving to paginated results
    */
   async getList(filters: BaseFilters = {}): Promise<ListResponse<TListItem>> {
      try {
         const params = this.buildListParams(filters);
         const response = await httpClient.axios.get<ListResponse<TListItem>>(
            this.config.baseUrl,
            { params }
         );
         return response.data;
      } catch (error) {
         throw this.handleError(error);
      }
   }

   /**
    * Get resource by ID or name
    * @param id - Resource identifier (number or string)
    * @returns Promise resolving to resource detail
    */
   async getById(id: number | string): Promise<TDetail> {
      try {
         const response = await httpClient.axios.get<TDetail>(
            `${this.config.baseUrl}${id}/`
         );
         return response.data;
      } catch (error) {
         throw this.handleError(error);
      }
   }

   /**
    * Get multiple resources by IDs
    * @param ids - Array of resource identifiers
    * @returns Promise resolving to array of resources
    */
   async getByIds(ids: (number | string)[]): Promise<TDetail[]> {
      try {
         const promises = ids.map((id) => this.getById(id));
         return await Promise.all(promises);
      } catch (error) {
         throw this.handleError(error);
      }
   }

   /**
    * Search resources by name
    * @param options - Search options
    * @returns Promise resolving to filtered results
    */
   async search(options: SearchOptions): Promise<ListResponse<TListItem>> {
      try {
         // Get full list and filter client-side for basic search
         const allResults = await this.getList({
            limit: options.limit || 1000,
            offset: 0,
         });

         const filtered = allResults.results.filter((item: any) =>
            item.name.toLowerCase().includes(options.query.toLowerCase())
         );

         return {
            count: filtered.length,
            next: null,
            previous: null,
            results: filtered.slice(0, options.limit || 10),
         };
      } catch (error) {
         throw this.handleError(error);
      }
   }

   /**
    * Check if resource exists
    * @param id - Resource identifier
    * @returns Promise resolving to boolean
    */
   async exists(id: number | string): Promise<boolean> {
      try {
         await this.getById(id);
         return true;
      } catch (error) {
         return false;
      }
   }

   /**
    * Get resource count
    * @returns Promise resolving to total count
    */
   async getCount(): Promise<number> {
      try {
         const response = await this.getList({ limit: 1, offset: 0 });
         return response.count;
      } catch (error) {
         throw this.handleError(error);
      }
   }

   /**
    * Build query parameters for list requests
    * @param filters - Filter options
    * @returns Query parameters object
    */
   protected buildListParams(filters: BaseFilters): Record<string, any> {
      const params: Record<string, any> = {};

      if (filters.limit !== undefined) {
         params.limit = filters.limit;
      } else {
         params.limit = this.config.defaultLimit || 20;
      }

      if (filters.offset !== undefined) {
         params.offset = filters.offset;
      }

      return params;
   }

   /**
    * Handle and format API errors
    * @param error - Raw error object
    * @returns Formatted APIError
    */
   protected handleError(error: any): APIError {
      if (error.response) {
         return {
            code: error.response.status.toString(),
            message: error.response.data?.message || error.message,
            details: error.response.data?.detail,
            retryable: error.response.status >= 500,
         };
      }

      return {
         code: "NETWORK_ERROR",
         message: error.message || "Network error occurred",
         retryable: true,
      };
   }

   /**
    * Get cache configuration for this endpoint
    * @returns Cache configuration object
    */
   protected getCacheConfig() {
      return {
         list: this.config.cacheTime?.list || CACHE_CONFIG.STALE_TIME.MEDIUM,
         detail: this.config.cacheTime?.detail || CACHE_CONFIG.STALE_TIME.LONG,
      };
   }
}

/**
 * Utility functions for common endpoint operations
 */
export const endpointUtils = {
   /**
    * Extract ID from PokeAPI URL
    * @param url - PokeAPI resource URL
    * @returns Extracted ID or null
    */
   extractIdFromUrl: (url: string): number | null => {
      const matches = url.match(/\/(\d+)\/$/);
      return matches ? parseInt(matches[1], 10) : null;
   },

   /**
    * Build PokeAPI URL for resource
    * @param baseUrl - Base API URL
    * @param id - Resource ID
    * @returns Complete resource URL
    */
   buildResourceUrl: (baseUrl: string, id: number | string): string => {
      return `${baseUrl}${id}/`;
   },

   /**
    * Normalize resource name for API calls
    * @param name - Resource name
    * @returns Normalized name
    */
   normalizeName: (name: string): string => {
      return name.toLowerCase().replace(/\s+/g, "-");
   },

   /**
    * Parse pagination info from response
    * @param response - API response with pagination
    * @returns Pagination metadata
    */
   parsePagination: (response: PaginatedResults<any>) => ({
      currentPage: response.previous
         ? endpointUtils.extractIdFromUrl(response.previous) || 0
         : 0,
      hasNext: !!response.next,
      hasPrevious: !!response.previous,
      totalCount: response.count,
   }),

   /**
    * Calculate offset from page number
    * @param page - Page number (1-based)
    * @param limit - Items per page
    * @returns Offset value
    */
   calculateOffset: (page: number, limit: number): number => {
      return Math.max(0, (page - 1) * limit);
   },

   /**
    * Validate filter parameters
    * @param filters - Filter object
    * @returns Validation result
    */
   validateFilters: (
      filters: BaseFilters
   ): { valid: boolean; errors: string[] } => {
      const errors: string[] = [];

      if (filters.limit !== undefined) {
         if (filters.limit < 1 || filters.limit > 1000) {
            errors.push("Limit must be between 1 and 1000");
         }
      }

      if (filters.offset !== undefined) {
         if (filters.offset < 0) {
            errors.push("Offset must be non-negative");
         }
      }

      return {
         valid: errors.length === 0,
         errors,
      };
   },
};

/**
 * Common filter builder for different resource types
 */
export class FilterBuilder<T extends BaseFilters = BaseFilters> {
   private filters: Partial<T> = {};

   /**
    * Set limit for results
    * @param limit - Number of results to return
    * @returns FilterBuilder instance for chaining
    */
   limit(limit: number): this {
      this.filters.limit = limit;
      return this;
   }

   /**
    * Set offset for pagination
    * @param offset - Number of results to skip
    * @returns FilterBuilder instance for chaining
    */
   offset(offset: number): this {
      this.filters.offset = offset;
      return this;
   }

   /**
    * Set page number (converts to offset)
    * @param page - Page number (1-based)
    * @param pageSize - Items per page
    * @returns FilterBuilder instance for chaining
    */
   page(page: number, pageSize: number = 20): this {
      this.filters.offset = endpointUtils.calculateOffset(page, pageSize);
      this.filters.limit = pageSize;
      return this;
   }

   /**
    * Add custom filter
    * @param key - Filter key
    * @param value - Filter value
    * @returns FilterBuilder instance for chaining
    */
   custom<K extends keyof T>(key: K, value: T[K]): this {
      this.filters[key] = value;
      return this;
   }

   /**
    * Build final filter object
    * @returns Complete filter object
    */
   build(): T {
      return { ...this.filters } as T;
   }

   /**
    * Reset all filters
    * @returns FilterBuilder instance for chaining
    */
   reset(): this {
      this.filters = {};
      return this;
   }
}
