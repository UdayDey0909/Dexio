import { MainClient } from "pokenode-ts";
import {
   ServiceConfig,
   PaginationParams,
   PaginatedResponse,
   BatchOperationOptions,
   ServiceHealth,
} from "./Types";
import { RateLimiter } from "./Module/RateLimiter";
import { RetryManager } from "./Module/RetryManager";
import { Validator } from "./Module/Validator";
import { UrlUtils } from "./Module/UrlUtils";
import { BatchProcessor } from "./Module/BatchProcessor";
import { CacheManager } from "./Module/CacheManager";

export class BaseService {
   protected api: MainClient;
   private rateLimiter: RateLimiter;
   private retryManager: RetryManager;
   private batchProcessor: BatchProcessor;
   private cacheManager: CacheManager;

   constructor(config: ServiceConfig = {}) {
      const {
         rateLimit = 100,
         cacheOptions = { ttl: 10 * 60 * 1000 },
         retryAttempts = 3,
         retryDelay = 1000,
      } = config;

      this.rateLimiter = new RateLimiter(rateLimit);
      this.retryManager = new RetryManager(retryAttempts, retryDelay);
      this.batchProcessor = new BatchProcessor();
      this.cacheManager = new CacheManager(cacheOptions);
      this.api = this.cacheManager.getClient();
   }

   // ============= CORE API METHODS =============

   /**
    * Generic method to get a resource by identifier with automatic retry
    */
   protected async getResource<T>(
      getByName: (name: string) => Promise<T>,
      getById: (id: number) => Promise<T>,
      identifier: string | number,
      resourceType: string
   ): Promise<T> {
      Validator.validateIdentifier(identifier, resourceType);

      return this.executeWithErrorHandling(async () => {
         return typeof identifier === "string"
            ? await getByName(identifier.toLowerCase().trim())
            : await getById(identifier);
      }, `Failed to fetch ${resourceType}: ${identifier}`);
   }

   /**
    * Generic method to get paginated lists
    */
   protected async getResourceList<T>(
      listFunction: (
         offset: number,
         limit: number
      ) => Promise<PaginatedResponse<T>>,
      resourceType: string,
      { offset = 0, limit = 20 }: PaginationParams = {}
   ): Promise<PaginatedResponse<T>> {
      Validator.validatePaginationParams(offset, limit);

      return this.executeWithErrorHandling(
         async () => await listFunction(offset, limit),
         `Failed to fetch ${resourceType} list`
      );
   }

   // ============= ENHANCED OPERATIONS =============

   protected async executeWithErrorHandling<T>(
      operation: () => Promise<T>,
      errorMessage: string
   ): Promise<T> {
      return this.retryManager.executeWithRetry(async () => {
         await this.rateLimiter.checkLimit();
         const result = await operation();
         this.rateLimiter.incrementCount();
         return result;
      }, errorMessage);
   }

   protected async batchOperation<T, R>(
      items: T[],
      operation: (item: T, index: number) => Promise<R>,
      concurrency: number = 5,
      onProgress?: (completed: number, total: number) => void
   ): Promise<R[]> {
      return this.batchProcessor.processBatch(items, operation, {
         concurrency,
         onProgress,
         stopOnError: false,
      });
   }

   // ============= UTILITY METHODS =============

   protected extractIdFromUrl = UrlUtils.extractIdFromUrl;
   protected extractNameFromUrl = UrlUtils.extractNameFromUrl;
   protected buildApiUrl = UrlUtils.buildApiUrl;
   protected isValidApiUrl = UrlUtils.isValidApiUrl;

   // Validation methods
   protected validateIdentifier = Validator.validateIdentifier;
   protected validatePaginationParams = Validator.validatePaginationParams;
   protected validateArray = Validator.validateArray;

   // ============= CACHE MANAGEMENT =============

   clearCache(): void {
      this.cacheManager.clear();
      this.api = this.cacheManager.getClient();
      this.rateLimiter.reset();
   }

   getCacheInfo() {
      const rateLimiterStats = this.rateLimiter.getStats();
      const retryConfig = this.retryManager.getConfig();
      const cacheInfo = this.cacheManager.getInfo();

      return {
         ...cacheInfo,
         requestCount: rateLimiterStats.requestCount,
         lastRequestTime: new Date(
            rateLimiterStats.lastRequestTime
         ).toISOString(),
         rateLimit: rateLimiterStats.rateLimit,
         retryAttempts: retryConfig.attempts,
      };
   }

   // ============= HEALTH & MONITORING =============

   getServiceHealth(): ServiceHealth {
      const rateLimiterStats = this.rateLimiter.getStats();
      const retryConfig = this.retryManager.getConfig();
      const cacheInfo = this.cacheManager.getInfo();

      return {
         isHealthy: true,
         requestCount: rateLimiterStats.requestCount,
         lastRequestTime: rateLimiterStats.lastRequestTime,
         rateLimit: rateLimiterStats.rateLimit,
         cacheInfo: {
            ttl: cacheInfo.ttl,
            maxItems: cacheInfo.maxItems!,
         },
         retryConfig: {
            attempts: retryConfig.attempts,
            delay: retryConfig.delay,
         },
      };
   }
}
