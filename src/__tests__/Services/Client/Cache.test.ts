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

describe("queryClient", () => {
   beforeEach(() => {
      queryClient.clear();
   });

   it("should be configured correctly", () => {
      expect(queryClient).toBeDefined();
      expect(typeof queryClient.setQueryData).toBe("function");
      expect(typeof queryClient.getQueryData).toBe("function");
      expect(typeof queryClient.clear).toBe("function");
      expect(typeof queryClient.invalidateQueries).toBe("function");
   });

   it("should handle basic cache operations", () => {
      const testKey = ["test", "key"];
      const testData = { test: "data" };

      // Set data
      queryClient.setQueryData(testKey, testData);

      // Get data immediately
      const retrievedData = queryClient.getQueryData(testKey);
      expect(retrievedData).toEqual(testData);
   });

   it("should handle pokemon cache keys", () => {
      const pokemonId = 1;
      const testData = { id: 1, name: "bulbasaur" };
      const cacheKey = cacheKeys.pokemon.detail(pokemonId);

      queryClient.setQueryData(cacheKey, testData);
      const retrieved = queryClient.getQueryData(cacheKey);

      expect(retrieved).toEqual(testData);
   });

   it("should clear cache correctly", () => {
      const key1 = ["test1"];
      const key2 = ["test2"];
      const data1 = { data: "first" };
      const data2 = { data: "second" };

      // Set data
      queryClient.setQueryData(key1, data1);
      queryClient.setQueryData(key2, data2);

      // Verify data exists
      expect(queryClient.getQueryData(key1)).toEqual(data1);
      expect(queryClient.getQueryData(key2)).toEqual(data2);

      // Clear cache
      queryClient.clear();

      // Verify data is cleared
      expect(queryClient.getQueryData(key1)).toBeUndefined();
      expect(queryClient.getQueryData(key2)).toBeUndefined();
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
   });

   it("should set and get cached pokemon data", () => {
      const testData = { id: 1, name: "bulbasaur" };
      const pokemonId = 1;

      // Use cacheUtils to set data
      cacheUtils.setCachedPokemon(pokemonId, testData);

      // Use cacheUtils to get data
      const cachedData = cacheUtils.getCachedPokemon(pokemonId);
      expect(cachedData).toEqual(testData);
   });

   it("should return undefined for non-existent cached data", () => {
      const cachedData = cacheUtils.getCachedPokemon(999);
      expect(cachedData).toBeUndefined();
   });

   it("should clear all cache", () => {
      const testData = { id: 1, name: "test" };
      const pokemonId = 1;

      // Set some data
      cacheUtils.setCachedPokemon(pokemonId, testData);

      // Verify data exists
      expect(cacheUtils.getCachedPokemon(pokemonId)).toEqual(testData);

      // Clear cache
      cacheUtils.clearAll();

      // Verify data is cleared
      expect(cacheUtils.getCachedPokemon(pokemonId)).toBeUndefined();
   });

   it("should handle invalidation methods", () => {
      // These should not throw errors
      expect(() => cacheUtils.invalidatePokemon()).not.toThrow();
      expect(() => cacheUtils.invalidatePokemonDetail(1)).not.toThrow();
   });
});
