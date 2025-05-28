import { cacheUtils } from "@/Services/Client/Utils/CacheUtils";
import { cacheKeys, queryClient } from "@/Services/Client/Cache";

// Example of correct usage, assuming this should be part of cacheUtils (not in test file):
// Move this to the actual implementation file, not the test file.
// If you want to mock or test this, use the correct key generator and filters object.
function invalidatePokemonDetail(pokemonId: string) {
   queryClient.removeQueries({ queryKey: cacheKeys.pokemon.detail(pokemonId) });
}
// Sample test data
const mockPokemonId = "pikachu";
const mockPokemonData = { name: "Pikachu", type: "Electric" };

// Removed misplaced function definition from test file

describe("cacheUtils", () => {
   beforeEach(() => {
      // Clear cache before each test
      queryClient.clear();
   });

   afterEach(() => {
      // Cleanup mocks and cache
      jest.clearAllMocks();
      queryClient.clear();
   });

   it("should cache and retrieve Pokémon data", () => {
      cacheUtils.setCachedPokemon(mockPokemonId, mockPokemonData);

      const data = cacheUtils.getCachedPokemon(mockPokemonId);
      expect(data).toEqual(mockPokemonData);
   });

   it("should export cached data summary", () => {
      // Set known data to cache
      cacheUtils.setCachedPokemon(mockPokemonId, mockPokemonData);

      const data = cacheUtils.exportData();
      expect(data.length).toBeGreaterThan(0);
      expect(data[0]).toHaveProperty("queryKey");
      expect(data[0]).toHaveProperty("state");
      expect(typeof data[0].dataSize).toBe("number");
      expect(typeof data[0].lastUpdated).toBe("number");
   });

   it("should return cache stats", () => {
      cacheUtils.setCachedPokemon(mockPokemonId, mockPokemonData);

      const stats = cacheUtils.getStats();
      expect(stats).toHaveProperty("queryCount");
      expect(stats).toHaveProperty("mutationCount");
      expect(stats).toHaveProperty("memoryUsage");
   });

   it("should clear all queries", () => {
      cacheUtils.setCachedPokemon(mockPokemonId, mockPokemonData);

      cacheUtils.clearAll();
      const data = cacheUtils.getCachedPokemon(mockPokemonId);
      expect(data).toBeUndefined();
   });

   it("should clear stale queries", () => {
      // You could mock query.isStale to force it to return true if needed.
      const fakeQueryKey = ["test", "stale"];
      queryClient.setQueryData(fakeQueryKey, { foo: "bar" });

      // Force the query to appear stale by modifying internal state or mocking
      const query = queryClient
         .getQueryCache()
         .find({ queryKey: fakeQueryKey });
      if (query) {
         // @ts-ignore - internal override for test only
         query.isStale = () => true;
      }

      cacheUtils.clearStale();
      const result = queryClient.getQueryData(fakeQueryKey);
      expect(result).toBeUndefined();
   });
});
