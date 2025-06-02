export interface PaginationParams {
   offset?: number;
   limit?: number;
}

export interface PaginatedResponse<T> {
   count: number;
   next: string | null;
   previous: string | null;
   results: T[];
}

export interface CacheOptions {
   ttl?: number;
   maxItems?: number;
}

export interface ServiceConfig {
   maxRetries?: number;
   retryDelay?: number;
   cacheTimeout?: number;
}

export interface BatchOperationOptions {
   concurrency?: number;
   onProgress?: (completed: number, total: number) => void;
   stopOnError?: boolean;
}

export interface ServiceHealth {
   isHealthy: boolean;
   networkStatus: boolean;
   lastCheck: string;
   cacheInfo: {
      ttl: number;
      maxItems: number;
   };
   retryConfig: {
      attempts: number;
      delay: number;
   };
}

export interface CacheInfo {
   ttl: string;
   ttlMinutes: number;
   ttlMs: number;
   maxItems?: number;
}

export interface APIError extends Error {
   status?: number;
   code?: string;
   details?: any;
}

export interface BatchResult<T> {
   success: T[];
   errors: Array<{
      index: number;
      error: Error;
      item: any;
   }>;
}
