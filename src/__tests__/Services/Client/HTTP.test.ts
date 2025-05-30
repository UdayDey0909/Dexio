import {
   describe,
   it,
   expect,
   beforeEach,
   afterEach,
   jest,
   beforeAll,
   afterAll,
} from "@jest/globals";
import axios, { AxiosError, AxiosResponse } from "axios";
import {
   HTTPClient,
   createHTTPClient,
   httpClient,
   HTTPClientConfig,
} from "@/Services/Client/HTTP"; // Fixed import path - remove @/ alias
import { APIError } from "@/Services/Client/Types"; // Fixed import path
import pino from "pino";
import { z } from "zod";

// Mock dependencies
jest.mock("axios");
jest.mock("pokenode-ts", () => ({
   PokemonClient: jest.fn().mockImplementation(() => ({
      getPokemonById: jest.fn(),
      getPokemonByName: jest.fn(),
   })),
   MoveClient: jest.fn().mockImplementation(() => ({
      getMoveById: jest.fn(),
      getMoveByName: jest.fn(),
   })),
   ItemClient: jest.fn().mockImplementation(() => ({
      getItemById: jest.fn(),
      getItemByName: jest.fn(),
   })),
   LocationClient: jest.fn().mockImplementation(() => ({
      getLocationById: jest.fn(),
      getLocationByName: jest.fn(),
   })),
   BerryClient: jest.fn().mockImplementation(() => ({
      getBerryById: jest.fn(),
      getBerryByName: jest.fn(),
   })),
   EvolutionClient: jest.fn().mockImplementation(() => ({
      getEvolutionChainById: jest.fn(),
   })),
   GameClient: jest.fn().mockImplementation(() => ({
      getGenerationById: jest.fn(),
      getVersionById: jest.fn(),
   })),
}));

jest.mock("pino", () => {
   const mockLogger = {
      debug: jest.fn(),
      info: jest.fn(),
      warn: jest.fn(),
      error: jest.fn(),
   };
   const mockPino = jest.fn(() => mockLogger);
   (mockPino as any).destination = jest.fn();
   return mockPino;
});

const mockedAxios = jest.mocked(axios);
const mockedPino = jest.mocked(pino);

