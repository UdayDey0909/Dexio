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
      ttl: number; // Changed from string to number for consistency
      maxItems: number;
   };
   retryConfig: {
      attempts: number;
      delay: number;
   };
}

// Additional interfaces for better type safety
export interface CacheInfo {
   ttl: string;
   ttlMinutes: number;
   ttlMs: number;
   maxItems?: number;
}

export interface RateLimiterStats {
   requestCount: number;
   lastRequestTime: number;
   rateLimit: number;
}

export interface RetryConfig {
   attempts: number;
   delay: number;
}

// Error types for better error handling
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

// Validation result interface
export interface ValidationResult {
   isValid: boolean;
   errors: string[];
}

// Service status interface
export interface ServiceStatus {
   service: string;
   status: "healthy" | "degraded" | "unhealthy";
   lastCheck: string;
   responseTime?: number;
   errorRate?: number;
}
