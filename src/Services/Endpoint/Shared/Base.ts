import { httpClient } from "../../Client/HTTP";
import { APIError } from "../../Shared/Types";
import { AxiosResponse } from "axios";

// Configuration constants
export const DEFAULT_PAGINATION = {
   offset: 0,
   limit: 20,
} as const;

export const DEFAULT_SEARCH_LIMIT = 10;

// Type definitions for better type safety
interface NamedAPIResource {
   name: string;
   url: string;
}

interface PaginationOptions {
   offset?: number;
   limit?: number;
}

/**
 * Base endpoint class with common functionality
 */
export abstract class BaseEndpoint {
   protected async handleRequest<T>(
      request: () => Promise<AxiosResponse<T> | T>,
      retries = 1
   ): Promise<T> {
      try {
         const response = await request();
         // Handle both axios responses and direct pokenode-ts responses
         return typeof response === "object" &&
            response !== null &&
            "data" in response
            ? (response as AxiosResponse<T>).data
            : response;
      } catch (error: any) {
         // Retry logic for server errors or network issues
         if (retries > 0 && this.shouldRetry(error)) {
            await this.delay(1000); // 1 second delay before retry
            return this.handleRequest(request, retries - 1);
         }
         throw this.formatError(error);
      }
   }

   private shouldRetry(error: any): boolean {
      return error.response?.status >= 500 || !error.response;
   }

   private delay(ms: number): Promise<void> {
      return new Promise((resolve) => setTimeout(resolve, ms));
   }

   private formatError(error: any): APIError {
      return {
         code: error.response?.status?.toString() || "NETWORK_ERROR",
         message: error.message || "An unexpected error occurred",
         details: error.response?.data?.message,
         retryable: this.shouldRetry(error),
      };
   }

   protected get client() {
      return httpClient.client;
   }

   protected get axios() {
      return httpClient.axios;
   }

   // Helper method for consistent pagination
   protected normalizePagination({
      offset = DEFAULT_PAGINATION.offset,
      limit = DEFAULT_PAGINATION.limit,
   }: PaginationOptions = {}): { offset: number; limit: number } {
      return { offset, limit };
   }
}
