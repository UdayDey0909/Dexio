// src/Services/PokiAPI/Endpoints/Common.ts
import { httpClient } from "../Client/HTTP";
import { APIError, PokemonFilters, SearchOptions } from "../Client/Types";
import { NamedAPIResourceList, PaginatedResults } from "../Model/Common";

/**
 * Base endpoint class with common functionality
 */
export abstract class BaseEndpoint {
   protected readonly client = httpClient;

   /**
    * Generic method to fetch a single resource by ID or name
    */
   protected async fetchResource<T>(
      endpoint: string,
      id: number | string
   ): Promise<T> {
      try {
         const response = await this.client.axios.get<T>(`${endpoint}/${id}`);
         return response.data;
      } catch (error) {
         throw this.handleError(error);
      }
   }

   /**
    * Generic method to fetch a list of resources with pagination
    */
   protected async fetchResourceList<T>(
      endpoint: string,
      params?: { limit?: number; offset?: number }
   ): Promise<NamedAPIResourceList> {
      try {
         const response = await this.client.axios.get<NamedAPIResourceList>(
            endpoint,
            {
               params,
            }
         );
         return response.data;
      } catch (error) {
         throw this.handleError(error);
      }
   }

   /**
    * Generic method to fetch paginated results with filtering
    */
   protected async fetchPaginatedResults<T>(
      endpoint: string,
      filters?: PokemonFilters
   ): Promise<PaginatedResults<T>> {
      try {
         const params = this.buildQueryParams(filters);
         const response = await this.client.axios.get<PaginatedResults<T>>(
            endpoint,
            {
               params,
            }
         );
         return response.data;
      } catch (error) {
         throw this.handleError(error);
      }
   }

   /**
    * Build query parameters from filters
    */
   protected buildQueryParams(
      filters?: PokemonFilters | SearchOptions
   ): Record<string, any> {
      const params: Record<string, any> = {};

      if (!filters) return params;

      // Handle common pagination parameters
      if ("limit" in filters && filters.limit !== undefined) {
         params.limit = filters.limit;
      }
      if ("offset" in filters && filters.offset !== undefined) {
         params.offset = filters.offset;
      }

      // Handle Pokemon-specific filters
      if ("type" in filters && filters.type) {
         params.type = filters.type;
      }
      if ("generation" in filters && filters.generation) {
         params.generation = filters.generation;
      }

      // Handle search query
      if ("query" in filters && filters.query) {
         params.q = filters.query;
      }

      return params;
   }

   /**
    * Standardized error handling
    */
   protected handleError(error: any): APIError {
      if (error.code && error.message && typeof error.retryable === "boolean") {
         return error as APIError;
      }

      return {
         code: error.response?.status?.toString() || "NETWORK_ERROR",
         message: error.message || "An unexpected error occurred",
         details: error.response?.data?.message,
         retryable: error.response?.status >= 500 || !error.response,
      };
   }

   /**
    * Extract ID from URL (useful for converting NamedAPIResource to ID)
    */
   protected extractIdFromUrl(url: string): number {
      const matches = url.match(/\/(\d+)\/$/);
      return matches ? parseInt(matches[1], 10) : 0;
   }

   /**
    * Build full URL for nested resources
    */
   protected buildNestedUrl(
      baseEndpoint: string,
      id: number | string,
      nestedEndpoint: string
   ): string {
      return `${baseEndpoint}/${id}/${nestedEndpoint}`;
   }
}
