import { cacheKeys, CACHE_CONFIG } from "../Client/Cache";
import { NamedAPIResource } from "../Interface/Common";
import { SearchOptions } from "../Client/Types";
import {
   ContestType,
   ContestEffect,
   SuperContestEffect,
} from "../Interface/Contest";
import {
   BaseEndpoint,
   EndpointConfig,
   BaseFilters,
   FilterBuilder,
   endpointUtils,
} from "./Shared/BaseEndpoint";

/**
 * Extended filters for contest-specific queries
 */
export interface ContestFilters extends BaseFilters {
   /** Filter by berry flavor association */
   berry_flavor?: string;
   /** Filter by language for name display */
   language?: string;
}

/**
 * Contest effect filters
 */
export interface ContestEffectFilters extends BaseFilters {
   /** Minimum appeal value */
   min_appeal?: number;
   /** Maximum appeal value */
   max_appeal?: number;
   /** Minimum jam value */
   min_jam?: number;
   /** Maximum jam value */
   max_jam?: number;
}

/**
 * Super contest effect filters
 */
export interface SuperContestEffectFilters extends BaseFilters {
   /** Minimum appeal value */
   min_appeal?: number;
   /** Maximum appeal value */
   max_appeal?: number;
   /** Filter by associated move */
   move?: string;
}

/**
 * Contest type list item (simplified for list views)
 */
export interface ContestTypeListItem extends NamedAPIResource {
   id?: number;
}

/**
 * Contest effect list item
 */
export interface ContestEffectListItem {
   id: number;
   appeal: number;
   jam: number;
   url: string;
}

/**
 * Super contest effect list item
 */
export interface SuperContestEffectListItem {
   id: number;
   appeal: number;
   moves_count: number;
   url: string;
}

/**
 * Contest search options
 */
export interface ContestSearchOptions extends SearchOptions {
   /** Include berry flavor in search */
   include_berry_flavor?: boolean;
   /** Language for name matching */
   language?: string;
}

/**
 * Contest Type endpoint configuration
 */
const contestTypeConfig: EndpointConfig = {
   baseUrl: "https://pokeapi.co/api/v2/contest-type/",
   resourceName: "contest-type",
   defaultLimit: 20,
   cacheTime: {
      list: CACHE_CONFIG.STALE_TIME.EXTRA_LONG,
      detail: CACHE_CONFIG.STALE_TIME.EXTRA_LONG,
   },
};

/**
 * Contest Effect endpoint configuration
 */
const contestEffectConfig: EndpointConfig = {
   baseUrl: "https://pokeapi.co/api/v2/contest-effect/",
   resourceName: "contest-effect",
   defaultLimit: 20,
   cacheTime: {
      list: CACHE_CONFIG.STALE_TIME.LONG,
      detail: CACHE_CONFIG.STALE_TIME.EXTRA_LONG,
   },
};

/**
 * Super Contest Effect endpoint configuration
 */
const superContestEffectConfig: EndpointConfig = {
   baseUrl: "https://pokeapi.co/api/v2/super-contest-effect/",
   resourceName: "super-contest-effect",
   defaultLimit: 20,
   cacheTime: {
      list: CACHE_CONFIG.STALE_TIME.LONG,
      detail: CACHE_CONFIG.STALE_TIME.EXTRA_LONG,
   },
};

/**
 * ContestTypeEndpoint class for managing contest type API calls
 */
export class ContestTypeEndpoint extends BaseEndpoint<
   ContestType,
   ContestTypeListItem
