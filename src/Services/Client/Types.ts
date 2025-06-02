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
   requestCount: number; // Kept for compatibility but will be 0
   lastRequestTime: number; // Kept for compatibility but will be 0
   rateLimit: number; // Kept for compatibility but will be 0
   cacheInfo: {
      ttl: number;
      maxItems: number;
   };
   retryConfig: {
      attempts: number;
      delay: number;
   };
   networkStatus?: boolean; // Added network status
   memoryStatus?: "low" | "normal"; // Added memory status
}

// Additional interfaces for better type safety
export interface CacheInfo {
   ttl: string;
   ttlMinutes: number;
   ttlMs: number;
   maxItems?: number;
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
