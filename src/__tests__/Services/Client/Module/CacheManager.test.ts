// __tests__/Services/Client/Module/CacheManager.test.ts
import { CacheManager } from "@/Services/Client/Module/CacheManager";
import { MainClient } from "pokenode-ts";

jest.mock("pokenode-ts");

describe("CacheManager", () => {
   let cacheManager: CacheManager;
   let mockMainClient: jest.Mocked<MainClient>;

   beforeEach(() => {
      jest.clearAllMocks();

      mockMainClient = {} as jest.Mocked<MainClient>;
      (MainClient as jest.MockedClass<typeof MainClient>).mockImplementation(
         () => mockMainClient
      );

      cacheManager = new CacheManager();
   });

   describe("Constructor", () => {
      it("should initialize with default config", () => {
         expect(MainClient).toHaveBeenCalledWith({
            cacheOptions: {
               ttl: 300000, // 5 minutes
            },
         });
      });

      it("should initialize with custom config", () => {
         const config = {
            ttl: 600000, // 10 minutes
            maxItems: 200,
         };

         new CacheManager(config);

         expect(MainClient).toHaveBeenCalledWith({
            cacheOptions: {
               ttl: 600000,
            },
         });
      });

      it("should handle initialization failure gracefully", () => {
         const consoleSpy = jest.spyOn(console, "warn").mockImplementation();

         // Mock MainClient to throw on first call, succeed on second
         (MainClient as jest.MockedClass<typeof MainClient>)
            .mockImplementationOnce(() => {
               throw new Error("Initialization failed");
            })
            .mockImplementationOnce(() => mockMainClient);

         new CacheManager();

         expect(consoleSpy).toHaveBeenCalledWith(
            "Cache initialization failed, using default client:",
            expect.any(Error)
         );
         expect(MainClient).toHaveBeenCalledTimes(2);

         consoleSpy.mockRestore();
      });
   });

   describe("getClient", () => {
      it("should return the MainClient instance", () => {
         const client = cacheManager.getClient();

         expect(client).toBe(mockMainClient);
      });
   });

   describe("clear", () => {
      it("should log cache clear message", () => {
         const consoleSpy = jest.spyOn(console, "log").mockImplementation();

         cacheManager.clear();

         expect(consoleSpy).toHaveBeenCalledWith(
            "Cache cleared - TTL-based expiration will handle cleanup"
         );

         consoleSpy.mockRestore();
      });
   });

   describe("getInfo", () => {
      it("should return cache info with default config", () => {
         const info = cacheManager.getInfo();

         expect(info).toEqual({
            ttl: "5 minutes",
            ttlMinutes: 5,
            ttlMs: 300000,
            maxItems: 100,
         });
      });

      it("should return cache info with custom config", () => {
         const customManager = new CacheManager({
            ttl: 600000, // 10 minutes
            maxItems: 200,
         });

         const info = customManager.getInfo();

         expect(info).toEqual({
            ttl: "10 minutes",
            ttlMinutes: 10,
            ttlMs: 600000,
            maxItems: 200,
         });
      });

      it("should handle fractional minutes correctly", () => {
         const customManager = new CacheManager({
            ttl: 90000, // 1.5 minutes
            maxItems: 50,
         });

         const info = customManager.getInfo();

         expect(info).toEqual({
            ttl: "1 minutes", // Math.floor(1.5) = 1
            ttlMinutes: 1,
            ttlMs: 90000,
            maxItems: 50,
         });
      });
   });

   describe("Error scenarios", () => {
      it("should handle undefined config gracefully", () => {
         const manager = new CacheManager(undefined);
         const info = manager.getInfo();

         expect(info.ttl).toBe("5 minutes");
         expect(info.maxItems).toBe(100);
      });

      it("should handle partial config", () => {
         const manager = new CacheManager({ ttl: 120000 }); // Only TTL provided
         const info = manager.getInfo();

         expect(info.ttl).toBe("2 minutes");
         expect(info.maxItems).toBe(100); // Default value
      });

      it("should handle zero TTL", () => {
         const manager = new CacheManager({ ttl: 0 });
         const info = manager.getInfo();

         expect(info.ttl).toBe("0 minutes");
         expect(info.ttlMinutes).toBe(0);
         expect(info.ttlMs).toBe(0);
      });
   });
});
