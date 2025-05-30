// src/__tests__/Services/Client/Cache.test.ts
import {
   CACHE_CONFIG,
   cacheKeys,
   cacheUtils,
   queryClient,
} from "@/Services/Client/Cache";

describe("CACHE_CONFIG", () => {
   it("should have valid cache time configurations", () => {
      expect(CACHE_CONFIG).toHaveProperty("CACHE_TIME");
      expect(CACHE_CONFIG).toHaveProperty("STALE_TIME");
      expect(CACHE_CONFIG).toHaveProperty("RETRY_COUNT");
      expect(CACHE_CONFIG).toHaveProperty("VERSION");

      // Check that times are numbers
      expect(typeof CACHE_CONFIG.CACHE_TIME).toBe("number");
      expect(typeof CACHE_CONFIG.STALE_TIME).toBe("number");
      expect(typeof CACHE_CONFIG.RETRY_COUNT).toBe("number");
      expect(typeof CACHE_CONFIG.VERSION).toBe("string");

      // Check reasonable values
      expect(CACHE_CONFIG.STALE_TIME).toBeGreaterThan(0);
      expect(CACHE_CONFIG.CACHE_TIME).toBeGreaterThan(CACHE_CONFIG.STALE_TIME);
      expect(CACHE_CONFIG.RETRY_COUNT).toBeGreaterThanOrEqual(0);
   });

   it("should have version string", () => {
      expect(CACHE_CONFIG.VERSION).toMatch(/^v\d+\.\d+$/);
   });
});

describe("cacheKeys", () => {
   it("should generate correct pokemon cache keys", () => {
      expect(cacheKeys.pokemon.all).toEqual(["pokemon", CACHE_CONFIG.VERSION]);
      expect(cacheKeys.pokemon.list()).toEqual([
         "pokemon",
         CACHE_CONFIG.VERSION,
         "list",
      ]);
      expect(cacheKeys.pokemon.detail(1)).toEqual([
         "pokemon",
         CACHE_CONFIG.VERSION,
         "detail",
         "1",
      ]);
      expect(cacheKeys.pokemon.search("pikachu", 10)).toEqual([
         "pokemon",
         CACHE_CONFIG.VERSION,
         "search",
         "pikachu",
         10,
      ]);
   });

   it("should generate correct type cache keys", () => {
      expect(cacheKeys.types.all).toEqual(["types", CACHE_CONFIG.VERSION]);
      expect(cacheKeys.types.list()).toEqual([
         "types",
         CACHE_CONFIG.VERSION,
         "list",
      ]);
      expect(cacheKeys.types.detail("fire")).toEqual([
         "types",
         CACHE_CONFIG.VERSION,
         "detail",
         "fire",
      ]);
   });

   it("should generate correct move cache keys", () => {
      expect(cacheKeys.moves.all).toEqual(["moves", CACHE_CONFIG.VERSION]);
      expect(cacheKeys.moves.list()).toEqual([
         "moves",
         CACHE_CONFIG.VERSION,
         "list",
      ]);
      expect(cacheKeys.moves.detail(1)).toEqual([
         "moves",
         CACHE_CONFIG.VERSION,
         "detail",
         "1",
      ]);
   });

   it("should have preferences cache key", () => {
      expect(cacheKeys.preferences).toEqual([
         "preferences",
         CACHE_CONFIG.VERSION,
      ]);
   });
});

describe("cacheUtils", () => {
   beforeEach(() => {
      queryClient.clear();
   });

   it("should provide cache manipulation methods", () => {
      expect(typeof cacheUtils.invalidatePokemon).toBe("function");
      expect(typeof cacheUtils.invalidatePokemonDetail).toBe("function");
      expect(typeof cacheUtils.getCachedPokemon).toBe("function");
      expect(typeof cacheUtils.setCachedPokemon).toBe("function");
      expect(typeof cacheUtils.clearAll).toBe("function");
      expect(typeof cacheUtils.getCacheStats).toBe("function");
   });

   it("should set and get cached pokemon data", () => {
      const testData = { id: 1, name: "bulbasaur" };

      cacheUtils.setCachedPokemon(1, testData);
      const cachedData = cacheUtils.getCachedPokemon(1);

      expect(cachedData).toEqual(testData);
   });

   it("should return undefined for non-existent cached data", () => {
      const cachedData = cacheUtils.getCachedPokemon(999);
      expect(cachedData).toBeUndefined();
   });

   it("should provide cache stats", () => {
      const stats = cacheUtils.getCacheStats();

      expect(stats).toHaveProperty("queryCount");
      expect(stats).toHaveProperty("mutationCount");
      expect(typeof stats.queryCount).toBe("number");
      expect(typeof stats.mutationCount).toBe("number");
   });

   it("should clear all cache", () => {
      // Add some data
      cacheUtils.setCachedPokemon(1, { id: 1, name: "test" });

      // Verify data exists
      expect(cacheUtils.getCachedPokemon(1)).toBeDefined();

      // Clear cache
      cacheUtils.clearAll();

      // Verify data is cleared
      expect(cacheUtils.getCachedPokemon(1)).toBeUndefined();
   });
});

describe("queryClient", () => {
   it("should be configured correctly", () => {
      expect(queryClient).toBeDefined();

      const defaultOptions = queryClient.getDefaultOptions();
      expect(defaultOptions.queries?.staleTime).toBe(CACHE_CONFIG.STALE_TIME);
      expect(defaultOptions.queries?.gcTime).toBe(CACHE_CONFIG.CACHE_TIME);
   });
});
