import axios, {
   AxiosInstance,
   AxiosResponse,
   AxiosRequestConfig,
   isAxiosError,
} from "axios";
import {
   PokemonClient,
   MoveClient,
   ItemClient,
   LocationClient,
   BerryClient,
   EvolutionClient,
   GameClient,
} from "pokenode-ts";
import { z } from "zod";
import pino from "pino";
import { APIError } from "./Types";

// Configuration schema for validation
const ConfigSchema = z.object({
   baseURL: z.string().url().default("https://pokeapi.co/api/v2/"),
   timeout: z.number().positive().default(10000),
   maxRetries: z.number().min(0).max(5).default(3),
   retryDelay: z.number().positive().default(1000),
   enableLogging: z.boolean().default(process.env.NODE_ENV === "development"),
   enableCache: z.boolean().default(true),
   cacheMaxAge: z.number().positive().default(300000), // 5 minutes
   rateLimitRpm: z.number().positive().default(100), // requests per minute
});

export type HTTPClientConfig = z.infer<typeof ConfigSchema>;

interface PokeAPIClients {
   pokemon: PokemonClient;
   move: MoveClient;
   item: ItemClient;
   location: LocationClient;
   berry: BerryClient;
   evolution: EvolutionClient;
   game: GameClient;
}

const RETRY_METADATA = Symbol("retryMetadata");

interface RetryMetadata {
   count: number;
   attempted: boolean;
}

interface CacheEntry<T = any> {
   data: T;
   timestamp: number;
   ttl: number;
}

interface RateLimitState {
   requests: number[];
   windowStart: number;
}

/**
 * Production-ready HTTPClient with caching, rate limiting, and enhanced logging.
 * Wraps Axios and all Pokenode-TS clients for unified PokeAPI communication.
 */
export class HTTPClient {
   private readonly axiosInstance: AxiosInstance;
   private readonly pokemonClient: PokemonClient;
   private readonly moveClient: MoveClient;
   private readonly itemClient: ItemClient;
   private readonly locationClient: LocationClient;
   private readonly berryClient: BerryClient;
   private readonly evolutionClient: EvolutionClient;
   private readonly gameClient: GameClient;
   private readonly config: HTTPClientConfig;
   private readonly logger: pino.Logger;
   private readonly cache = new Map<string, CacheEntry>();
   private readonly rateLimitState: RateLimitState = {
      requests: [],
      windowStart: Date.now(),
   };

   constructor(userConfig: Partial<HTTPClientConfig> = {}) {
      // Validate and merge configuration
      this.config = ConfigSchema.parse(userConfig);

      // Initialize logger
      this.logger = pino({
         name: "HTTPClient",
         level: this.config.enableLogging ? "debug" : "error",
         ...(process.env.NODE_ENV === "production" && {
            redact: ["req.headers.authorization", 'res.headers["set-cookie"]'],
         }),
      });

      this.axiosInstance = axios.create({
         baseURL: this.config.baseURL,
         timeout: this.config.timeout,
         headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
            "User-Agent": "HTTPClient/1.0.0", // Identify your app
         },
      });

      // Initialize specialized clients
      this.pokemonClient = new PokemonClient();
      this.moveClient = new MoveClient();
      this.itemClient = new ItemClient();
      this.locationClient = new LocationClient();
      this.berryClient = new BerryClient();
      this.evolutionClient = new EvolutionClient();
      this.gameClient = new GameClient();

