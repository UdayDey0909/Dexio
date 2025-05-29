import { cacheKeys, CACHE_CONFIG } from "../Client/Cache";
import { NamedAPIResource } from "../Interface/Common";
import { SearchOptions } from "../Client/Types";
import {
   Ability,
   AbilityEffectChange,
   AbilityFlavorText,
   AbilityPokemon,
} from "../Interface/Ability";
import {
   BaseEndpoint,
   EndpointConfig,
   BaseFilters,
   FilterBuilder,
   endpointUtils,
} from "./Shared/Base";

/**
 * Extended filters for ability-specific queries
 */
export interface AbilityFilters extends BaseFilters {
   /** Filter by generation */
   generation?: number;
   /** Filter by main series only */
   main_series_only?: boolean;
   /** Filter abilities that affect specific Pokemon */
   pokemon?: string;
}

/**
 * Ability list item (simplified for list views)
 */
export interface AbilityListItem extends NamedAPIResource {
   id?: number;
}

/**
 * Ability search and filter options
 */
export interface AbilitySearchOptions extends SearchOptions {
   /** Include hidden abilities in search */
   include_hidden?: boolean;
   /** Filter by generation */
   generation?: number;
}

/**
 * Ability endpoint configuration
 */
const abilityConfig: EndpointConfig = {
   baseUrl: "https://pokeapi.co/api/v2/ability/",
   resourceName: "ability",
   defaultLimit: 20,
   cacheTime: {
      list: CACHE_CONFIG.STALE_TIME.LONG,
      detail: CACHE_CONFIG.STALE_TIME.EXTRA_LONG,
   },
};

/**
 * AbilityEndpoint class for managing ability-related API calls
 */
export class AbilityEndpoint extends BaseEndpoint<Ability, AbilityListItem> {
   constructor() {
      super(abilityConfig, cacheKeys.abilities);
   }

   /**
    * Get abilities with advanced filtering
    * @param filters - Ability-specific filters
    * @returns Promise resolving to filtered abilities
    */
   async getAbilities(filters: AbilityFilters = {}): Promise<{
      results: AbilityListItem[];
      count: number;
      hasMore: boolean;
   }> {
      try {
         const response = await this.getList(filters);

         let filteredResults = response.results;

         // Apply additional client-side filters
         if (
            filters.main_series_only ||
            filters.generation ||
            filters.pokemon
         ) {
            const detailedResults = await Promise.all(
               filteredResults
                  .slice(0, Math.min(100, filteredResults.length))
                  .map(async (item) => {
                     try {
                        const detail = await this.getById(
                           endpointUtils.extractIdFromUrl(item.url) || item.name
                        );
                        return { ...item, detail };
                     } catch {
                        return { ...item, detail: null };
                     }
                  })
            );

            filteredResults = detailedResults
               .filter((item) => {
                  if (!item.detail) return true;

                  if (filters.main_series_only && !item.detail.is_main_series) {
                     return false;
                  }

                  if (filters.generation) {
                     const genId = endpointUtils.extractIdFromUrl(
                        item.detail.generation.url
                     );
                     if (genId !== filters.generation) return false;
                  }

                  if (filters.pokemon) {
                     const hasPokemon = item.detail.pokemon.some(
                        (p: AbilityPokemon) =>
                           p.pokemon.name.includes(
                              filters.pokemon!.toLowerCase()
                           )
                     );
                     if (!hasPokemon) return false;
                  }

                  return true;
               })
               .map(({ detail, ...item }) => item);
         }

         return {
            results: filteredResults,
            count: response.count,
            hasMore: !!response.next,
         };
      } catch (error) {
         throw this.handleError(error);
      }
   }

   /**
    * Search abilities with enhanced options
    * @param options - Enhanced search options
    * @returns Promise resolving to search results
    */
   async searchAbilities(options: AbilitySearchOptions): Promise<{
      results: AbilityListItem[];
      total: number;
   }> {
      try {
         const baseSearch = await this.search(options);
         let results = baseSearch.results;

         // Apply additional search filters
         if (options.generation || options.include_hidden !== undefined) {
            const detailedResults = await Promise.all(
               results.map(async (item) => {
                  try {
                     const detail = await this.getById(
                        endpointUtils.extractIdFromUrl(item.url) || item.name
                     );
                     return { ...item, detail };
                  } catch {
                     return { ...item, detail: null };
                  }
               })
            );

            results = detailedResults
               .filter((item) => {
                  if (!item.detail) return true;

                  if (options.generation) {
                     const genId = endpointUtils.extractIdFromUrl(
                        item.detail.generation.url
                     );
                     if (genId !== options.generation) return false;
                  }

                  if (options.include_hidden === false) {
                     const hasHiddenOnly = item.detail.pokemon.every(
                        (p: AbilityPokemon) => p.is_hidden
                     );
                     if (hasHiddenOnly) return false;
                  }

                  return true;
               })
               .map(({ detail, ...item }) => item);
         }

         return {
            results,
            total: results.length,
         };
      } catch (error) {
         throw this.handleError(error);
      }
   }

