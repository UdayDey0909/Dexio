import axios from "axios";
import { HTTPClient, createHTTPClient } from "@/Services/Client/HTTP";
import { APIError } from "@/Services/Client/Types";

// Mock axios and pokenode-ts clients
jest.mock("axios");
jest.mock("pokenode-ts", () => ({
   PokemonClient: jest.fn().mockImplementation(() => ({
      getPokemonById: jest.fn(),
   })),
   MoveClient: jest.fn().mockImplementation(() => ({
      getMoveById: jest.fn(),
   })),
   ItemClient: jest.fn().mockImplementation(() => ({
      getItemById: jest.fn(),
   })),
   LocationClient: jest.fn().mockImplementation(() => ({
      getLocationById: jest.fn(),
   })),
   BerryClient: jest.fn().mockImplementation(() => ({
      getBerryById: jest.fn(),
   })),
   EvolutionClient: jest.fn().mockImplementation(() => ({
      getEvolutionChainById: jest.fn(),
   })),
   GameClient: jest.fn().mockImplementation(() => ({
      getGenerationById: jest.fn(),
   })),
}));

// Mock pino logger
jest.mock("pino", () => {
   const mockLogger = {
      debug: jest.fn(),
      info: jest.fn(),
      warn: jest.fn(),
      error: jest.fn(),
   };
   return jest.fn(() => mockLogger);
});

const mockedAxios = axios as jest.Mocked<typeof axios>;

