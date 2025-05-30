// src/__tests__/Services/Client/Cache.test.ts

import {
   CACHE_CONFIG,
   cacheKeys,
   cacheUtils,
   queryClient,
} from "@/Services/Client/Cache";

/**
 * @file Unit tests for Cache service configuration, cache key generation,
 * query client behavior, and utility functions.
 */

/**
 * Test suite for verifying CACHE_CONFIG constants.
 */
describe("CACHE_CONFIG", () => {
   /**
    * Ensures CACHE_CONFIG has required properties with valid types and values.
    */
   it("should have valid cache time configurations", () => {
      expect(CACHE_CONFIG).toHaveProperty("CACHE_TIME");
      expect(CACHE_CONFIG).toHaveProperty("STALE_TIME");
      expect(CACHE_CONFIG).toHaveProperty("RETRY_COUNT");
      expect(CACHE_CONFIG).toHaveProperty("VERSION");

      expect(typeof CACHE_CONFIG.CACHE_TIME).toBe("number");
      expect(typeof CACHE_CONFIG.STALE_TIME).toBe("number");
      expect(typeof CACHE_CONFIG.RETRY_COUNT).toBe("number");
      expect(typeof CACHE_CONFIG.VERSION).toBe("string");

      expect(CACHE_CONFIG.STALE_TIME).toBeGreaterThan(0);
      expect(CACHE_CONFIG.CACHE_TIME).toBeGreaterThan(CACHE_CONFIG.STALE_TIME);
      expect(CACHE_CONFIG.RETRY_COUNT).toBeGreaterThanOrEqual(0);
   });

   /**
    * Ensures CACHE_CONFIG.VERSION follows a semantic version format.
    */
   it("should have version string", () => {
      expect(CACHE_CONFIG.VERSION).toMatch(/^v\d+\.\d+$/);
   });
});

/**
 * Test suite for validating the cache key generation logic.
 */
describe("cacheKeys", () => {
   /**
    * Tests cache key generation for Pokémon-related data.
    */
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

   /**
    * Tests cache key generation for Pokémon types.
    */
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

   /**
    * Tests cache key generation for moves.
    */
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

   /**
    * Tests cache key for preferences.
    */
   it("should have preferences cache key", () => {
      expect(cacheKeys.preferences).toEqual([
         "preferences",
         CACHE_CONFIG.VERSION,
      ]);
   });
});

/**
 * Test suite for queryClient behavior.
 */
describe("queryClient", () => {
   beforeEach(() => {
      queryClient.clear();
   });

   /**
    * Validates the queryClient instance structure and methods.
    */
   it("should be configured correctly", () => {
      expect(queryClient).toBeDefined();
      expect(typeof queryClient.setQueryData).toBe("function");
      expect(typeof queryClient.getQueryData).toBe("function");
      expect(typeof queryClient.clear).toBe("function");
      expect(typeof queryClient.invalidateQueries).toBe("function");
   });

   /**
    * Verifies basic set/get functionality of the queryClient.
    */
   it("should handle basic cache operations", () => {
      const testKey = ["test", "key"];
      const testData = { test: "data" };

      queryClient.setQueryData(testKey, testData);
      const retrievedData = queryClient.getQueryData(testKey);
      expect(retrievedData).toEqual(testData);
   });

   /**
    * Ensures that queryClient works with Pokémon detail keys.
    */
   it("should handle pokemon cache keys", () => {
      const pokemonId = 1;
      const testData = { id: 1, name: "bulbasaur" };
      const cacheKey = cacheKeys.pokemon.detail(pokemonId);

      queryClient.setQueryData(cacheKey, testData);
      const retrieved = queryClient.getQueryData(cacheKey);
      expect(retrieved).toEqual(testData);
   });

   /**
    * Verifies that the clear method removes all cached entries.
    */
   it("should clear cache correctly", () => {
      const key1 = ["test1"];
      const key2 = ["test2"];
      const data1 = { data: "first" };
      const data2 = { data: "second" };

      queryClient.setQueryData(key1, data1);
      queryClient.setQueryData(key2, data2);

      expect(queryClient.getQueryData(key1)).toEqual(data1);
      expect(queryClient.getQueryData(key2)).toEqual(data2);

      queryClient.clear();

      expect(queryClient.getQueryData(key1)).toBeUndefined();
      expect(queryClient.getQueryData(key2)).toBeUndefined();
   });
});

/**
 * Test suite for cache utility helper functions.
 */
describe("cacheUtils", () => {
   beforeEach(() => {
      queryClient.clear();
   });

   /**
    * Checks that cache utility methods are defined.
    */
   it("should provide cache manipulation methods", () => {
      expect(typeof cacheUtils.invalidatePokemon).toBe("function");
      expect(typeof cacheUtils.invalidatePokemonDetail).toBe("function");
      expect(typeof cacheUtils.getCachedPokemon).toBe("function");
      expect(typeof cacheUtils.setCachedPokemon).toBe("function");
      expect(typeof cacheUtils.clearAll).toBe("function");
   });

   /**
    * Validates storing and retrieving cached Pokémon data.
    */
   it("should set and get cached pokemon data", () => {
      const testData = { id: 1, name: "bulbasaur" };
      const pokemonId = 1;

      cacheUtils.setCachedPokemon(pokemonId, testData);
      const cachedData = cacheUtils.getCachedPokemon(pokemonId);
      expect(cachedData).toEqual(testData);
   });

   /**
    * Verifies behavior when retrieving nonexistent data.
    */
   it("should return undefined for non-existent cached data", () => {
      const cachedData = cacheUtils.getCachedPokemon(999);
      expect(cachedData).toBeUndefined();
   });

   /**
    * Tests full cache clear functionality.
    */
   it("should clear all cache", () => {
      const testData = { id: 1, name: "test" };
      const pokemonId = 1;

      cacheUtils.setCachedPokemon(pokemonId, testData);
      expect(cacheUtils.getCachedPokemon(pokemonId)).toEqual(testData);

      cacheUtils.clearAll();
      expect(cacheUtils.getCachedPokemon(pokemonId)).toBeUndefined();
   });

   /**
    * Ensures cache invalidation methods execute without throwing.
    */
   it("should handle invalidation methods", () => {
      expect(() => cacheUtils.invalidatePokemon()).not.toThrow();
      expect(() => cacheUtils.invalidatePokemonDetail(1)).not.toThrow();
   });
});
