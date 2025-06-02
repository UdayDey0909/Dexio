// src/Services/Client/MainClient.ts
import { MainClient } from "pokenode-ts";
import {
   ServiceConfig,
   PaginationParams,
   PaginatedResponse,
   BatchOperationOptions,
   ServiceHealth,
} from "./Types";
import { RetryManager } from "./Module/RetryManager";
import { Validator } from "./Module/Validator";
import { UrlUtils } from "./Module/UrlUtils";
import { BatchProcessor } from "./Module/BatchProcessor";
import { MobileCacheManager } from "./Module/MemoryManager";
import { NetworkManager } from "./Module/NetworkManager";
import { ErrorHandler } from "./Module/ErrorHandler";

export class BaseService {
   protected api: MainClient;
   private retryManager: RetryManager;
   private batchProcessor: BatchProcessor;
   private cacheManager: MobileCacheManager;
   private networkManager: NetworkManager;

   constructor(config: ServiceConfig = {}) {
      const {
         cacheOptions = { ttl: 5 * 60 * 1000, maxItems: 100 },
         retryAttempts = 3,
         retryDelay = 1000,
      } = config;

      this.retryManager = new RetryManager(retryAttempts, retryDelay);
      this.batchProcessor = new BatchProcessor();
      this.cacheManager = new MobileCacheManager(cacheOptions);
      this.networkManager = new NetworkManager();
      this.api = this.cacheManager.getClient();
   }

   // ============= CORE API METHODS =============

   /**
    * Execute operation with network check and error handling
    */
   protected async executeWithNetworkSupport<T>(
      operation: () => Promise<T>,
      cacheKey: string,
      errorMessage: string
   ): Promise<T> {
      // Check network connectivity
      if (!(await this.networkManager.checkConnection())) {
         throw new Error("No network connection available");
      }

      // Execute with error handling and retry
      const result = await this.executeWithErrorHandling(
         operation,
         errorMessage
      );

      return result;
   }

   /**
    * Generic method to get a resource by identifier with network support
    */
   protected async getResourceWithNetworkSupport<T>(
      getByName: (name: string) => Promise<T>,
      getById: (id: number) => Promise<T>,
      identifier: string | number,
      resourceType: string
   ): Promise<T> {
      this.validateIdentifier(identifier, resourceType);

      const cacheKey = `${resourceType}_${identifier}`;

      return this.executeWithNetworkSupport(
         async () => {
            return typeof identifier === "string"
               ? await getByName(identifier.toLowerCase().trim())
               : await getById(identifier);
         },
         cacheKey,
         `Failed to fetch ${resourceType}: ${identifier}`
      );
   }

   // ============= CORE METHODS =============

   protected async executeWithErrorHandling<T>(
      operation: () => Promise<T>,
      errorMessage: string
   ): Promise<T> {
      return this.retryManager.executeWithRetry(async () => {
         try {
            const result = await operation();
            return result;
         } catch (error) {
            throw error;
         }
      }, errorMessage);
   }

   protected async batchOperation<T, R>(
      items: T[],
      operation: (item: T, index: number) => Promise<R>,
      concurrency: number = 5,
      onProgress?: (completed: number, total: number) => void
   ): Promise<R[]> {
      if (!Array.isArray(items) || items.length === 0) {
         throw new Error("Items array cannot be empty");
      }

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

   protected validateIdentifier = Validator.validateIdentifier;
   protected validatePaginationParams = Validator.validatePaginationParams;
   protected validateArray = Validator.validateArray;

   // ============= CACHE MANAGEMENT =============

   clearCache(): void {
      this.cacheManager.clear();
      this.api = this.cacheManager.getClient();
   }

   // ============= NETWORK & CONNECTION MANAGEMENT =============

   async isOnline(): Promise<boolean> {
      return this.networkManager.checkConnection();
   }

   addNetworkListener(callback: (isConnected: boolean) => void) {
      return this.networkManager.addListener(callback);
   }

   // ============= HEALTH & MONITORING =============

   getServiceHealth(): ServiceHealth {
      const retryConfig = this.retryManager.getConfig();
      const cacheInfo = this.cacheManager.getInfo();

      return {
         isHealthy: true,
         requestCount: 0,
         lastRequestTime: 0,
         rateLimit: 0,
         cacheInfo: {
            ttl: cacheInfo.ttlMinutes,
            maxItems: cacheInfo.maxItems || 100,
         },
         retryConfig: {
            attempts: retryConfig.attempts,
            delay: retryConfig.delay,
         },
         networkStatus: this.networkManager.isOnline(),
         memoryStatus: "normal",
      };
   }

   // Manual cleanup method
   performCleanup(): void {
      console.log("Performing manual cleanup");
      this.clearCache();
   }
}