      this.setupInterceptors();
      this.startCacheCleanup();
   }

   private setupInterceptors(): void {
      // Request interceptor with rate limiting
      this.axiosInstance.interceptors.request.use(
         async (config) => {
            // Rate limiting check
            if (!this.checkRateLimit()) {
               throw new Error(
                  "Rate limit exceeded. Please wait before making more requests."
               );
            }

            // Check cache first
            if (config.method === "get" && this.config.enableCache) {
               const cached = this.getFromCache(config.url || "");
               if (cached) {
                  this.logger.debug({ url: config.url }, "Cache hit");
                  // Return cached response in a format that bypasses the actual request
                  return Promise.reject({
                     __cached: true,
                     data: cached,
                     config,
                  });
               }
            }

            this.logger.debug(
               {
                  method: config.method?.toUpperCase(),
                  url: config.url,
                  timeout: config.timeout,
               },
               "API Request"
            );

            return config;
         },
         (error) => {
            this.logger.error(
               { error: error.message },
               "Request interceptor error"
            );
            return Promise.reject(this.formatError(error));
         }
      );

      // Response interceptor with caching and retry logic
      this.axiosInstance.interceptors.response.use(
         (response: AxiosResponse) => {
            this.logger.debug(
               {
                  status: response.status,
                  url: response.config.url,
                  size: JSON.stringify(response.data).length,
               },
               "API Response"
            );

            // Cache successful GET responses
            if (response.config.method === "get" && this.config.enableCache) {
               this.setCache(response.config.url || "", response.data);
            }

            return response;
         },
         async (error) => {
            // Handle cached responses
            if (error.__cached) {
               return {
                  data: error.data,
                  status: 200,
                  statusText: "OK",
                  headers: {},
                  config: error.config,
               };
            }

            const config = error.config;

            // Retry logic for server errors
            if (error.response?.status >= 500 && config) {
               const retryMeta: RetryMetadata = (config as any)[
                  RETRY_METADATA
               ] || {
                  count: 0,
                  attempted: false,
               };

               if (
                  !retryMeta.attempted &&
                  retryMeta.count < this.config.maxRetries
               ) {
                  retryMeta.count++;
                  retryMeta.attempted = true;
                  (config as any)[RETRY_METADATA] = retryMeta;

                  const delay =
                     Math.pow(2, retryMeta.count) * this.config.retryDelay;

                  this.logger.warn(
                     {
                        attempt: retryMeta.count,
                        delay,
                        url: config.url,
                     },
                     "Retrying request after server error"
                  );

                  await new Promise((resolve) => setTimeout(resolve, delay));

                  retryMeta.attempted = false;
                  return this.axiosInstance(config);
               }
            }

            this.logger.error(
               {
                  status: error.response?.status,
                  message: error.message,
                  url: error.config?.url,
               },
               "API Response Error"
            );

            return Promise.reject(this.formatError(error));
         }
      );
   }

   private checkRateLimit(): boolean {
      const now = Date.now();
      const windowMs = 60000; // 1 minute window

      // Reset window if needed
      if (now - this.rateLimitState.windowStart > windowMs) {
         this.rateLimitState.requests = [];
         this.rateLimitState.windowStart = now;
      }

      // Remove old requests outside current window
      this.rateLimitState.requests = this.rateLimitState.requests.filter(
         (timestamp) => now - timestamp < windowMs
      );

      // Check if under limit
      if (this.rateLimitState.requests.length < this.config.rateLimitRpm) {
         this.rateLimitState.requests.push(now);
         return true;
      }

      this.logger.warn(
         {
            current: this.rateLimitState.requests.length,
            limit: this.config.rateLimitRpm,
         },
         "Rate limit reached"
      );

      return false;
   }

   private getFromCache<T>(key: string): T | null {
      const entry = this.cache.get(key);
      if (!entry) return null;

      const now = Date.now();
      if (now - entry.timestamp > entry.ttl) {
         this.cache.delete(key);
         return null;
      }

      return entry.data;
   }

   private setCache<T>(key: string, data: T): void {
      if (!key) return;

      this.cache.set(key, {
         data,
         timestamp: Date.now(),
         ttl: this.config.cacheMaxAge,
      });
   }

   private startCacheCleanup(): void {
      // Clean expired cache entries every 5 minutes
      setInterval(() => {
         const now = Date.now();
         const keysToDelete: string[] = [];

         this.cache.forEach((entry, key) => {
            if (now - entry.timestamp > entry.ttl) {
               keysToDelete.push(key);
            }
         });

         keysToDelete.forEach((key) => this.cache.delete(key));

         if (keysToDelete.length > 0) {
            this.logger.debug(
               {
                  cleaned: keysToDelete.length,
                  remaining: this.cache.size,
               },
               "Cache cleanup completed"
            );
         }
      }, 300000); // 5 minutes
   }

   private formatError(error: any): APIError {
      if (isAxiosError(error)) {
         const apiError: APIError = {
            code: error.response?.status?.toString() || "NETWORK_ERROR",
            message: error.message || "An unexpected error occurred",
            details: error.response?.data?.message,
            retryable: (error.response?.status ?? 0) >= 500 || !error.response,
         };

         // Add request context for debugging
         if (error.config) {
            (apiError as any).requestContext = {
               method: error.config.method,
               url: error.config.url,
               timeout: error.config.timeout,
            };
         }

         return apiError;
      }

      return {
         code: "UNKNOWN_ERROR",
         message: error.message || "An unexpected error occurred",
         details: undefined,
         retryable: false,
      };
   }

   /**
    * Generic request method with response validation
    */
   public async request<T = any>(
      config: AxiosRequestConfig,
      schema?: z.ZodSchema<T>
   ): Promise<T> {
      const response = await this.axiosInstance.request<T>(config);

      if (schema) {
         try {
            return schema.parse(response.data);
         } catch (validationError) {
            this.logger.error(
               {
                  error: validationError,
                  url: config.url,
               },
               "Response validation failed"
            );
            throw new Error(`Invalid response format: ${validationError}`);
         }
      }

      return response.data;
   }

   /**
    * Clear cache manually
    */
   public clearCache(): void {
      this.cache.clear();
      this.logger.info("Cache cleared manually");
   }

   /**
    * Get cache statistics
    */
   public getCacheStats(): { size: number; hitRate?: number } {
      return {
         size: this.cache.size,
         // Note: Would need hit/miss tracking for accurate hit rate
      };
   }

   /**
    * Get current rate limit status
    */
   public getRateLimitStatus(): {
      remaining: number;
      resetTime: number;
      limit: number;
   } {
      const now = Date.now();
      const windowMs = 60000;

      // Clean old requests
      this.rateLimitState.requests = this.rateLimitState.requests.filter(
         (timestamp) => now - timestamp < windowMs
      );

      return {
         remaining: Math.max(
            0,
            this.config.rateLimitRpm - this.rateLimitState.requests.length
         ),
         resetTime: this.rateLimitState.windowStart + windowMs,
         limit: this.config.rateLimitRpm,
      };
   }

   // Getters remain the same...
   public get axios(): AxiosInstance {
      return this.axiosInstance;
   }
   public get pokemon(): PokemonClient {
      return this.pokemonClient;
   }
   public get move(): MoveClient {
      return this.moveClient;
   }
   public get item(): ItemClient {
      return this.itemClient;
   }
   public get location(): LocationClient {
      return this.locationClient;
   }
   public get berry(): BerryClient {
      return this.berryClient;
   }
   public get evolution(): EvolutionClient {
      return this.evolutionClient;
   }
   public get game(): GameClient {
      return this.gameClient;
   }

   public get clients(): PokeAPIClients {
      return {
         pokemon: this.pokemonClient,
         move: this.moveClient,
         item: this.itemClient,
         location: this.locationClient,
         berry: this.berryClient,
         evolution: this.evolutionClient,
         game: this.gameClient,
      };
   }

   public async healthCheck(): Promise<{ [key: string]: boolean }> {
      const results: { [key: string]: boolean } = {};

      const tests = [
         { name: "pokemon", test: () => this.pokemonClient.getPokemonById(1) },
         { name: "move", test: () => this.moveClient.getMoveById(1) },
         { name: "item", test: () => this.itemClient.getItemById(1) },
         {
            name: "location",
            test: () => this.locationClient.getLocationById(1),
         },
         { name: "berry", test: () => this.berryClient.getBerryById(1) },
         {
            name: "evolution",
            test: () => this.evolutionClient.getEvolutionChainById(1),
         },
         { name: "game", test: () => this.gameClient.getGenerationById(1) },
      ];

      const testResults = await Promise.allSettled(
         tests.map(({ name, test }) =>
            test()
               .then(() => ({ name, success: true }))
               .catch((error) => {
                  this.logger.warn(
                     { name, error: error.message },
                     "Health check failed"
                  );
                  return { name, success: false };
               })
         )
      );

      testResults.forEach((result) => {
         if (result.status === "fulfilled") {
            results[result.value.name] = result.value.success;
         }
      });

      return results;
   }
}

// Factory function for creating configured instances
export function createHTTPClient(
   config?: Partial<HTTPClientConfig>
): HTTPClient {
   return new HTTPClient(config);
}

// Default singleton instance
export const httpClient = Object.freeze(createHTTPClient());