describe("HTTPClient", () => {
   let mockAxiosInstance: any;
   let mockLogger: any;
   let originalSetInterval: typeof setInterval;
   let originalClearInterval: typeof clearInterval;

   beforeAll(() => {
      // Store original timers
      originalSetInterval = global.setInterval;
      originalClearInterval = global.clearInterval;

      // Mock timers for testing rate limiting and caching
      jest.useFakeTimers();
   });

   afterAll(() => {
      jest.useRealTimers();
      // Restore original timers
      global.setInterval = originalSetInterval;
      global.clearInterval = originalClearInterval;
   });

   beforeEach(() => {
      jest.clearAllMocks();

      mockLogger = {
         debug: jest.fn(),
         info: jest.fn(),
         warn: jest.fn(),
         error: jest.fn(),
      };

      mockAxiosInstance = {
         create: jest.fn().mockReturnThis(),
         request: jest.fn(),
         interceptors: {
            request: {
               use: jest.fn(),
            },
            response: {
               use: jest.fn(),
            },
         },
      };

      (mockedAxios.create as jest.Mock).mockReturnValue(mockAxiosInstance);
      (mockedPino as jest.Mock).mockReturnValue(mockLogger);
   });

   afterEach(() => {
      jest.clearAllTimers();
   });

   describe("Constructor and Configuration", () => {
      it("should create HTTPClient with default configuration", () => {
         const client = new HTTPClient();

         expect(mockedAxios.create).toHaveBeenCalledWith({
            baseURL: "https://pokeapi.co/api/v2/",
            timeout: 10000,
            headers: {
               Accept: "application/json",
               "Content-Type": "application/json",
               "User-Agent": "HTTPClient/1.0.0",
            },
         });
      });

      it("should create HTTPClient with custom configuration", () => {
         const config: Partial<HTTPClientConfig> = {
            baseURL: "https://custom-api.com/",
            timeout: 5000,
            maxRetries: 5,
            enableCache: false,
         };

         const client = new HTTPClient(config);

         expect(mockedAxios.create).toHaveBeenCalledWith({
            baseURL: "https://custom-api.com/",
            timeout: 5000,
            headers: {
               Accept: "application/json",
               "Content-Type": "application/json",
               "User-Agent": "HTTPClient/1.0.0",
            },
         });
      });

      it("should throw if required config is invalid", () => {
         expect(() => new HTTPClient({ baseURL: "invalid-url" })).toThrow();
         expect(() => new HTTPClient({ timeout: -1 })).toThrow();
         expect(() => new HTTPClient({ maxRetries: -1 })).toThrow();
      });

      it("should use default values when config is not provided", () => {
         const client = new HTTPClient();
         expect(client).toBeInstanceOf(HTTPClient);
      });

      it("should setup logging correctly based on environment", () => {
         const client = new HTTPClient({ enableLogging: true });

         expect(mockedPino).toHaveBeenCalledWith({
            name: "HTTPClient",
            level: "debug",
         });
      });
   });

   describe("Client Getters", () => {
      it("should provide access to all specialized clients", () => {
         const client = new HTTPClient();

         expect(client.pokemon).toBeDefined();
         expect(client.move).toBeDefined();
         expect(client.item).toBeDefined();
         expect(client.location).toBeDefined();
         expect(client.berry).toBeDefined();
         expect(client.evolution).toBeDefined();
         expect(client.game).toBeDefined();
         expect(client.axios).toBe(mockAxiosInstance);
      });

      it("should provide clients object with all specialized clients", () => {
         const client = new HTTPClient();
         const clients = client.clients;

         expect(clients).toHaveProperty("pokemon");
         expect(clients).toHaveProperty("move");
         expect(clients).toHaveProperty("item");
         expect(clients).toHaveProperty("location");
         expect(clients).toHaveProperty("berry");
         expect(clients).toHaveProperty("evolution");
         expect(clients).toHaveProperty("game");
      });
   });

   describe("Request Method", () => {
      it("should make successful request and return data", async () => {
         const mockResponse = { data: { id: 1, name: "test" } };
         mockAxiosInstance.request.mockResolvedValue(mockResponse);

         const client = new HTTPClient();
         const result = await client.request({ url: "/test" });

         expect(mockAxiosInstance.request).toHaveBeenCalledWith({
            url: "/test",
         });
         expect(result).toEqual(mockResponse.data);
      });

      it("should validate response with schema when provided", async () => {
         const mockResponse = { data: { id: 1, name: "test" } };
         const schema = z.object({ id: z.number(), name: z.string() });
         mockAxiosInstance.request.mockResolvedValue(mockResponse);

         const client = new HTTPClient();
         const result = await client.request({ url: "/test" }, schema);

         expect(result).toEqual(mockResponse.data);
      });

      it("should throw error when schema validation fails", async () => {
         const mockResponse = { data: { invalid: "data" } };
         const schema = z.object({ id: z.number(), name: z.string() });
         mockAxiosInstance.request.mockResolvedValue(mockResponse);

         const client = new HTTPClient();

         await expect(client.request({ url: "/test" }, schema)).rejects.toThrow(
            "Invalid response format"
         );
      });
   });

   describe("Caching", () => {
      let client: HTTPClient;

      beforeEach(() => {
         client = new HTTPClient({ enableCache: true, cacheMaxAge: 1000 });
      });

      it("should cache and retrieve data correctly", () => {
         const testData = { id: 1, name: "cached" };
         const testKey = "/pokemon/1";

         // Set cache data using private method
         (client as any).setCache(testKey, testData);

         // Verify cache stats
         const stats = client.getCacheStats();
         expect(stats.size).toBe(1);

         // Get cached data
         const cached = (client as any).getFromCache(testKey);
         expect(cached).toEqual(testData);
      });

      it("should expire cached entries after TTL", () => {
         const testData = { id: 1, name: "cached" };
         const testKey = "/pokemon/1";

         (client as any).setCache(testKey, testData);

         // Fast forward past cache TTL
         jest.advanceTimersByTime(1500);

         const cached = (client as any).getFromCache(testKey);
         expect(cached).toBeNull();
      });

      it("should clear cache manually", () => {
         (client as any).setCache("test", { data: "test" });
         expect(client.getCacheStats().size).toBe(1);

         client.clearCache();
         expect(client.getCacheStats().size).toBe(0);
      });
   });

   describe("Rate Limiting", () => {
      it("should allow requests within rate limit", () => {
         const client = new HTTPClient({ rateLimitRpm: 5 });

         expect((client as any).checkRateLimit()).toBe(true);
         expect((client as any).checkRateLimit()).toBe(true);
         expect((client as any).checkRateLimit()).toBe(true);
      });

      it("should block requests exceeding rate limit", () => {
         const client = new HTTPClient({ rateLimitRpm: 2 });

         expect((client as any).checkRateLimit()).toBe(true);
         expect((client as any).checkRateLimit()).toBe(true);
         expect((client as any).checkRateLimit()).toBe(false);
      });

      it("should reset rate limit after time window", () => {
         const client = new HTTPClient({ rateLimitRpm: 1 });

         // Exhaust rate limit
         expect((client as any).checkRateLimit()).toBe(true);
         expect((client as any).checkRateLimit()).toBe(false);

         // Fast forward 1 minute + buffer
         jest.advanceTimersByTime(61000);

         // Should be able to make requests again
         expect((client as any).checkRateLimit()).toBe(true);
      });

      it("should provide accurate rate limit status", () => {
         const client = new HTTPClient({ rateLimitRpm: 5 });

         (client as any).checkRateLimit();
         (client as any).checkRateLimit();

         const status = client.getRateLimitStatus();
         expect(status.remaining).toBe(3);
         expect(status.limit).toBe(5);
         expect(typeof status.resetTime).toBe("number");
      });
   });

   describe("Error Handling", () => {
      let client: HTTPClient;

      beforeEach(() => {
         client = new HTTPClient({ maxRetries: 2, retryDelay: 100 });
      });

      it("should format axios errors correctly", () => {
         const axiosError = {
            isAxiosError: true,
            response: {
               status: 404,
               data: { message: "Not found" },
            },
            message: "Request failed",
            config: {
               method: "get",
               url: "/pokemon/999",
               timeout: 5000,
            },
         };

         // Mock isAxiosError to return true for this specific error
         const isAxiosErrorSpy = jest.spyOn(axios, "isAxiosError");
         isAxiosErrorSpy.mockReturnValue(true);

         const formattedError = (client as any).formatError(axiosError);

         expect(formattedError.code).toBe("404");
         expect(formattedError.message).toBe("Request failed");
         expect(formattedError.details).toBe("Not found");
         expect(formattedError.retryable).toBe(false);

         isAxiosErrorSpy.mockRestore();
      });

      it("should format network errors as retryable", () => {
         const networkError = {
            isAxiosError: true,
            message: "Network Error",
            config: { url: "/test" },
         };

         const isAxiosErrorSpy = jest.spyOn(axios, "isAxiosError");
         isAxiosErrorSpy.mockReturnValue(true);

         const formattedError = (client as any).formatError(networkError);

         expect(formattedError.retryable).toBe(true);
         expect(formattedError.code).toBe("NETWORK_ERROR");

         isAxiosErrorSpy.mockRestore();
      });

      it("should handle non-axios errors", () => {
         const genericError = new Error("Generic error");

         const isAxiosErrorSpy = jest.spyOn(axios, "isAxiosError");
         isAxiosErrorSpy.mockReturnValue(false);

         const formattedError = (client as any).formatError(genericError);

         expect(formattedError).toEqual({
            code: "UNKNOWN_ERROR",
            message: "Generic error",
            details: undefined,
            retryable: false,
         });

         isAxiosErrorSpy.mockRestore();
      });
   });

   describe("Health Check", () => {
      it("should perform health check on all clients", async () => {
         const client = new HTTPClient();

         // Mock all client methods to resolve
         const mockResolvedValue = Promise.resolve({ id: 1 });

         jest
            .spyOn(client.pokemon, "getPokemonById")
            .mockImplementation(() => mockResolvedValue as any);
         jest
            .spyOn(client.move, "getMoveById")
            .mockImplementation(() => mockResolvedValue as any);
         jest
            .spyOn(client.item, "getItemById")
            .mockImplementation(() => mockResolvedValue as any);
         jest
            .spyOn(client.location, "getLocationById")
            .mockImplementation(() => mockResolvedValue as any);
         jest
            .spyOn(client.berry, "getBerryById")
            .mockImplementation(() => mockResolvedValue as any);
         jest
            .spyOn(client.evolution, "getEvolutionChainById")
            .mockImplementation(() => mockResolvedValue as any);
         jest
            .spyOn(client.game, "getGenerationById")
            .mockImplementation(() => mockResolvedValue as any);

         const results = await client.healthCheck();

         expect(results).toEqual({
            pokemon: true,
            move: true,
            item: true,
            location: true,
            berry: true,
            evolution: true,
            game: true,
         });
      });

      it("should handle failing health checks", async () => {
         const client = new HTTPClient();

         // Mock some clients to fail
         jest
            .spyOn(client.pokemon, "getPokemonById")
            .mockRejectedValue(new Error("API down"));
         jest.spyOn(client.move, "getMoveById").mockResolvedValue({} as any);
         jest.spyOn(client.item, "getItemById").mockResolvedValue({} as any);
         jest
            .spyOn(client.location, "getLocationById")
            .mockResolvedValue({} as any);
         jest.spyOn(client.berry, "getBerryById").mockResolvedValue({} as any);
         jest
            .spyOn(client.evolution, "getEvolutionChainById")
            .mockResolvedValue({} as any);
         jest
            .spyOn(client.game, "getGenerationById")
            .mockResolvedValue({} as any);

         const results = await client.healthCheck();

         expect(results.pokemon).toBe(false);
         expect(results.move).toBe(true);
      });
   });

   describe("Factory Functions", () => {
      it("should create client with factory function", () => {
         const client = createHTTPClient({ timeout: 5000 });
         expect(client).toBeInstanceOf(HTTPClient);
      });

      it("should provide default singleton instance", () => {
         expect(httpClient).toBeInstanceOf(HTTPClient);
         expect(Object.isFrozen(httpClient)).toBe(true);
      });
   });

   describe("Integration Tests", () => {
      it("should handle complete request lifecycle", async () => {
         const client = new HTTPClient({ enableCache: true });
         const mockData = { id: 1, name: "pikachu" };

         mockAxiosInstance.request.mockResolvedValue({
            data: mockData,
         });

         // First request
         const result1 = await client.request({
            method: "get",
            url: "/pokemon/1",
         });
         expect(result1).toEqual(mockData);

         // Verify request was made
         expect(mockAxiosInstance.request).toHaveBeenCalledWith({
            method: "get",
            url: "/pokemon/1",
         });
      });
   });

   describe("Edge Cases", () => {
      it("should handle undefined URL in cache operations", () => {
         const client = new HTTPClient();

         // Should not throw
         expect(() => (client as any).setCache("", "data")).not.toThrow();
         expect((client as any).getFromCache("")).toBe(null);
      });

      it("should handle cache cleanup", () => {
         const client = new HTTPClient({ cacheMaxAge: 1000 });

         // Add some cache entries
         (client as any).setCache("key1", "data1");
         (client as any).setCache("key2", "data2");

         expect(client.getCacheStats().size).toBe(2);

         // Fast forward past cache TTL
         jest.advanceTimersByTime(2000);

         // Manual verification since automatic cleanup is internal
         expect((client as any).getFromCache("key1")).toBeNull();
         expect((client as any).getFromCache("key2")).toBeNull();
      });
   });

   describe("Configuration Edge Cases", () => {
      it("should handle production environment configuration", () => {
         const originalEnv = process.env.NODE_ENV;
         process.env.NODE_ENV = "production";

         try {
            const client = new HTTPClient({ enableLogging: true });

            expect(mockedPino).toHaveBeenCalledWith({
               name: "HTTPClient",
               level: "debug",
               redact: [
                  "req.headers.authorization",
                  'res.headers["set-cookie"]',
               ],
            });
         } finally {
            process.env.NODE_ENV = originalEnv;
         }
      });

      it("should use environment-based logging by default", () => {
         const originalEnv = process.env.NODE_ENV;
         process.env.NODE_ENV = "development";

         try {
            const client = new HTTPClient();

            expect(mockedPino).toHaveBeenCalledWith({
               name: "HTTPClient",
               level: "debug",
            });
         } finally {
            process.env.NODE_ENV = originalEnv;
         }
      });
   });
});
