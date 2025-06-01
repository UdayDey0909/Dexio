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
   rateLimit?: number;
   cacheOptions?: CacheOptions;
   retryAttempts?: number;
   retryDelay?: number;
}

export interface BatchOperationOptions {
   concurrency?: number;
   onProgress?: (completed: number, total: number) => void;
   stopOnError?: boolean;
}

export interface ServiceHealth {
   isHealthy: boolean;
   requestCount: number;
   lastRequestTime: number;
   rateLimit: number;
   cacheInfo: {
      ttl: string;
      maxItems: number;
   };
   retryConfig: {
      attempts: number;
      delay: number;
   };
}
