// __tests__/Services/Client/MainClient.test.ts
import { BaseService } from "@/Services/Client/MainClient";
import { MainClient } from "pokenode-ts";
import { RetryManager } from "@/Services/Client/Module/RetryManager";
import { NetworkManager } from "@/Services/Client/Module/NetworkManager";
import { ErrorHandler } from "@/Services/Client/Module/ErrorHandler";
import { Validator } from "@/Services/Client/Module/Validator";
import { UrlUtils } from "@/Services/Client/Module/UrlUtils";

// Mock all dependencies
jest.mock("pokenode-ts");
jest.mock("@/Services/Client/Module/RetryManager");
jest.mock("@/Services/Client/Module/NetworkManager");
jest.mock("@/Services/Client/Module/ErrorHandler");
jest.mock("@/Services/Client/Module/Validator");
jest.mock("@/Services/Client/Module/UrlUtils");

describe("BaseService", () => {
   let baseService: BaseService;
   let mockMainClient: jest.Mocked<MainClient>;
   let mockRetryManager: jest.Mocked<RetryManager>;
   let mockNetworkManager: jest.Mocked<NetworkManager>;

   beforeEach(() => {
      // Reset all mocks
      jest.clearAllMocks();

      // Setup MainClient mock
      mockMainClient = new MainClient() as jest.Mocked<MainClient>;
      (MainClient as jest.MockedClass<typeof MainClient>).mockImplementation(
         () => mockMainClient
      );

      // Setup RetryManager mock
      mockRetryManager = {
         executeWithRetry: jest.fn(),
      } as any;
      (
         RetryManager as jest.MockedClass<typeof RetryManager>
      ).mockImplementation(() => mockRetryManager);

      // Setup NetworkManager mock
      mockNetworkManager = {
         checkConnection: jest.fn().mockResolvedValue(true),
         isOnline: jest.fn().mockReturnValue(true),
         cleanup: jest.fn(),
      } as any;
      (
         NetworkManager as jest.MockedClass<typeof NetworkManager>
      ).mockImplementation(() => mockNetworkManager);

      // Setup ErrorHandler mock
      (ErrorHandler.handle as jest.Mock).mockReturnValue({
         message: "Test error",
         isRetryable: false,
         userMessage: "Something went wrong",
      });

      baseService = new BaseService();
   });

   describe("Constructor", () => {
      it("should initialize with default config", () => {
         // Clear the call count from beforeEach setup
         jest.clearAllMocks();

         // Create a new instance to test
         new BaseService();

         expect(MainClient).toHaveBeenCalledWith({
            cacheOptions: { ttl: 300000 }, // 5 minutes
         });
         expect(RetryManager).toHaveBeenCalledWith(3, 1000);
         expect(NetworkManager).toHaveBeenCalled();
      });

      it("should initialize with custom config", () => {
         // Clear the call count from beforeEach setup
         jest.clearAllMocks();

         const config = {
            maxRetries: 5,
            retryDelay: 2000,
            cacheTimeout: 600000,
         };

         new BaseService(config);

         expect(MainClient).toHaveBeenCalledWith({
            cacheOptions: { ttl: 600000 },
         });
         expect(RetryManager).toHaveBeenCalledWith(5, 2000);
      });

      it("should handle cache initialization failure", () => {
         // Clear the call count from beforeEach setup
         jest.clearAllMocks();

         const consoleSpy = jest.spyOn(console, "warn").mockImplementation();

         // Setup the mock to fail on first call, succeed on second
         (MainClient as jest.MockedClass<typeof MainClient>)
            .mockImplementationOnce(() => {
               throw new Error("Cache failed");
            })
            .mockImplementationOnce(() => mockMainClient);

         new BaseService();

         expect(consoleSpy).toHaveBeenCalledWith(
            "Cache initialization failed, using fallback:",
            expect.any(Error)
         );
         expect(MainClient).toHaveBeenCalledTimes(2);

         consoleSpy.mockRestore();
      });
   });

   describe("executeWithErrorHandling", () => {
      it("should execute operation successfully", async () => {
         const operation = jest.fn().mockResolvedValue("success");
         mockRetryManager.executeWithRetry.mockResolvedValue("success");

         const result = await baseService["executeWithErrorHandling"](
            operation
         );

         expect(mockNetworkManager.checkConnection).toHaveBeenCalled();
         expect(mockRetryManager.executeWithRetry).toHaveBeenCalledWith(
            operation,
            undefined
         );
         expect(result).toBe("success");
      });

      it("should throw error when no network connection", async () => {
         mockNetworkManager.checkConnection.mockResolvedValue(false);
         const operation = jest.fn();

         await expect(
            baseService["executeWithErrorHandling"](operation)
         ).rejects.toThrow("No network connection available");

         expect(operation).not.toHaveBeenCalled();
      });

      it("should handle and transform errors", async () => {
         const operation = jest.fn();
         const originalError = new Error("Original error");
         mockRetryManager.executeWithRetry.mockRejectedValue(originalError);

         await expect(
            baseService["executeWithErrorHandling"](operation, "Test context")
         ).rejects.toThrow("Something went wrong");

         expect(ErrorHandler.handle).toHaveBeenCalledWith(
            originalError,
            "Test context"
         );
      });
   });

   describe("batchOperation", () => {
      it("should handle empty array", async () => {
         const result = await baseService["batchOperation"]([], jest.fn());
         expect(result).toEqual([]);
      });

      it("should handle null/undefined items", async () => {
         const result = await baseService["batchOperation"](
            null as any,
            jest.fn()
         );
         expect(result).toEqual([]);
      });

      it("should process items in batches", async () => {
         const items = [1, 2, 3, 4, 5];
         const operation = jest
            .fn()
            .mockImplementation((item) => Promise.resolve(item * 2));
         (Validator.validateArray as jest.Mock).mockImplementation(() => {});

         const result = await baseService["batchOperation"](
            items,
            operation,
            2
         );

         expect(Validator.validateArray).toHaveBeenCalledWith(
            items,
            "Batch items"
         );
         expect(operation).toHaveBeenCalledTimes(5);
         expect(result).toEqual([2, 4, 6, 8, 10]);
      });

      it("should handle partial failures", async () => {
         const items = [1, 2, 3];
         const operation = jest
            .fn()
            .mockResolvedValueOnce(2)
            .mockRejectedValueOnce(new Error("Failed"))
            .mockResolvedValueOnce(6);
         (Validator.validateArray as jest.Mock).mockImplementation(() => {});
         const consoleSpy = jest.spyOn(console, "warn").mockImplementation();

         const result = await baseService["batchOperation"](items, operation);

         expect(result).toEqual([2, 6]);
         expect(consoleSpy).toHaveBeenCalledWith(
            "Batch completed with 1/3 errors"
         );

         consoleSpy.mockRestore();
      });

      it("should limit concurrency to maximum of 5", async () => {
         const items = [1, 2, 3];
         const operation = jest.fn().mockResolvedValue(1);
         (Validator.validateArray as jest.Mock).mockImplementation(() => {});

         await baseService["batchOperation"](items, operation, 10);

         // Should still work with high concurrency, just capped at 5
         expect(operation).toHaveBeenCalledTimes(3);
      });
   });

   describe("Validation methods", () => {
      it("should validate identifier", () => {
         (Validator.validateIdentifier as jest.Mock).mockImplementation(
            () => {}
         );

         baseService["validateIdentifier"]("pikachu", "Pokemon");

         expect(Validator.validateIdentifier).toHaveBeenCalledWith(
            "pikachu",
            "Pokemon"
         );
      });

      it("should validate pagination params", () => {
         (Validator.validatePaginationParams as jest.Mock).mockImplementation(
            () => {}
         );

         baseService["validatePaginationParams"](0, 20);

         expect(Validator.validatePaginationParams).toHaveBeenCalledWith(0, 20);
      });
   });

   describe("URL utility methods", () => {
      it("should extract ID from URL", () => {
         (UrlUtils.extractIdFromUrl as jest.Mock).mockReturnValue(25);

         const result = baseService["extractIdFromUrl"](
            "https://pokeapi.co/api/v2/pokemon/25/"
         );

         expect(UrlUtils.extractIdFromUrl).toHaveBeenCalledWith(
            "https://pokeapi.co/api/v2/pokemon/25/"
         );
         expect(result).toBe(25);
      });

      it("should extract name from URL", () => {
         (UrlUtils.extractNameFromUrl as jest.Mock).mockReturnValue("pikachu");

         const result = baseService["extractNameFromUrl"](
            "https://pokeapi.co/api/v2/pokemon/pikachu/"
         );

         expect(UrlUtils.extractNameFromUrl).toHaveBeenCalledWith(
            "https://pokeapi.co/api/v2/pokemon/pikachu/"
         );
         expect(result).toBe("pikachu");
      });

      it("should build API URL", () => {
         (UrlUtils.buildApiUrl as jest.Mock).mockReturnValue(
            "https://pokeapi.co/api/v2/pokemon/25/"
         );

         const result = baseService["buildApiUrl"]("pokemon", 25);

         expect(UrlUtils.buildApiUrl).toHaveBeenCalledWith("pokemon", 25);
         expect(result).toBe("https://pokeapi.co/api/v2/pokemon/25/");
      });

      it("should validate API URL", () => {
         (UrlUtils.isValidApiUrl as jest.Mock).mockReturnValue(true);

         const result = baseService["isValidApiUrl"](
            "https://pokeapi.co/api/v2/pokemon/"
         );

         expect(UrlUtils.isValidApiUrl).toHaveBeenCalledWith(
            "https://pokeapi.co/api/v2/pokemon/"
         );
         expect(result).toBe(true);
      });
   });

   describe("Utility methods", () => {
      it("should check if online", () => {
         const result = baseService.isOnline();

         expect(mockNetworkManager.isOnline).toHaveBeenCalled();
         expect(result).toBe(true);
      });

      it("should check connection", async () => {
         const result = await baseService.checkConnection();

         expect(mockNetworkManager.checkConnection).toHaveBeenCalled();
         expect(result).toBe(true);
      });

      it("should get health status", () => {
         const result = baseService.getHealthStatus();

         expect(result).toEqual({
            isHealthy: true,
            networkStatus: true,
            lastCheck: expect.any(String),
            cacheInfo: {
               ttl: 300000,
               maxItems: 100,
            },
            retryConfig: {
               attempts: 3,
               delay: 1000,
            },
         });
      });

      it("should clear cache", () => {
         const consoleSpy = jest.spyOn(console, "log").mockImplementation();

         baseService.clearCache();

         expect(consoleSpy).toHaveBeenCalledWith(
            "Cache clear requested - will expire naturally via TTL"
         );

         consoleSpy.mockRestore();
      });

      it("should cleanup resources", () => {
         baseService.cleanup();

         expect(mockNetworkManager.cleanup).toHaveBeenCalled();
      });
   });
});