   /**
    * Get ability by name or ID with error handling
    * @param identifier - Ability name or ID
    * @returns Promise resolving to ability details
    */
   async getAbility(identifier: string | number): Promise<Ability> {
      try {
         const normalizedId =
            typeof identifier === "string"
               ? endpointUtils.normalizeName(identifier)
               : identifier;

         return await this.getById(normalizedId);
      } catch (error) {
         throw this.handleError(error);
      }
   }

   /**
    * Get Pokemon that can have specific ability
    * @param abilityId - Ability identifier
    * @returns Promise resolving to Pokemon list
    */
   async getPokemonWithAbility(
      abilityId: string | number
   ): Promise<AbilityPokemon[]> {
      try {
         const ability = await this.getAbility(abilityId);
         return ability.pokemon;
      } catch (error) {
         throw this.handleError(error);
      }
   }

   /**
    * Get abilities by generation
    * @param generation - Generation number
    * @returns Promise resolving to abilities from that generation
    */
   async getAbilitiesByGeneration(generation: number): Promise<Ability[]> {
      try {
         const allAbilities = await this.getList({ limit: 1000 });

         // Get detailed info for filtering
         const detailedAbilities = await Promise.all(
            allAbilities.results
               .slice(0, 100) // Limit to prevent too many requests
               .map(async (item) => {
                  try {
                     return await this.getById(
                        endpointUtils.extractIdFromUrl(item.url) || item.name
                     );
                  } catch {
                     return null;
                  }
               })
         );

         return detailedAbilities.filter((ability): ability is Ability => {
            if (!ability) return false;
            const genId = endpointUtils.extractIdFromUrl(
               ability.generation.url
            );
            return genId === generation;
         });
      } catch (error) {
         throw this.handleError(error);
      }
   }

   /**
    * Get ability effect changes across versions
    * @param abilityId - Ability identifier
    * @returns Promise resolving to effect changes
    */
   async getAbilityEffectChanges(
      abilityId: string | number
   ): Promise<AbilityEffectChange[]> {
      try {
         const ability = await this.getAbility(abilityId);
         return ability.effect_changes;
      } catch (error) {
         throw this.handleError(error);
      }
   }

   /**
    * Get ability flavor text in specific language
    * @param abilityId - Ability identifier
    * @param language - Language code (default: 'en')
    * @returns Promise resolving to flavor text entries
    */
   async getAbilityFlavorText(
      abilityId: string | number,
      language: string = "en"
   ): Promise<AbilityFlavorText[]> {
      try {
         const ability = await this.getAbility(abilityId);
         return ability.flavor_text_entries.filter(
            (entry) => entry.language.name === language
         );
      } catch (error) {
         throw this.handleError(error);
      }
   }

   /**
    * Check if ability is hidden for any Pokemon
    * @param abilityId - Ability identifier
    * @returns Promise resolving to boolean
    */
   async isHiddenAbility(abilityId: string | number): Promise<boolean> {
      try {
         const pokemon = await this.getPokemonWithAbility(abilityId);
         return pokemon.some((p) => p.is_hidden);
      } catch (error) {
         throw this.handleError(error);
      }
   }

   /**
    * Get random ability
    * @returns Promise resolving to random ability
    */
   async getRandomAbility(): Promise<Ability> {
      try {
         const count = await this.getCount();
         const randomId = Math.floor(Math.random() * count) + 1;
         return await this.getAbility(randomId);
      } catch (error) {
         throw this.handleError(error);
      }
   }
}

/**
 * Filter builder for ability queries
 */
export class AbilityFilterBuilder extends FilterBuilder<AbilityFilters> {
   /**
    * Filter by generation
    * @param generation - Generation number
    * @returns Builder instance
    */
   generation(generation: number): this {
      return this.custom("generation", generation);
   }

   /**
    * Filter main series abilities only
    * @param mainSeriesOnly - Whether to include only main series
    * @returns Builder instance
    */
   mainSeriesOnly(mainSeriesOnly: boolean = true): this {
      return this.custom("main_series_only", mainSeriesOnly);
   }

   /**
    * Filter abilities by Pokemon name
    * @param pokemon - Pokemon name
    * @returns Builder instance
    */
   forPokemon(pokemon: string): this {
      return this.custom("pokemon", pokemon);
   }
}

/**
 * Singleton instance of the ability endpoint
 */
export const abilityEndpoint = new AbilityEndpoint();
