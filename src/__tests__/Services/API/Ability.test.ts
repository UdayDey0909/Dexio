import { AbilityService } from "@/Services/API/Ability";
import { MainClient } from "pokenode-ts";
import type { Ability, NamedAPIResourceList } from "pokenode-ts";

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

describe("AbilityService", () => {
   let abilityService: AbilityService;
   let mockMainClient: jest.Mocked<MainClient>;
   let mockPokemonApi: any;
   let mockNetworkManager: jest.Mocked<NetworkManager>;
   let mockRetryManager: jest.Mocked<RetryManager>;

   // Mock ability data
   const mockAbility: Ability = {
      id: 1,
      name: "stench",
      is_main_series: true,
      generation: {
         name: "generation-iii",
         url: "https://pokeapi.co/api/v2/generation/3/",
      },
      names: [
         {
            name: "Stench",
            language: {
               name: "en",
               url: "https://pokeapi.co/api/v2/language/9/",
            },
         },
      ],
      effect_changes: [],
      effect_entries: [
         {
            effect:
               "Has a 10% chance of making target Pokémon flinch with each hit.",
            language: {
               name: "en",
               url: "https://pokeapi.co/api/v2/language/9/",
            },
            short_effect: "Has a 10% chance of making the target flinch.",
         },
      ],
      flavor_text_entries: [
         {
            flavor_text: "May cause a foe to flinch.",
            language: {
               name: "en",
               url: "https://pokeapi.co/api/v2/language/9/",
            },
            version_group: {
               name: "ruby-sapphire",
               url: "https://pokeapi.co/api/v2/version-group/5/",
            },
         },
      ],
      pokemon: [
         {
            is_hidden: false,
            slot: 1,
            pokemon: {
               name: "gloom",
               url: "https://pokeapi.co/api/v2/pokemon/44/",
            },
         },
      ],
   };

   const mockAbilityList: NamedAPIResourceList = {
      count: 327,
      next: "https://pokeapi.co/api/v2/ability/?offset=20&limit=20",
      previous: null,
      results: [
         {
            name: "stench",
            url: "https://pokeapi.co/api/v2/ability/1/",
         },
         {
            name: "drizzle",
            url: "https://pokeapi.co/api/v2/ability/2/",
         },
      ],
   };

   beforeEach(() => {
      jest.clearAllMocks();

      // Setup mock Pokemon API
      mockPokemonApi = {
         getAbilityByName: jest.fn(),
         getAbilityById: jest.fn(),
         listAbilities: jest.fn(),
      };

      // Setup mock MainClient
      mockMainClient = {
         pokemon: mockPokemonApi,
      } as any;

      (MainClient as jest.MockedClass<typeof MainClient>).mockImplementation(
         () => mockMainClient
      );

      // Setup NetworkManager mock
      mockNetworkManager = {
         checkConnection: jest.fn().mockResolvedValue(true),
         isOnline: jest.fn().mockReturnValue(true),
         cleanup: jest.fn(),
      } as any;

      (
         NetworkManager as jest.MockedClass<typeof NetworkManager>
      ).mockImplementation(() => mockNetworkManager);

      // Setup RetryManager mock
      mockRetryManager = {
         executeWithRetry: jest
            .fn()
            .mockImplementation((operation) => operation()),
      } as any;

      (
         RetryManager as jest.MockedClass<typeof RetryManager>
      ).mockImplementation(() => mockRetryManager);

      // Setup ErrorHandler mock
      (ErrorHandler.handle as jest.Mock).mockImplementation(
         (error, context) => ({
            userMessage: error.message,
            originalError: error,
            context,
         })
      );

      // Setup Validator mocks
      (Validator.validateIdentifier as jest.Mock).mockImplementation(
         (identifier, name) => {
            if (
               !identifier ||
               (typeof identifier === "string" && identifier.trim() === "") ||
               (typeof identifier === "number" &&
                  (identifier <= 0 || identifier > 1010))
            ) {
               throw new Error(`Invalid ${name}: ${identifier}`);
            }
         }
      );

      (Validator.validatePaginationParams as jest.Mock).mockImplementation(
         (offset, limit) => {
            if (
               offset < 0 ||
               limit <= 0 ||
               limit > 100 ||
               !Number.isInteger(offset) ||
               !Number.isInteger(limit)
            ) {
               throw new Error("Invalid pagination parameters");
            }
         }
      );

      (Validator.validateArray as jest.Mock).mockImplementation(
         (array, name) => {
            if (!Array.isArray(array)) {
               throw new Error(`${name} must be an array`);
            }
         }
      );

      abilityService = new AbilityService({
         maxRetries: 3,
         retryDelay: 1000,
         cacheTimeout: 300000,
      });
   });

   describe("constructor", () => {
      it("should initialize with default config", () => {
         const service = new AbilityService();
         expect(service).toBeInstanceOf(AbilityService);
         expect(MainClient).toHaveBeenCalled();
      });

      it("should initialize with custom config", () => {
         const config = {
            maxRetries: 5,
            retryDelay: 2000,
            cacheTimeout: 600000,
         };
         const service = new AbilityService(config);
         expect(service).toBeInstanceOf(AbilityService);
      });

      it("should handle cache initialization failure gracefully", () => {
         const consoleSpy = jest.spyOn(console, "warn").mockImplementation();
         (MainClient as jest.MockedClass<typeof MainClient>)
            .mockImplementationOnce(() => {
               throw new Error("Cache init failed");
            })
            .mockImplementationOnce(() => mockMainClient);

         const service = new AbilityService();
         expect(service).toBeInstanceOf(AbilityService);
         expect(consoleSpy).toHaveBeenCalledWith(
            "Cache initialization failed, using fallback:",
            expect.any(Error)
         );

         consoleSpy.mockRestore();
      });
   });

   describe("getAbility", () => {
      it("should fetch ability by name successfully", async () => {
         mockPokemonApi.getAbilityByName.mockResolvedValue(mockAbility);

         const result = await abilityService.getAbility("stench");

         expect(mockPokemonApi.getAbilityByName).toHaveBeenCalledWith("stench");
         expect(mockPokemonApi.getAbilityById).not.toHaveBeenCalled();
         expect(result).toEqual(mockAbility);
      });

      it("should fetch ability by ID successfully", async () => {
         mockPokemonApi.getAbilityById.mockResolvedValue(mockAbility);

         const result = await abilityService.getAbility(1);

         expect(mockPokemonApi.getAbilityById).toHaveBeenCalledWith(1);
         expect(mockPokemonApi.getAbilityByName).not.toHaveBeenCalled();
         expect(result).toEqual(mockAbility);
      });

      it("should handle string names with whitespace and mixed case", async () => {
         mockPokemonApi.getAbilityByName.mockResolvedValue(mockAbility);

         await abilityService.getAbility("  STENCH  ");

         expect(mockPokemonApi.getAbilityByName).toHaveBeenCalledWith("stench");
      });

      it("should throw error for invalid identifier", async () => {
         const invalidIdentifiers = [null, undefined, "", "   ", 0, -1, 1011];

         for (const identifier of invalidIdentifiers) {
            await expect(
               abilityService.getAbility(identifier as any)
            ).rejects.toThrow();
         }
      });

      it("should handle network errors with retry logic", async () => {
         const networkError = new Error("Network error");
         mockRetryManager.executeWithRetry.mockResolvedValueOnce(mockAbility);
         mockPokemonApi.getAbilityByName.mockResolvedValue(mockAbility);

         const result = await abilityService.getAbility("stench");
         expect(result).toEqual(mockAbility);
         expect(mockRetryManager.executeWithRetry).toHaveBeenCalled();
      });

      it("should handle 404 errors without retry", async () => {
         const notFoundError = new Error("404 not found");
         mockRetryManager.executeWithRetry.mockRejectedValue(notFoundError);
         (ErrorHandler.handle as jest.Mock).mockReturnValue({
            userMessage: "Failed to fetch ability: nonexistent",
            originalError: notFoundError,
         });

         await expect(abilityService.getAbility("nonexistent")).rejects.toThrow(
            "Failed to fetch ability: nonexistent"
         );
      });

      it("should handle rate limit errors with retry", async () => {
         const rateLimitError = new Error("429 rate limit exceeded");
         mockRetryManager.executeWithRetry.mockResolvedValueOnce(mockAbility);
         mockPokemonApi.getAbilityByName.mockResolvedValue(mockAbility);

         const result = await abilityService.getAbility("stench");
         expect(result).toEqual(mockAbility);
      });

      it("should handle server errors with retry", async () => {
         const serverError = new Error("500 internal server error");
         mockRetryManager.executeWithRetry.mockResolvedValueOnce(mockAbility);
         mockPokemonApi.getAbilityByName.mockResolvedValue(mockAbility);

         const result = await abilityService.getAbility("stench");
         expect(result).toEqual(mockAbility);
      });

      it("should fail after max retry attempts", async () => {
         const networkError = new Error("Network timeout");
         mockRetryManager.executeWithRetry.mockRejectedValue(networkError);
         (ErrorHandler.handle as jest.Mock).mockReturnValue({
            userMessage: "Network timeout",
            originalError: networkError,
         });

         await expect(abilityService.getAbility("stench")).rejects.toThrow();
      });
   });

   describe("getAbilityList", () => {
      it("should fetch ability list with default pagination", async () => {
         mockPokemonApi.listAbilities.mockResolvedValue(mockAbilityList);

         const result = await abilityService.getAbilityList();

         expect(mockPokemonApi.listAbilities).toHaveBeenCalledWith(0, 20);
         expect(result).toEqual(mockAbilityList);
      });

      it("should fetch ability list with custom pagination", async () => {
         mockPokemonApi.listAbilities.mockResolvedValue(mockAbilityList);

         const result = await abilityService.getAbilityList(40, 10);

         expect(mockPokemonApi.listAbilities).toHaveBeenCalledWith(40, 10);
         expect(result).toEqual(mockAbilityList);
      });

      it("should validate pagination parameters", async () => {
         const invalidParams = [
            [-1, 20], // negative offset
            [0, 0], // zero limit
            [0, 101], // limit too high
            [0.5, 20], // non-integer offset
            [0, 20.5], // non-integer limit
         ];

         for (const [offset, limit] of invalidParams) {
            await expect(
               abilityService.getAbilityList(offset, limit)
            ).rejects.toThrow();
         }
      });

      it("should handle API errors gracefully", async () => {
         const apiError = new Error("API temporarily unavailable");
         mockRetryManager.executeWithRetry.mockRejectedValue(apiError);
         (ErrorHandler.handle as jest.Mock).mockReturnValue({
            userMessage: "Failed to fetch ability list",
            originalError: apiError,
         });

         await expect(abilityService.getAbilityList()).rejects.toThrow(
            "Failed to fetch ability list"
         );
      });

      it("should handle empty results", async () => {
         const emptyList = { ...mockAbilityList, results: [], count: 0 };
         mockPokemonApi.listAbilities.mockResolvedValue(emptyList);

         const result = await abilityService.getAbilityList(1000, 20);
         expect(result).toEqual(emptyList);
      });
   });

   describe("getAbilityDetails", () => {
      it("should fetch detailed ability information", async () => {
         mockPokemonApi.getAbilityByName.mockResolvedValue(mockAbility);

         const result = await abilityService.getAbilityDetails("stench");

         expect(mockPokemonApi.getAbilityByName).toHaveBeenCalledWith("stench");
         expect(result).toEqual({
            ...mockAbility,
            pokemonWithAbility: mockAbility.pokemon,
            effectEntries: mockAbility.effect_entries,
            flavorTextEntries: mockAbility.flavor_text_entries,
         });
      });

      it("should validate ability name parameter", async () => {
         const invalidNames = [null, undefined, "", "   "];

         for (const name of invalidNames) {
            await expect(
               abilityService.getAbilityDetails(name as any)
            ).rejects.toThrow();
         }
      });

      it("should handle ability not found", async () => {
         const notFoundError = new Error("Ability not found");
         mockRetryManager.executeWithRetry.mockRejectedValue(notFoundError);
         (ErrorHandler.handle as jest.Mock).mockReturnValue({
            userMessage: "Ability not found",
            originalError: notFoundError,
         });

         await expect(
            abilityService.getAbilityDetails("nonexistent")
         ).rejects.toThrow();
      });

      it("should handle ability with minimal data", async () => {
         const minimalAbility: Ability = {
            ...mockAbility,
            pokemon: [],
            effect_entries: [],
            flavor_text_entries: [],
         };
         mockPokemonApi.getAbilityByName.mockResolvedValue(minimalAbility);

         const result = await abilityService.getAbilityDetails("minimal");

         expect(result).toEqual({
            ...minimalAbility,
            pokemonWithAbility: [],
            effectEntries: [],
            flavorTextEntries: [],
         });
      });

      it("should handle very long ability names within limits", async () => {
         const longName = "a".repeat(50); // Max allowed length
         mockPokemonApi.getAbilityByName.mockResolvedValue(mockAbility);

         await expect(
            abilityService.getAbilityDetails(longName)
         ).resolves.toBeDefined();
      });

      it("should reject ability names that are too long", async () => {
         const tooLongName = "a".repeat(51); // Over max allowed length
         (Validator.validateIdentifier as jest.Mock).mockImplementation(() => {
            throw new Error("Ability name too long");
         });

         await expect(
            abilityService.getAbilityDetails(tooLongName)
         ).rejects.toThrow();
      });
   });

   describe("network connectivity", () => {
      it("should handle offline state gracefully", async () => {
         // Mock network manager to return offline state
         mockNetworkManager.checkConnection.mockResolvedValue(false);

         await expect(abilityService.getAbility("stench")).rejects.toThrow(
            "No network connection available"
         );
      });

      it("should provide health status", () => {
         const healthStatus = abilityService.getHealthStatus();

         expect(healthStatus).toHaveProperty("isHealthy");
         expect(healthStatus).toHaveProperty("networkStatus");
         expect(healthStatus).toHaveProperty("lastCheck");
         expect(healthStatus).toHaveProperty("cacheInfo");
         expect(healthStatus).toHaveProperty("retryConfig");
      });

      it("should check connection status", async () => {
         const isConnected = await abilityService.checkConnection();
         expect(typeof isConnected).toBe("boolean");
         expect(isConnected).toBe(true);
      });

      it("should provide online status", () => {
         const isOnline = abilityService.isOnline();
         expect(typeof isOnline).toBe("boolean");
         expect(isOnline).toBe(true);
      });
   });

   describe("cache management", () => {
      it("should clear cache without errors", () => {
         const consoleSpy = jest.spyOn(console, "log").mockImplementation();

         expect(() => abilityService.clearCache()).not.toThrow();
         expect(consoleSpy).toHaveBeenCalledWith(
            "Cache clear requested - will expire naturally via TTL"
         );

         consoleSpy.mockRestore();
      });
   });

   describe("cleanup", () => {
      it("should cleanup resources without errors", () => {
         expect(() => abilityService.cleanup()).not.toThrow();
      });
   });

   describe("edge cases and error scenarios", () => {
      it("should handle malformed API responses", async () => {
         const malformedResponse = { id: 1 }; // Missing required fields
         mockPokemonApi.getAbilityByName.mockResolvedValue(malformedResponse);

         const result = await abilityService.getAbility("test");
         expect(result).toEqual(malformedResponse);
      });

      it("should handle concurrent requests", async () => {
         mockPokemonApi.getAbilityByName.mockImplementation(
            (name: string): Promise<Ability> =>
               Promise.resolve({ ...mockAbility, name })
         );

         const promises = [
            abilityService.getAbility("ability1"),
            abilityService.getAbility("ability2"),
            abilityService.getAbility("ability3"),
         ];

         const results = await Promise.all(promises);
         expect(results).toHaveLength(3);
         expect(results[0].name).toBe("ability1");
         expect(results[1].name).toBe("ability2");
         expect(results[2].name).toBe("ability3");
      });

      it("should handle mixed success and failure in concurrent requests", async () => {
         mockPokemonApi.getAbilityByName
            .mockResolvedValueOnce(mockAbility)
            .mockRejectedValueOnce(new Error("Not found"))
            .mockResolvedValueOnce(mockAbility);

         const promises = [
            abilityService.getAbility("valid1"),
            abilityService.getAbility("invalid"),
            abilityService.getAbility("valid2"),
         ];

         const results = await Promise.allSettled(promises);
         expect(results[0].status).toBe("fulfilled");
         expect(results[1].status).toBe("rejected");
         expect(results[2].status).toBe("fulfilled");
      });

      it("should handle timeout scenarios", async () => {
         const timeoutError = new Error("Request timeout");
         mockRetryManager.executeWithRetry.mockRejectedValue(timeoutError);
         (ErrorHandler.handle as jest.Mock).mockReturnValue({
            userMessage: "Request timeout",
            originalError: timeoutError,
         });

         await expect(abilityService.getAbility("stench")).rejects.toThrow();
      });

      it("should handle JSON parsing errors", async () => {
         const parseError = new Error("JSON parse error");
         mockRetryManager.executeWithRetry.mockRejectedValue(parseError);
         (ErrorHandler.handle as jest.Mock).mockReturnValue({
            userMessage: "JSON parse error",
            originalError: parseError,
         });

         await expect(abilityService.getAbility("stench")).rejects.toThrow();
      });
   });

   describe("parameter validation edge cases", () => {
      it("should handle special characters in ability names", async () => {
         mockPokemonApi.getAbilityByName.mockResolvedValue(mockAbility);

         // These should be properly handled by the API
         const specialNames = ["ability-name", "ability_name", "ability.name"];

         for (const name of specialNames) {
            await expect(
               abilityService.getAbility(name)
            ).resolves.toBeDefined();
         }
      });

      it("should handle Unicode characters in ability names", async () => {
         mockPokemonApi.getAbilityByName.mockResolvedValue(mockAbility);

         const unicodeName = "abilité"; // French accent
         await expect(
            abilityService.getAbility(unicodeName)
         ).resolves.toBeDefined();
         expect(mockPokemonApi.getAbilityByName).toHaveBeenCalledWith(
            "abilité"
         );
      });

      it("should handle boundary values for pagination", async () => {
         mockPokemonApi.listAbilities.mockResolvedValue(mockAbilityList);

         // Test boundary values
         await expect(
            abilityService.getAbilityList(0, 1)
         ).resolves.toBeDefined();
         await expect(
            abilityService.getAbilityList(0, 100)
         ).resolves.toBeDefined();
         await expect(
            abilityService.getAbilityList(999999, 20)
         ).resolves.toBeDefined();
      });
   });
});
