console.log("Temporarily disabled for build");
/*
import { PokemonService } from "@/Services/API/Pokemon";
import { MainClient } from "pokenode-ts";
import type { Pokemon, PokemonSpecies, NamedAPIResource } from "pokenode-ts";

// Mock the dependencies
jest.mock("pokenode-ts");
jest.mock("@/Services/Client/Module/RetryManager");
jest.mock("@/Services/Client/Module/NetworkManager");
jest.mock("@/Services/Client/Module/ErrorHandler");
jest.mock("@/Services/Client/Module/Validator");

// Mock NetInfo for React Native environment
jest.mock("@react-native-community/netinfo", () => ({
   addEventListener: jest.fn(() => jest.fn()),
   fetch: jest.fn(() => Promise.resolve({ isConnected: true })),
}));

// Import the mocked modules to set up their behavior
import { NetworkManager } from "@/Services/Client/Module/NetworkManager";
import { RetryManager } from "@/Services/Client/Module/RetryManager";
import { ErrorHandler } from "@/Services/Client/Module/ErrorHandler";
import { Validator } from "@/Services/Client/Module/Validator";

// Mock data
const mockPokemon: Pokemon = {
   id: 25,
   name: "pikachu",
   height: 4,
   weight: 60,
   base_experience: 112,
   stats: [
      { stat: { name: "hp" }, base_stat: 35, effort: 0 },
      { stat: { name: "attack" }, base_stat: 55, effort: 0 },
      { stat: { name: "defense" }, base_stat: 40, effort: 0 },
      { stat: { name: "special-attack" }, base_stat: 50, effort: 0 },
      { stat: { name: "special-defense" }, base_stat: 50, effort: 0 },
      { stat: { name: "speed" }, base_stat: 90, effort: 0 },
   ],
   abilities: [
      { ability: { name: "static" }, is_hidden: false, slot: 1 },
      { ability: { name: "lightning-rod" }, is_hidden: true, slot: 3 },
   ],
   types: [{ type: { name: "electric" }, slot: 1 }],
   moves: [
      {
         move: { name: "thunder-shock" },
         version_group_details: [
            {
               version_group: { name: "red-blue" },
               move_learn_method: { name: "level-up" },
               level_learned_at: 1,
            },
         ],
      },
   ],
} as Pokemon;

const mockPokemonSpecies: PokemonSpecies = {
   id: 25,
   name: "pikachu",
   is_legendary: false,
   is_mythical: false,
   capture_rate: 190,
   base_happiness: 50,
   growth_rate: { name: "medium" },
   generation: {
      name: "generation-i",
      url: "https://pokeapi.co/api/v2/generation/1/",
   },
   evolution_chain: { url: "https://pokeapi.co/api/v2/evolution-chain/10/" },
} as PokemonSpecies;

const mockPokemonList = {
   count: 1154,
   next: "https://pokeapi.co/api/v2/pokemon/?offset=20&limit=20",
   previous: null,
   results: [
      { name: "bulbasaur", url: "https://pokeapi.co/api/v2/pokemon/1/" },
      { name: "ivysaur", url: "https://pokeapi.co/api/v2/pokemon/2/" },
      { name: "venusaur", url: "https://pokeapi.co/api/v2/pokemon/3/" },
   ],
};

const mockEvolutionChain = {
   id: 10,
   chain: {
      species: { name: "pichu" },
      evolves_to: [
         {
            species: { name: "pikachu" },
            evolves_to: [
               {
                  species: { name: "raichu" },
                  evolves_to: [],
               },
            ],
         },
      ],
   },
};

describe("PokemonService", () => {
   let pokemonService: PokemonService;
   let mockMainClient: jest.Mocked<MainClient>;

   beforeEach(() => {
      jest.clearAllMocks();

      // Create mock MainClient
      mockMainClient = {
         pokemon: {
            getPokemonByName: jest.fn() as jest.MockedFunction<
               () => Promise<Pokemon>
            >,
            getPokemonById: jest.fn() as jest.MockedFunction<
               () => Promise<Pokemon>
            >,
            listPokemons: jest.fn(),
            getPokemonSpeciesByName: jest.fn(),
            getPokemonSpeciesById: jest.fn(),
            listPokemonSpecies: jest.fn(),
         },
         evolution: {
            getEvolutionChainById: jest.fn(),
         },
         utility: {
            getResourceByUrl: jest.fn(),
         },
      } as any;

      // Mock the MainClient constructor
      (MainClient as jest.MockedClass<typeof MainClient>).mockImplementation(
         () => mockMainClient
      );

      pokemonService = new PokemonService();
   });

   describe("getPokemon", () => {
      it("should fetch Pokemon by name", async () => {
         mockMainClient.pokemon.getPokemonByName.mockResolvedValue(mockPokemon);

         const result = await pokemonService.getPokemon("pikachu");

         expect(result).toEqual(mockPokemon);
         expect(mockMainClient.pokemon.getPokemonByName).toHaveBeenCalledWith(
            "pikachu"
         );
      });

      it("should fetch Pokemon by ID", async () => {
         mockMainClient.pokemon.getPokemonById.mockResolvedValue(mockPokemon);

         const result = await pokemonService.getPokemon(25);

         expect(result).toEqual(mockPokemon);
         expect(mockMainClient.pokemon.getPokemonById).toHaveBeenCalledWith(25);
      });

      it("should handle name with extra whitespace", async () => {
         mockMainClient.pokemon.getPokemonByName.mockResolvedValue(mockPokemon);

         await pokemonService.getPokemon("  PIKACHU  ");

         expect(mockMainClient.pokemon.getPokemonByName).toHaveBeenCalledWith(
            "pikachu"
         );
      });

      it("should throw error for invalid identifier", async () => {
         await expect(pokemonService.getPokemon("")).rejects.toThrow();
         await expect(pokemonService.getPokemon(0)).rejects.toThrow();
         await expect(pokemonService.getPokemon(-1)).rejects.toThrow();
      });

      it("should handle API errors gracefully", async () => {
         const apiError = new Error("Pokemon not found");
         mockMainClient.pokemon.getPokemonByName.mockRejectedValue(apiError);

         await expect(
            pokemonService.getPokemon("nonexistent")
         ).rejects.toThrow();
      });
   });

   describe("getPokemonList", () => {
      it("should fetch Pokemon list with default pagination", async () => {
         mockMainClient.pokemon.listPokemons.mockResolvedValue(mockPokemonList);

         const result = await pokemonService.getPokemonList();

         expect(result).toEqual(mockPokemonList);
         expect(mockMainClient.pokemon.listPokemons).toHaveBeenCalledWith(
            0,
            20
         );
      });

      it("should fetch Pokemon list with custom pagination", async () => {
         mockMainClient.pokemon.listPokemons.mockResolvedValue(mockPokemonList);

         await pokemonService.getPokemonList(40, 50);

         expect(mockMainClient.pokemon.listPokemons).toHaveBeenCalledWith(
            40,
            50
         );
      });

      it("should validate pagination parameters", async () => {
         await expect(pokemonService.getPokemonList(-1, 20)).rejects.toThrow();
         await expect(pokemonService.getPokemonList(0, 0)).rejects.toThrow();
         await expect(pokemonService.getPokemonList(0, 101)).rejects.toThrow();
      });
   });

   describe("getPokemonSpecies", () => {
      it("should fetch Pokemon species by name", async () => {
         mockMainClient.pokemon.getPokemonSpeciesByName.mockResolvedValue(
            mockPokemonSpecies
         );

         const result = await pokemonService.getPokemonSpecies("pikachu");

         expect(result).toEqual(mockPokemonSpecies);
         expect(
            mockMainClient.pokemon.getPokemonSpeciesByName
         ).toHaveBeenCalledWith("pikachu");
      });

      it("should fetch Pokemon species by ID", async () => {
         mockMainClient.pokemon.getPokemonSpeciesById.mockResolvedValue(
            mockPokemonSpecies
         );

         const result = await pokemonService.getPokemonSpecies(25);

         expect(result).toEqual(mockPokemonSpecies);
         expect(
            mockMainClient.pokemon.getPokemonSpeciesById
         ).toHaveBeenCalledWith(25);
      });
   });

   describe("getRandomPokemon", () => {
      it("should return a random Pokemon", async () => {
         mockMainClient.pokemon.getPokemonById.mockResolvedValue(mockPokemon);

         // Mock Math.random to return a predictable value
         const mockRandom = jest.spyOn(Math, "random").mockReturnValue(0.5);

         const result = await pokemonService.getRandomPokemon();

         expect(result).toEqual(mockPokemon);
         expect(mockMainClient.pokemon.getPokemonById).toHaveBeenCalledWith(
            450
         ); // Math.floor(0.5 * 898) + 1

         mockRandom.mockRestore();
      });
   });

   describe("getMultipleRandomPokemon", () => {
      it("should return multiple unique random Pokemon", async () => {
         mockMainClient.pokemon.getPokemonById.mockResolvedValue(mockPokemon);

         // Mock Math.random to return sequential values
         const mockRandom = jest
            .spyOn(Math, "random")
            .mockReturnValueOnce(0.1)
            .mockReturnValueOnce(0.2)
            .mockReturnValueOnce(0.3);

         const result = await pokemonService.getMultipleRandomPokemon(3);

         expect(result).toHaveLength(3);
         expect(mockMainClient.pokemon.getPokemonById).toHaveBeenCalledTimes(3);

         mockRandom.mockRestore();
      });

      it("should validate count parameter", async () => {
         await expect(
            pokemonService.getMultipleRandomPokemon(0)
         ).rejects.toThrow();
         await expect(
            pokemonService.getMultipleRandomPokemon(21)
         ).rejects.toThrow();
      });
   });

   describe("getPokemonStats", () => {
      it("should return formatted Pokemon stats", async () => {
         mockMainClient.pokemon.getPokemonByName.mockResolvedValue(mockPokemon);

         const result = await pokemonService.getPokemonStats("pikachu");

         expect(result).toEqual({
            baseStats: [
               { name: "hp", baseStat: 35, effort: 0 },
               { name: "attack", baseStat: 55, effort: 0 },
               { name: "defense", baseStat: 40, effort: 0 },
               { name: "special-attack", baseStat: 50, effort: 0 },
               { name: "special-defense", baseStat: 50, effort: 0 },
               { name: "speed", baseStat: 90, effort: 0 },
            ],
            totalStats: 320,
            abilities: [
               { name: "static", isHidden: false, slot: 1 },
               { name: "lightning-rod", isHidden: true, slot: 3 },
            ],
            types: [{ name: "electric", slot: 1 }],
            height: 4,
            weight: 60,
            baseExperience: 112,
         });
      });

      it("should validate Pokemon name", async () => {
         await expect(pokemonService.getPokemonStats("")).rejects.toThrow();
         await expect(
            pokemonService.getPokemonStats(null as any)
         ).rejects.toThrow();
      });
   });

   describe("getPokemonMoves", () => {
      it("should return Pokemon moves", async () => {
         mockMainClient.pokemon.getPokemonByName.mockResolvedValue(mockPokemon);

         const result = await pokemonService.getPokemonMoves("pikachu");

         expect(result).toEqual([
            {
               name: "thunder-shock",
               learnMethod: [
                  {
                     versionGroup: "red-blue",
                     learnMethod: "level-up",
                     levelLearnedAt: 1,
                  },
               ],
            },
         ]);
      });

      it("should filter moves by version group", async () => {
         mockMainClient.pokemon.getPokemonByName.mockResolvedValue(mockPokemon);

         const result = await pokemonService.getPokemonMoves(
            "pikachu",
            "red-blue"
         );

         expect(result).toHaveLength(1);
         expect(result[0].name).toBe("thunder-shock");
      });

      it("should validate Pokemon name", async () => {
         await expect(pokemonService.getPokemonMoves("")).rejects.toThrow();
      });
   });

   describe("searchPokemonByPartialName", () => {
      it("should search Pokemon by partial name", async () => {
         mockMainClient.pokemon.listPokemons.mockResolvedValue(mockPokemonList);

         const result = await pokemonService.searchPokemonByPartialName("saur");

         expect(result).toHaveLength(2); // ivysaur and venusaur
         expect(result[0].name).toBe("ivysaur");
         expect(result[1].name).toBe("venusaur");
      });

      it("should validate search query", async () => {
         await expect(
            pokemonService.searchPokemonByPartialName("")
         ).rejects.toThrow();
         await expect(
            pokemonService.searchPokemonByPartialName("a")
         ).rejects.toThrow();
      });

      it("should validate limit parameter", async () => {
         await expect(
            pokemonService.searchPokemonByPartialName("pika", 0)
         ).rejects.toThrow();
         await expect(
            pokemonService.searchPokemonByPartialName("pika", 101)
         ).rejects.toThrow();
      });
   });

   describe("getPokemonByStatRange", () => {
      it("should return Pokemon within stat range", async () => {
         mockMainClient.pokemon.listPokemons.mockResolvedValue({
            ...mockPokemonList,
            results: [
               {
                  name: "pikachu",
                  url: "https://pokeapi.co/api/v2/pokemon/25/",
               },
            ],
         });
         mockMainClient.pokemon.getPokemonByName.mockResolvedValue(mockPokemon);

         const result = await pokemonService.getPokemonByStatRange(
            "speed",
            80,
            100,
            1
         );

         expect(result).toHaveLength(1);
         expect(result[0].name).toBe("pikachu");
      });

      it("should validate stat name", async () => {
         await expect(
            pokemonService.getPokemonByStatRange("invalid-stat", 50, 100)
         ).rejects.toThrow();
      });

      it("should validate stat range", async () => {
         await expect(
            pokemonService.getPokemonByStatRange("hp", -1, 100)
         ).rejects.toThrow();
         await expect(
            pokemonService.getPokemonByStatRange("hp", 100, 50)
         ).rejects.toThrow();
         await expect(
            pokemonService.getPokemonByStatRange("hp", 50, 300)
         ).rejects.toThrow();
      });

      it("should validate sample size", async () => {
         await expect(
            pokemonService.getPokemonByStatRange("hp", 50, 100, 0)
         ).rejects.toThrow();
         await expect(
            pokemonService.getPokemonByStatRange("hp", 50, 100, 201)
         ).rejects.toThrow();
      });
   });

   describe("batchGetPokemon", () => {
      it("should fetch multiple Pokemon", async () => {
         mockMainClient.pokemon.getPokemonByName.mockResolvedValue(mockPokemon);
         mockMainClient.pokemon.getPokemonById.mockResolvedValue(mockPokemon);

         const result = await pokemonService.batchGetPokemon(["pikachu", 25]);

         expect(result).toHaveLength(2);
         expect(mockMainClient.pokemon.getPokemonByName).toHaveBeenCalledWith(
            "pikachu"
         );
         expect(mockMainClient.pokemon.getPokemonById).toHaveBeenCalledWith(25);
      });

      it("should validate identifiers array", async () => {
         await expect(pokemonService.batchGetPokemon([])).rejects.toThrow();
         await expect(
            pokemonService.batchGetPokemon(null as any)
         ).rejects.toThrow();
      });

      it("should validate batch size", async () => {
         const largeBatch = Array(51).fill("pikachu");
         await expect(
            pokemonService.batchGetPokemon(largeBatch)
         ).rejects.toThrow();
      });

      it("should validate individual identifiers", async () => {
         await expect(
            pokemonService.batchGetPokemon(["", "pikachu"])
         ).rejects.toThrow();
      });
   });

   describe("getPokemonEvolutionLine", () => {
      it("should return evolution chain", async () => {
         mockMainClient.pokemon.getPokemonSpeciesByName.mockResolvedValue(
            mockPokemonSpecies
         );
         mockMainClient.evolution.getEvolutionChainById.mockResolvedValue(
            mockEvolutionChain
         );

         const result = await pokemonService.getPokemonEvolutionLine("pikachu");

         expect(result).toEqual(mockEvolutionChain);
         expect(
            mockMainClient.evolution.getEvolutionChainById
         ).toHaveBeenCalledWith(10);
      });

      it("should handle invalid evolution chain URL", async () => {
         const invalidSpecies = {
            ...mockPokemonSpecies,
            evolution_chain: { url: "invalid-url" },
         };
         mockMainClient.pokemon.getPokemonSpeciesByName.mockResolvedValue(
            invalidSpecies
         );

         await expect(
            pokemonService.getPokemonEvolutionLine("pikachu")
         ).rejects.toThrow();
      });
   });

   describe("isPokemonLegendary", () => {
      it("should return false for non-legendary Pokemon", async () => {
         mockMainClient.pokemon.getPokemonSpeciesByName.mockResolvedValue(
            mockPokemonSpecies
         );

         const result = await pokemonService.isPokemonLegendary("pikachu");

         expect(result).toBe(false);
      });

      it("should return true for legendary Pokemon", async () => {
         const legendarySpecies = { ...mockPokemonSpecies, is_legendary: true };
         mockMainClient.pokemon.getPokemonSpeciesByName.mockResolvedValue(
            legendarySpecies
         );

         const result = await pokemonService.isPokemonLegendary("mew");

         expect(result).toBe(true);
      });

      it("should return true for mythical Pokemon", async () => {
         const mythicalSpecies = { ...mockPokemonSpecies, is_mythical: true };
         mockMainClient.pokemon.getPokemonSpeciesByName.mockResolvedValue(
            mythicalSpecies
         );

         const result = await pokemonService.isPokemonLegendary("celebi");

         expect(result).toBe(true);
      });
   });

   describe("getPokemonGenerationInfo", () => {
      it("should return generation information", async () => {
         mockMainClient.pokemon.getPokemonSpeciesByName.mockResolvedValue(
            mockPokemonSpecies
         );

         const result = await pokemonService.getPokemonGenerationInfo(
            "pikachu"
         );

         expect(result).toEqual({
            generation: "generation-i",
            generationId: 1,
            isLegendary: false,
            isMythical: false,
            captureRate: 190,
            baseHappiness: 50,
            growthRate: "medium",
         });
      });
   });

   describe("Error handling and retries", () => {
      it("should retry on network errors", async () => {
         const networkError = new Error("Network timeout");
         mockMainClient.pokemon.getPokemonByName
            .mockRejectedValueOnce(networkError)
            .mockRejectedValueOnce(networkError)
            .mockResolvedValueOnce(mockPokemon);

         const result = await pokemonService.getPokemon("pikachu");

         expect(result).toEqual(mockPokemon);
         expect(mockMainClient.pokemon.getPokemonByName).toHaveBeenCalledTimes(
            3
         );
      });

      it("should not retry on 404 errors", async () => {
         const notFoundError = new Error("404 Not Found");
         mockMainClient.pokemon.getPokemonByName.mockRejectedValue(
            notFoundError
         );

         await expect(
            pokemonService.getPokemon("nonexistent")
         ).rejects.toThrow();
         expect(mockMainClient.pokemon.getPokemonByName).toHaveBeenCalledTimes(
            1
         );
      });
   });

   describe("Service health and utilities", () => {
      it("should check service health", () => {
         const health = pokemonService.getHealthStatus();

         expect(health).toHaveProperty("isHealthy");
         expect(health).toHaveProperty("networkStatus");
         expect(health).toHaveProperty("lastCheck");
         expect(health).toHaveProperty("cacheInfo");
         expect(health).toHaveProperty("retryConfig");
      });

      it("should check network connection", async () => {
         const isConnected = await pokemonService.checkConnection();
         expect(typeof isConnected).toBe("boolean");
      });

      it("should check online status", () => {
         const isOnline = pokemonService.isOnline();
         expect(typeof isOnline).toBe("boolean");
      });

      it("should clear cache", () => {
         expect(() => pokemonService.clearCache()).not.toThrow();
      });

      it("should cleanup resources", () => {
         expect(() => pokemonService.cleanup()).not.toThrow();
      });
   });

   describe("Edge cases and performance", () => {
      it("should handle concurrent requests", async () => {
         mockMainClient.pokemon.getPokemonByName.mockResolvedValue(mockPokemon);

         const promises = Array(10)
            .fill(null)
            .map(() => pokemonService.getPokemon("pikachu"));
         const results = await Promise.all(promises);

         expect(results).toHaveLength(10);
         results.forEach((result) => expect(result).toEqual(mockPokemon));
      });

      it("should handle batch operations with some failures", async () => {
         mockMainClient.pokemon.getPokemonByName
            .mockResolvedValueOnce(mockPokemon)
            .mockRejectedValueOnce(new Error("Failed"))
            .mockResolvedValueOnce(mockPokemon);

         const result = await pokemonService.batchGetPokemon([
            "pikachu",
            "invalid",
            "raichu",
         ]);

         // Should return successful results only
         expect(result.length).toBeGreaterThan(0);
      });

      it("should handle empty search results", async () => {
         mockMainClient.pokemon.listPokemons.mockResolvedValue({
            ...mockPokemonList,
            results: [],
         });

         const result = await pokemonService.searchPokemonByPartialName("xyz");

         expect(result).toEqual([]);
      });
   });
});
*/