> {
   constructor() {
      super(contestTypeConfig, cacheKeys.contestTypes);
   }

   /**
    * Get contest types with filtering
    * @param filters - Contest-specific filters
    * @returns Promise resolving to filtered contest types
    */
   async getContestTypes(filters: ContestFilters = {}): Promise<{
      results: ContestTypeListItem[];
      count: number;
      hasMore: boolean;
   }> {
      try {
         const response = await this.getList(filters);
         let filteredResults = response.results;

         // Apply client-side filters if needed
         if (filters.berry_flavor || filters.language) {
            const detailedResults = await Promise.all(
               filteredResults.map(async (item) => {
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

                  if (
                     filters.berry_flavor &&
                     !item.detail.berry_flavor.name.includes(
                        filters.berry_flavor.toLowerCase()
                     )
                  ) {
                     return false;
                  }

                  if (filters.language) {
                     const hasLanguage = item.detail.names.some(
                        (name: any) => name.language.name === filters.language
                     );
                     if (!hasLanguage) return false;
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
    * Get contest type by name or ID
    * @param identifier - Contest type name or ID
    * @returns Promise resolving to contest type details
    */
   async getContestType(identifier: string | number): Promise<ContestType> {
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
    * Search contest types
    * @param options - Search options
    * @returns Promise resolving to search results
    */
   async searchContestTypes(options: ContestSearchOptions): Promise<{
      results: ContestTypeListItem[];
      total: number;
   }> {
      try {
         const baseSearch = await this.search(options);
         let results = baseSearch.results;

         // Apply additional search filters
         if (options.include_berry_flavor || options.language) {
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

            if (options.include_berry_flavor) {
               results = detailedResults
                  .filter((item) => {
                     if (!item.detail) return false;
                     return item.detail.berry_flavor.name
                        .toLowerCase()
                        .includes(options.query.toLowerCase());
                  })
                  .map(({ detail, ...item }) => item);
            }
         }

         return {
            results,
            total: results.length,
         };
      } catch (error) {
         throw this.handleError(error);
      }
   }
}

/**
 * ContestEffectEndpoint class for managing contest effect API calls
 */
export class ContestEffectEndpoint extends BaseEndpoint<
   ContestEffect,
   ContestEffectListItem
> {
   constructor() {
      super(contestEffectConfig, cacheKeys.contestEffects);
   }

   /**
    * Get contest effects with filtering
    * @param filters - Contest effect filters
    * @returns Promise resolving to filtered contest effects
    */
   async getContestEffects(filters: ContestEffectFilters = {}): Promise<{
      results: ContestEffectListItem[];
      count: number;
      hasMore: boolean;
   }> {
      try {
         const response = await this.getList(filters);
         let filteredResults: ContestEffectListItem[] = [];

         // Transform results to include appeal and jam info
         if (
            filters.min_appeal ||
            filters.max_appeal ||
            filters.min_jam ||
            filters.max_jam
         ) {
            const detailedResults = await Promise.all(
               response.results.slice(0, 50).map(async (item: any) => {
                  try {
                     const detail = await this.getById(
                        item.id || endpointUtils.extractIdFromUrl(item.url)
                     );
                     return {
                        id: detail.id,
                        appeal: detail.appeal,
                        jam: detail.jam,
                        url: `${this.config.baseUrl}${detail.id}/`,
                     };
                  } catch {
                     return null;
                  }
               })
            );

            filteredResults = detailedResults.filter(
               (item): item is ContestEffectListItem => {
                  if (!item) return false;

                  if (filters.min_appeal && item.appeal < filters.min_appeal)
                     return false;
                  if (filters.max_appeal && item.appeal > filters.max_appeal)
                     return false;
                  if (filters.min_jam && item.jam < filters.min_jam)
                     return false;
                  if (filters.max_jam && item.jam > filters.max_jam)
                     return false;

                  return true;
               }
            );
         } else {
            // Basic transformation without detailed fetch
            filteredResults = response.results.map((item: any) => ({
               id: endpointUtils.extractIdFromUrl(item.url) || 0,
               appeal: 0, // Will need to fetch detail to get actual values
               jam: 0,
               url: item.url,
            }));
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
    * Get contest effect by ID
    * @param id - Contest effect ID
    * @returns Promise resolving to contest effect details
    */
   async getContestEffect(id: number): Promise<ContestEffect> {
      try {
         return await this.getById(id);
      } catch (error) {
         throw this.handleError(error);
      }
   }

   /**
    * Get contest effects by appeal range
    * @param minAppeal - Minimum appeal value
    * @param maxAppeal - Maximum appeal value (optional)
    * @returns Promise resolving to filtered contest effects
    */
   async getContestEffectsByAppeal(
      minAppeal: number,
      maxAppeal?: number
   ): Promise<ContestEffect[]> {
      try {
         const filters: ContestEffectFilters = {
            min_appeal: minAppeal,
            ...(maxAppeal && { max_appeal: maxAppeal }),
         };

         const response = await this.getContestEffects(filters);

         // Get full details for filtered results
         return await Promise.all(
            response.results.map((item) => this.getContestEffect(item.id))
         );
      } catch (error) {
         throw this.handleError(error);
      }
   }
}

/**
 * SuperContestEffectEndpoint class for managing super contest effect API calls
 */
export class SuperContestEffectEndpoint extends BaseEndpoint<
   SuperContestEffect,
   SuperContestEffectListItem
> {
   constructor() {
      super(superContestEffectConfig, cacheKeys.superContestEffects);
   }

   /**
    * Get super contest effects with filtering
    * @param filters - Super contest effect filters
    * @returns Promise resolving to filtered super contest effects
    */
   async getSuperContestEffects(
      filters: SuperContestEffectFilters = {}
   ): Promise<{
      results: SuperContestEffectListItem[];
      count: number;
      hasMore: boolean;
   }> {
      try {
         const response = await this.getList(filters);
         let filteredResults: SuperContestEffectListItem[] = [];

         if (filters.min_appeal || filters.max_appeal || filters.move) {
            const detailedResults = await Promise.all(
               response.results.slice(0, 50).map(async (item: any) => {
                  try {
                     const detail = await this.getById(
                        item.id || endpointUtils.extractIdFromUrl(item.url)
                     );
                     return {
                        id: detail.id,
                        appeal: detail.appeal,
                        moves_count: detail.moves.length,
                        url: `${this.config.baseUrl}${detail.id}/`,
                        detail,
                     };
                  } catch {
                     return null;
                  }
               })
            );

            filteredResults = detailedResults
               .filter(
                  (
                     item
                  ): item is SuperContestEffectListItem & {
                     detail: SuperContestEffect;
                  } => {
                     if (!item) return false;

                     if (filters.min_appeal && item.appeal < filters.min_appeal)
                        return false;
                     if (filters.max_appeal && item.appeal > filters.max_appeal)
                        return false;

                     if (filters.move) {
                        const hasMove = item.detail.moves.some((move) =>
                           move.name.includes(filters.move!.toLowerCase())
                        );
                        if (!hasMove) return false;
                     }

                     return true;
                  }
               )
               .map(({ detail, ...item }) => item);
         } else {
            filteredResults = response.results.map((item: any) => ({
               id: endpointUtils.extractIdFromUrl(item.url) || 0,
               appeal: 0,
               moves_count: 0,
               url: item.url,
            }));
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
    * Get super contest effect by ID
    * @param id - Super contest effect ID
    * @returns Promise resolving to super contest effect details
    */
   async getSuperContestEffect(id: number): Promise<SuperContestEffect> {
      try {
         return await this.getById(id);
      } catch (error) {
         throw this.handleError(error);
      }
   }

   /**
    * Get super contest effects by move
    * @param moveName - Move name to filter by
    * @returns Promise resolving to super contest effects that affect the move
    */
   async getSuperContestEffectsByMove(
      moveName: string
   ): Promise<SuperContestEffect[]> {
      try {
         const response = await this.getSuperContestEffects({ move: moveName });

         return await Promise.all(
            response.results.map((item) => this.getSuperContestEffect(item.id))
         );
      } catch (error) {
         throw this.handleError(error);
      }
   }
}

/**
 * Combined contest endpoints class for unified access
 */
export class ContestEndpoints {
   public readonly types: ContestTypeEndpoint;
   public readonly effects: ContestEffectEndpoint;
   public readonly superEffects: SuperContestEffectEndpoint;

   constructor() {
      this.types = new ContestTypeEndpoint();
      this.effects = new ContestEffectEndpoint();
      this.superEffects = new SuperContestEffectEndpoint();
   }

   /**
    * Search across all contest-related resources
    * @param query - Search query
    * @param options - Search options
    * @returns Promise resolving to combined search results
    */
   async searchAll(query: string, options: Omit<SearchOptions, "query"> = {}) {
      try {
         const [typeResults] = await Promise.allSettled([
            this.types.searchContestTypes({ ...options, query }),
            // Note: Contest effects don't have names to search, so we skip them
         ]);

         return {
            types:
               typeResults.status === "fulfilled"
                  ? typeResults.value.results
                  : [],
            effects: [], // Contest effects are ID-based, not searchable by name
            superEffects: [], // Same for super contest effects
            total:
               typeResults.status === "fulfilled" ? typeResults.value.total : 0,
         };
      } catch (error) {
         throw error;
      }
   }
}

/**
 * Filter builders for different contest resource types
 */
export class ContestTypeFilterBuilder extends FilterBuilder<ContestFilters> {
   berryFlavor(flavor: string): this {
      return this.custom("berry_flavor", flavor);
   }

   language(lang: string): this {
      return this.custom("language", lang);
   }
}

export class ContestEffectFilterBuilder extends FilterBuilder<ContestEffectFilters> {
   minAppeal(value: number): this {
      return this.custom("min_appeal", value);
   }

   maxAppeal(value: number): this {
      return this.custom("max_appeal", value);
   }

   minJam(value: number): this {
      return this.custom("min_jam", value);
   }

   maxJam(value: number): this {
      return this.custom("max_jam", value);
   }

   appealRange(min: number, max: number): this {
      return this.minAppeal(min).maxAppeal(max);
   }
}

export class SuperContestEffectFilterBuilder extends FilterBuilder<SuperContestEffectFilters> {
   minAppeal(value: number): this {
      return this.custom("min_appeal", value);
   }

   maxAppeal(value: number): this {
      return this.custom("max_appeal", value);
   }

   forMove(moveName: string): this {
      return this.custom("move", moveName);
   }
}

/**
 * Singleton instances of the contest endpoints
 */
export const contestTypeEndpoint = new ContestTypeEndpoint();
export const contestEffectEndpoint = new ContestEffectEndpoint();
export const superContestEffectEndpoint = new SuperContestEffectEndpoint();
export const contestEndpoints = new ContestEndpoints();
