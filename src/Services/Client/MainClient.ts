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
import { CacheManager } from "./Module/CacheManager";
import { NetworkManager } from "./Module/NetworkManager";
import { MemoryManager } from "./Module/MemoryManager";
import { OfflineStorage } from "./Module/OfflineStorage";
import { ErrorHandler } from "./Module/ErrorHandler";

export class BaseService {
   protected api: MainClient;
   private retryManager: RetryManager;
   private batchProcessor: BatchProcessor;
   private cacheManager: CacheManager;
   private networkManager: NetworkManager;
   private memoryManager: MemoryManager;

   constructor(config: ServiceConfig = {}) {
      const {
         cacheOptions = { ttl: 5 * 60 * 1000, maxItems: 200 }, // Mobile optimized
         retryAttempts = 3,
         retryDelay = 1000,
      } = config;

      this.retryManager = new RetryManager(retryAttempts, retryDelay);
      this.batchProcessor = new BatchProcessor();
      this.cacheManager = new CacheManager(cacheOptions);
      this.networkManager = new NetworkManager();
      this.memoryManager = MemoryManager.getInstance();
      this.api = this.cacheManager.getClient();

      this.setupMemoryWarning();
   }

   private setupMemoryWarning() {
      this.memoryManager.addMemoryWarningListener(() => {
         console.warn("Memory warning - clearing cache");
         this.clearCache();
      });
   }

   // ============= ENHANCED CORE API METHODS =============

   /**
    * Execute operation with full React Native support (network, offline, memory)
    */
   protected async executeWithFullSupport<T>(
      operation: () => Promise<T>,
      cacheKey: string,
      errorMessage: string
   ): Promise<T> {
      try {
         // Check network connectivity
         if (!(await this.networkManager.checkConnection())) {
            const cached = await OfflineStorage.retrieve<T>(cacheKey);
            if (cached) {
               console.log(`Using offline data for ${cacheKey}`);
               return cached;
            }
            throw new Error(
               "No network connection and no cached data available"
            );
         }

         // Execute with error handling and retry
         const result = await this.executeWithErrorHandling(
            operation,
            errorMessage
         );

         // Store for offline use (fire and forget)
         OfflineStorage.store(cacheKey, result).catch((err) =>
            console.warn("Failed to cache offline data:", err)
         );

         return result;
      } catch (error) {
         // Try offline fallback
         const cached = await OfflineStorage.retrieve<T>(cacheKey);
         if (cached) {
            console.log(`Network failed, using offline data for ${cacheKey}`);
            return cached;
         }

         // Transform error for better UX
         const pokemonError = ErrorHandler.createError(error, errorMessage);
         throw pokemonError;
      }
   }

   /**
    * Generic method to get a resource by identifier with full support
    */
   protected async getResourceWithFullSupport<T>(
      getByName: (name: string) => Promise<T>,
      getById: (id: number) => Promise<T>,
      identifier: string | number,
      resourceType: string
   ): Promise<T> {
      this.validateIdentifier(identifier, resourceType);

      const cacheKey = `${resourceType}_${identifier}`;

      return this.executeWithFullSupport(
         async () => {
            return typeof identifier === "string"
               ? await getByName(identifier.toLowerCase().trim())
               : await getById(identifier);
         },
         cacheKey,
         `Failed to fetch ${resourceType}: ${identifier}`
      );
   }

   // ============= CORE METHODS (Without Rate Limiting) =============

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
      concurrency: number = 5, // Increased since no rate limiting
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

   // ============= ENHANCED CACHE & STORAGE MANAGEMENT =============

   clearCache(): void {
      this.cacheManager.clear();
      this.api = this.cacheManager.getClient();
   }

   async clearOfflineStorage(): Promise<void> {
      await OfflineStorage.clear();
   }

   async clearAllStorage(): Promise<void> {
      this.clearCache();
      await this.clearOfflineStorage();
   }

   // ============= NETWORK & CONNECTION MANAGEMENT =============

   async isOnline(): Promise<boolean> {
      return this.networkManager.checkConnection();
   }

   addNetworkListener(callback: (isConnected: boolean) => void) {
      return this.networkManager.addListener(callback);
   }

   // ============= ENHANCED HEALTH & MONITORING =============

   getServiceHealth(): ServiceHealth {
      const retryConfig = this.retryManager.getConfig();
      const cacheInfo = this.cacheManager.getInfo();

      return {
         isHealthy: true,
         requestCount: 0, // No longer tracking since no rate limiting
         lastRequestTime: 0,
         rateLimit: 0, // No rate limit
         cacheInfo: {
            ttl: cacheInfo.ttlMinutes,
            maxItems: cacheInfo.maxItems || 200,
         },
         retryConfig: {
            attempts: retryConfig.attempts,
            delay: retryConfig.delay,
         },
         networkStatus: this.networkManager.isOnline(),
         memoryStatus: this.memoryManager.isMemoryLow() ? "low" : "normal",
      };
   }
}