describe("HTTPClient", () => {
   let httpClient: HTTPClient;
   let mockAxiosInstance: any;

   beforeEach(() => {
      jest.clearAllMocks();
      jest.clearAllTimers();
      jest.useFakeTimers();

      // Setup axios mock
      mockAxiosInstance = {
         create: jest.fn(),
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

      mockedAxios.create.mockReturnValue(mockAxiosInstance);

      httpClient = new HTTPClient({
         enableLogging: false,
         enableCache: true,
         rateLimitRpm: 10,
      });
   });

   afterEach(() => {
      jest.useRealTimers();
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
         const customConfig = {
            baseURL: "https://custom-api.com/",
            timeout: 5000,
            maxRetries: 2,
         };

         new HTTPClient(customConfig);

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

      it("should validate configuration with zod schema", () => {
         // Test invalid URL
         expect(() => new HTTPClient({ baseURL: "invalid-url" })).toThrow();

         // Test invalid timeout
         expect(() => new HTTPClient({ timeout: -1000 })).toThrow();

         // Test invalid maxRetries
         expect(() => new HTTPClient({ maxRetries: 10 })).toThrow();
      });
   });

   describe("Request Method", () => {
      it("should make a successful request", async () => {
         const mockResponse = { data: { id: 1, name: "pikachu" } };
         mockAxiosInstance.request.mockResolvedValue(mockResponse);

         const result = await httpClient.request({ url: "/pokemon/1" });

         expect(mockAxiosInstance.request).toHaveBeenCalledWith({
            url: "/pokemon/1",
         });
         expect(result).toEqual(mockResponse.data);
      });

      it("should validate response with provided schema", async () => {
         const mockResponse = { data: { id: 1, name: "pikachu" } };
         mockAxiosInstance.request.mockResolvedValue(mockResponse);

         const schema = {
            parse: jest.fn().mockReturnValue(mockResponse.data),
         };

         const result = await httpClient.request(
            { url: "/pokemon/1" },
            schema as any
         );

         expect(schema.parse).toHaveBeenCalledWith(mockResponse.data);
         expect(result).toEqual(mockResponse.data);
      });

      it("should handle schema validation errors", async () => {
         const mockResponse = { data: { invalid: "data" } };
         mockAxiosInstance.request.mockResolvedValue(mockResponse);

         const schema = {
            parse: jest.fn().mockImplementation(() => {
               throw new Error("Validation failed");
            }),
         };

         await expect(
            httpClient.request({ url: "/pokemon/1" }, schema as any)
         ).rejects.toThrow("Invalid response format: Error: Validation failed");
      });
   });

   describe("Error Handling", () => {
      it("should format axios errors correctly", () => {
         const axiosError = {
            isAxiosError: true,
            response: {
               status: 404,
               data: { message: "Not found" },
            },
            message: "Request failed with status code 404",
            config: {
               method: "GET",
               url: "/pokemon/999",
               timeout: 10000,
            },
         };

         // Access private method for testing
         const formatError = (httpClient as any).formatError.bind(httpClient);
         const formattedError: APIError = formatError(axiosError);

         expect(formattedError).toEqual({
            code: "404",
            message: "Request failed with status code 404",
            details: "Not found",
            retryable: false,
            requestContext: {
               method: "GET",
               url: "/pokemon/999",
               timeout: 10000,
            },
         });
      });

      it("should format network errors as retryable", () => {
         const networkError = {
            isAxiosError: true,
            message: "Network Error",
            config: { method: "GET", url: "/pokemon/1" },
         };

         const formatError = (httpClient as any).formatError.bind(httpClient);
         const formattedError: APIError = formatError(networkError);

         expect(formattedError.retryable).toBe(true);
         expect(formattedError.code).toBe("NETWORK_ERROR");
      });

      it("should format unknown errors", () => {
         const unknownError = new Error("Something went wrong");

         const formatError = (httpClient as any).formatError.bind(httpClient);
         const formattedError: APIError = formatError(unknownError);

         expect(formattedError).toEqual({
            code: "UNKNOWN_ERROR",
            message: "Something went wrong",
            details: undefined,
            retryable: false,
         });
      });
   });

   describe("Rate Limiting", () => {
      it("should allow requests within rate limit", () => {
         const checkRateLimit = (httpClient as any).checkRateLimit.bind(
            httpClient
         );

         // Should allow first few requests
         for (let i = 0; i < 10; i++) {
            expect(checkRateLimit()).toBe(true);
         }
      });

      it("should block requests exceeding rate limit", () => {
         const checkRateLimit = (httpClient as any).checkRateLimit.bind(
            httpClient
         );

         // Fill up the rate limit
         for (let i = 0; i < 10; i++) {
            checkRateLimit();
         }

         // Next request should be blocked
         expect(checkRateLimit()).toBe(false);
      });

      it("should reset rate limit after time window", () => {
         const checkRateLimit = (httpClient as any).checkRateLimit.bind(
            httpClient
         );

         // Fill up the rate limit
         for (let i = 0; i < 10; i++) {
            checkRateLimit();
         }

         // Advance time by more than 1 minute
         jest.advanceTimersByTime(61000);

         // Should allow requests again
         expect(checkRateLimit()).toBe(true);
      });
   });

   describe("Caching", () => {
      it("should cache GET responses", () => {
         const setCache = (httpClient as any).setCache.bind(httpClient);
         const getFromCache = (httpClient as any).getFromCache.bind(httpClient);

         const testData = { id: 1, name: "pikachu" };
         setCache("/pokemon/1", testData);

         const cached = getFromCache("/pokemon/1");
         expect(cached).toEqual(testData);
      });

      it("should return null for expired cache entries", () => {
         const setCache = (httpClient as any).setCache.bind(httpClient);
         const getFromCache = (httpClient as any).getFromCache.bind(httpClient);

         const testData = { id: 1, name: "pikachu" };
         setCache("/pokemon/1", testData);

         // Advance time beyond cache TTL
         jest.advanceTimersByTime(400000); // 400 seconds

         const cached = getFromCache("/pokemon/1");
         expect(cached).toBeNull();
      });

      it("should clean up expired cache entries periodically", () => {
         const setCache = (httpClient as any).setCache.bind(httpClient);

         // Add some cache entries
         setCache("/pokemon/1", { id: 1 });
         setCache("/pokemon/2", { id: 2 });

         // Advance time to expire cache
         jest.advanceTimersByTime(400000);

         // Trigger cache cleanup (runs every 5 minutes)
         jest.advanceTimersByTime(300000);

         const cache = (httpClient as any).cache;
         expect(cache.size).toBe(0);
      });
   });

   describe("Utility Methods", () => {
      it("should clear cache manually", () => {
         const setCache = (httpClient as any).setCache.bind(httpClient);
         setCache("/pokemon/1", { id: 1 });

         httpClient.clearCache();

         const cache = (httpClient as any).cache;
         expect(cache.size).toBe(0);
      });

      it("should return cache statistics", () => {
         const setCache = (httpClient as any).setCache.bind(httpClient);
         setCache("/pokemon/1", { id: 1 });
         setCache("/pokemon/2", { id: 2 });

         const stats = httpClient.getCacheStats();
         expect(stats.size).toBe(2);
      });

      it("should return rate limit status", () => {
         const checkRateLimit = (httpClient as any).checkRateLimit.bind(
            httpClient
         );

         // Use up some rate limit
         checkRateLimit();
         checkRateLimit();

         const status = httpClient.getRateLimitStatus();
         expect(status.remaining).toBe(8);
         expect(status.limit).toBe(10);
         expect(typeof status.resetTime).toBe("number");
      });
   });

   describe("Health Check", () => {
      it("should perform health check on all clients", async () => {
         // Mock all the pokenode-ts clients to resolve successfully
         const mockClients = httpClient as any;
         jest
            .spyOn(mockClients.pokemonClient, "getPokemonById")
            .mockResolvedValue({});
         jest
            .spyOn(mockClients.moveClient, "getMoveById")
            .mockResolvedValue({});
         jest
            .spyOn(mockClients.itemClient, "getItemById")
            .mockResolvedValue({});
         jest
            .spyOn(mockClients.locationClient, "getLocationById")
            .mockResolvedValue({});
         jest
            .spyOn(mockClients.berryClient, "getBerryById")
            .mockResolvedValue({});
         jest
            .spyOn(mockClients.evolutionClient, "getEvolutionChainById")
            .mockResolvedValue({});
         jest
            .spyOn(mockClients.gameClient, "getGenerationById")
            .mockResolvedValue({});

         const results = await httpClient.healthCheck();

         expect(Object.keys(results)).toHaveLength(7);
         expect(Object.values(results).every(Boolean)).toBe(true);
      });

      it("should handle health check failures", async () => {
         // Mock some clients to fail
         const mockClients = httpClient as any;
         jest
            .spyOn(mockClients.pokemonClient, "getPokemonById")
            .mockRejectedValue(new Error("Failed"));
         jest
            .spyOn(mockClients.moveClient, "getMoveById")
            .mockResolvedValue({});
         jest
            .spyOn(mockClients.itemClient, "getItemById")
            .mockResolvedValue({});
         jest
            .spyOn(mockClients.locationClient, "getLocationById")
            .mockResolvedValue({});
         jest
            .spyOn(mockClients.berryClient, "getBerryById")
            .mockResolvedValue({});
         jest
            .spyOn(mockClients.evolutionClient, "getEvolutionChainById")
            .mockResolvedValue({});
         jest
            .spyOn(mockClients.gameClient, "getGenerationById")
            .mockResolvedValue({});

         const results = await httpClient.healthCheck();

         expect(results.pokemon).toBe(false);
         expect(results.move).toBe(true);
      });
   });

   describe("Client Getters", () => {
      it("should provide access to axios instance", () => {
         expect(httpClient.axios).toBeDefined();
      });

      it("should provide access to all pokenode-ts clients", () => {
         expect(httpClient.pokemon).toBeDefined();
         expect(httpClient.move).toBeDefined();
         expect(httpClient.item).toBeDefined();
         expect(httpClient.location).toBeDefined();
         expect(httpClient.berry).toBeDefined();
         expect(httpClient.evolution).toBeDefined();
         expect(httpClient.game).toBeDefined();
      });

      it("should provide clients object", () => {
         const clients = httpClient.clients;
         expect(Object.keys(clients)).toHaveLength(7);
         expect(clients.pokemon).toBeDefined();
         expect(clients.move).toBeDefined();
      });
   });

   describe("Factory Function", () => {
      it("should create HTTPClient instance with factory function", () => {
         const client = createHTTPClient({ timeout: 5000 });
         expect(client).toBeInstanceOf(HTTPClient);
      });
   });

   describe("Interceptors", () => {
      it("should setup request and response interceptors", () => {
         expect(mockAxiosInstance.interceptors.request.use).toHaveBeenCalled();
         expect(mockAxiosInstance.interceptors.response.use).toHaveBeenCalled();
      });
   });
});
