import { BaseService } from "../Client";
import type { Ability } from "pokenode-ts";
import type { AbilityDetails } from "../Hooks/Ability/";

/**
 * Service class for handling Pokémon ability-related API operations.
 *
 * Provides methods to fetch individual abilities, paginated ability lists,
 * and detailed ability information from the PokéAPI using the pokenode-ts wrapper.
 * Inherits error handling, retry logic, network validation, and caching from BaseService.
 *
 * @extends BaseService
 *
 * @example
 * ```typescript
 * const abilityService = new AbilityService({
 *   maxRetries: 3,
 *   retryDelay: 1000,
 *   cacheTimeout: 300000
 * });
 *
 * // Check service health
 * const health = abilityService.getHealthStatus();
 * if (!health.isHealthy) {
 *   console.log('Service is offline');
 * }
 * ```
 */
export class AbilityService extends BaseService {
   /**
    * Retrieves a specific Pokémon ability by name or ID.
    *
    * Automatically handles input validation, network connectivity checks,
    * retry logic for failed requests, and error formatting. String identifiers
    * are normalized (lowercased and trimmed) before API calls.
    *
    * @param identifier - The ability name (string) or ID (number) to fetch.
    *                    Names are case-insensitive and whitespace is trimmed.
    * @returns Promise that resolves to the complete Ability object from PokéAPI
    * @throws {Error} When identifier is invalid (empty string, negative number, etc.)
    * @throws {Error} When network connection is unavailable
    * @throws {Error} When API request fails after all retry attempts
    * @throws {Error} When ability is not found (404 from API)
    *
    * @example
    * ```typescript
    * const abilityService = new AbilityService();
    *
    * try {
    *   // Fetch by name (case-insensitive)
    *   const overgrow = await abilityService.getAbility("Overgrow");
    *   console.log(overgrow.name); // "overgrow"
    *   console.log(overgrow.effect_entries[0].effect); // Ability description
    *
    *   // Fetch by ID
    *   const intimidate = await abilityService.getAbility(22);
    *   console.log(intimidate.pokemon.length); // Pokémon with this ability
    * } catch (error) {
    *   console.error('Failed to fetch ability:', error.message);
    * }
    * ```
    */
   async getAbility(identifier: string | number): Promise<Ability> {
      this.validateIdentifier(identifier, "Ability");

      return this.executeWithErrorHandling(async () => {
         return typeof identifier === "string"
            ? await this.api.pokemon.getAbilityByName(
                 identifier.toLowerCase().trim()
              )
            : await this.api.pokemon.getAbilityById(identifier);
      }, `Failed to fetch ability: ${identifier}`);
   }

   /**
    * Retrieves a paginated list of Pokémon abilities from the PokéAPI.
    *
    * Returns a structured response containing both the ability data and pagination
    * metadata. Includes automatic validation of pagination parameters and network
    * connectivity checks. Useful for building ability browsers or selection lists.
    *
    * @param offset - Number of abilities to skip from the beginning (default: 0).
    *                Must be non-negative integer.
    * @param limit - Maximum number of abilities to return in this request (default: 20).
    *               Must be positive integer, automatically capped at reasonable limits.
    * @returns Promise that resolves to a NamedAPIResourceList containing:
    *          - count: Total number of abilities available
    *          - next: URL for next page (if available)
    *          - previous: URL for previous page (if available)
    *          - results: Array of Named API Resources with name and url
    * @throws {Error} When offset is negative or limit is non-positive
    * @throws {Error} When network connection is unavailable
    * @throws {Error} When API request fails after all retry attempts
    *
    * @example
    * ```typescript
    * const abilityService = new AbilityService();
    *
    * try {
    *   // Get first page of abilities
    *   const firstPage = await abilityService.getAbilityList(0, 10);
    *   console.log(`Total abilities: ${firstPage.count}`);
    *   firstPage.results.forEach(ability => {
    *     console.log(`${ability.name}: ${ability.url}`);
    *   });
    *
    *   // Get next page
    *   if (firstPage.next) {
    *     const secondPage = await abilityService.getAbilityList(10, 10);
    *   }
    * } catch (error) {
    *   console.error('Failed to fetch ability list:', error.message);
    * }
    * ```
    */
   async getAbilityList(offset: number = 0, limit: number = 20) {
      this.validatePaginationParams(offset, limit);

      return this.executeWithErrorHandling(
         async () => await this.api.pokemon.listAbilities(offset, limit),
         "Failed to fetch ability list"
      );
   }

   /**
    * Retrieves comprehensive details about a specific Pokémon ability with enhanced data structure.
    *
    * This method fetches the complete ability data from the API and restructures it with more
    * intuitive property names for better developer experience. It combines the base ability
    * information with reformatted nested data for easier access in React Native components.
    *
    * The returned object maintains all original ability properties while adding convenience
    * properties with cleaner names (snake_case converted to camelCase where appropriate).
    *
    * @param abilityName - The name of the ability to fetch details for.
    *                     Case-insensitive, whitespace will be trimmed automatically.
    * @returns Promise that resolves to AbilityDetails object containing:
    *          - All original Ability properties from pokenode-ts
    *          - pokemonWithAbility: List of Pokémon that have this ability (replaces 'pokemon')
    *          - effectEntries: Ability effect descriptions in different languages (replaces 'effect_entries')
    *          - flavorTextEntries: Flavor text from various games (replaces 'flavor_text_entries')
    * @throws {Error} When ability name is invalid (empty, null, undefined)
    * @throws {Error} When network connection is unavailable
    * @throws {Error} When API request fails after all retry attempts
    * @throws {Error} When ability is not found in the PokéAPI
    *
    * @example
    * ```typescript
    * const abilityService = new AbilityService();
    *
    * try {
    *   const details = await abilityService.getAbilityDetails("overgrow");
    *
    *   // Access restructured data with cleaner property names
    *   console.log(`Ability: ${details.name}`);
    *   console.log(`ID: ${details.id}`);
    *
    *   // Original API properties still available
    *   console.log(details.is_main_series);
    *   console.log(details.generation.name);
    *
    *   // Enhanced property names for better DX
    *   details.pokemonWithAbility.forEach(pokemon => {
    *     console.log(`${pokemon.pokemon.name} can have ${details.name}`);
    *     console.log(`Hidden: ${pokemon.is_hidden}`);
    *   });
    *
    *   // Effect descriptions
    *   const englishEffect = details.effectEntries.find(
    *     entry => entry.language.name === 'en'
    *   );
    *   console.log(`Effect: ${englishEffect?.effect}`);
    *
    *   // Game flavor text
    *   const recentFlavor = details.flavorTextEntries
    *     .filter(entry => entry.language.name === 'en')
    *     .pop(); // Get most recent
    *   console.log(`Description: ${recentFlavor?.flavor_text}`);
    *
    * } catch (error) {
    *   console.error('Failed to fetch ability details:', error.message);
    * }
    * ```
    */
   async getAbilityDetails(abilityName: string): Promise<AbilityDetails> {
      this.validateIdentifier(abilityName, "Ability name");

      const ability = await this.getAbility(abilityName);

      return {
         ...ability,
         pokemonWithAbility: ability.pokemon,
         effectEntries: ability.effect_entries,
         flavorTextEntries: ability.flavor_text_entries,
      };
   }
}
