import { cacheKeys, CACHE_CONFIG } from "../Shared/Cache";
import { NamedAPIResource } from "../Interface/Common";
import { SearchOptions } from "../Shared/Types";
import {
   ContestType,
   ContestEffect,
   SuperContestEffect,
} from "../Interface/Contest";
import {
   BaseEndpoint,
   EndpointConfig,
   BaseFilters,
   endpointUtils,
} from "./Shared/Base";

// Filter interfaces
export interface ContestFilters extends BaseFilters {
   berry_flavor?: string;
   language?: string;
}

export interface ContestEffectFilters extends BaseFilters {
   min_appeal?: number;
   max_appeal?: number;
   min_jam?: number;
   max_jam?: number;
}

export interface SuperContestEffectFilters extends BaseFilters {
   min_appeal?: number;
   max_appeal?: number;
   move?: string;
}

// List item interfaces
export interface ContestEffectListItem {
   id: number;
   appeal: number;
   jam: number;
   url: string;
}

export interface SuperContestEffectListItem {
   id: number;
   appeal: number;
   moves_count: number;
   url: string;
}

// Endpoint configurations
const configs = {
   contestType: {
      baseUrl: "https://pokeapi.co/api/v2/contest-type/",
      resourceName: "contest-type",
      defaultLimit: 20,
      cacheTime: {
         list: CACHE_CONFIG.STALE_TIME.EXTRA_LONG,
         detail: CACHE_CONFIG.STALE_TIME.EXTRA_LONG,
      },
   } as EndpointConfig,

   contestEffect: {
      baseUrl: "https://pokeapi.co/api/v2/contest-effect/",
      resourceName: "contest-effect",
      defaultLimit: 20,
      cacheTime: {
         list: CACHE_CONFIG.STALE_TIME.LONG,
         detail: CACHE_CONFIG.STALE_TIME.EXTRA_LONG,
      },
   } as EndpointConfig,

   superContestEffect: {
      baseUrl: "https://pokeapi.co/api/v2/super-contest-effect/",
      resourceName: "super-contest-effect",
      defaultLimit: 20,
      cacheTime: {
         list: CACHE_CONFIG.STALE_TIME.LONG,
         detail: CACHE_CONFIG.STALE_TIME.EXTRA_LONG,
      },
   } as EndpointConfig,
};

// Utility for filtering with details
async function filterWithDetails<T extends NamedAPIResource, D>(
   items: T[],
   fetchDetail: (id: string | number) => Promise<D>,
   filterFn: (detail: D) => boolean,
   limit = 50
): Promise<T[]> {
   const detailedItems = await Promise.allSettled(
      items.slice(0, limit).map(async (item) => {
         const id = endpointUtils.extractIdFromUrl(item.url) || item.name;
         const detail = await fetchDetail(id);
         return { item, detail };
      })
   );

   return detailedItems
      .filter(
         (
            result
         ): result is PromiseFulfilledResult<{ item: T; detail: Awaited<D> }> =>
            result.status === "fulfilled" && filterFn(result.value.detail)
      )
      .map((result) => result.value.item);
}

// Contest Type Endpoint
export class ContestTypeEndpoint extends BaseEndpoint<
   ContestType,
   NamedAPIResource
> {
   constructor() {
      super(configs.contestType, cacheKeys.contestTypes);
   }

   async getContestTypes(filters: ContestFilters = {}) {
      const response = await this.getList(filters);

      // Early return if no advanced filters
      if (!filters.berry_flavor && !filters.language) {
         return {
            results: response.results,
            count: response.count,
            hasMore: !!response.next,
         };
      }

      const results = await filterWithDetails(
         response.results,
         this.getById.bind(this),
         (detail: ContestType) => {
            if (
               filters.berry_flavor &&
               !detail.berry_flavor.name.includes(
                  filters.berry_flavor.toLowerCase()
               )
            ) {
               return false;
            }
            if (
               filters.language &&
               !detail.names.some((n) => n.language.name === filters.language)
            ) {
               return false;
            }
            return true;
         }
      );

      return { results, count: results.length, hasMore: false };
   }

   async searchContestTypes(options: SearchOptions & { language?: string }) {
      const baseSearch = await this.search(options);

      if (!options.language) {
         return {
            results: baseSearch.results,
            total: baseSearch.results.length,
         };
      }

      const results = await filterWithDetails(
         baseSearch.results,
         this.getById.bind(this),
         (detail: ContestType) =>
            detail.names.some((n) => n.language.name === options.language)
      );

      return { results, total: results.length };
   }
}

// Contest Effect Endpoint
export class ContestEffectEndpoint extends BaseEndpoint<
   ContestEffect,
   ContestEffectListItem
> {
   constructor() {
      super(configs.contestEffect, cacheKeys.contestEffects);
   }

   async getContestEffects(filters: ContestEffectFilters = {}) {
      const response = await this.getList(filters);
      const hasFilters =
         filters.min_appeal ||
         filters.max_appeal ||
         filters.min_jam ||
         filters.max_jam;

      if (!hasFilters) {
         return {
            results: response.results.map((item: any) => ({
               id: endpointUtils.extractIdFromUrl(item.url) || 0,
               appeal: 0,
               jam: 0,
               url: item.url,
            })),
            count: response.count,
            hasMore: !!response.next,
         };
      }

      const detailedResults = await Promise.allSettled(
         response.results.slice(0, 50).map(async (item: any) => {
            const detail = await this.getById(
               endpointUtils.extractIdFromUrl(item.url) || 0
            );
            return {
               id: detail.id,
               appeal: detail.appeal,
               jam: detail.jam,
               url: item.url,
               detail,
            };
         })
      );

      const results = detailedResults
         .filter((result): result is PromiseFulfilledResult<any> => {
            if (result.status !== "fulfilled") return false;
            const { detail } = result.value;

            if (filters.min_appeal && detail.appeal < filters.min_appeal)
               return false;
            if (filters.max_appeal && detail.appeal > filters.max_appeal)
               return false;
            if (filters.min_jam && detail.jam < filters.min_jam) return false;
            if (filters.max_jam && detail.jam > filters.max_jam) return false;

            return true;
         })
         .map((result) => {
            const { detail, ...item } = result.value;
            return item;
         });

      return { results, count: results.length, hasMore: false };
   }

   async getContestEffectsByAppeal(minAppeal: number, maxAppeal?: number) {
      const filters: ContestEffectFilters = {
         min_appeal: minAppeal,
         ...(maxAppeal && { max_appeal: maxAppeal }),
      };

      const response = await this.getContestEffects(filters);
      return Promise.all(response.results.map((item) => this.getById(item.id)));
   }
}

// Super Contest Effect Endpoint
export class SuperContestEffectEndpoint extends BaseEndpoint<
   SuperContestEffect,
   SuperContestEffectListItem
> {
   constructor() {
      super(configs.superContestEffect, cacheKeys.superContestEffects);
   }

   async getSuperContestEffects(filters: SuperContestEffectFilters = {}) {
      const response = await this.getList(filters);
      const hasFilters =
         filters.min_appeal || filters.max_appeal || filters.move;

      if (!hasFilters) {
         return {
            results: response.results.map((item: any) => ({
               id: endpointUtils.extractIdFromUrl(item.url) || 0,
               appeal: 0,
               moves_count: 0,
               url: item.url,
            })),
            count: response.count,
            hasMore: !!response.next,
         };
      }

      const detailedResults = await Promise.allSettled(
         response.results.slice(0, 50).map(async (item: any) => {
            const detail = await this.getById(
               endpointUtils.extractIdFromUrl(item.url) || 0
            );
            return {
               id: detail.id,
               appeal: detail.appeal,
               moves_count: detail.moves.length,
               url: item.url,
               detail,
            };
         })
      );

      const results = detailedResults
         .filter((result): result is PromiseFulfilledResult<any> => {
            if (result.status !== "fulfilled") return false;
            const { detail } = result.value;

            if (filters.min_appeal && detail.appeal < filters.min_appeal)
               return false;
            if (filters.max_appeal && detail.appeal > filters.max_appeal)
               return false;
            if (
               filters.move &&
               !detail.moves.some((m) =>
                  m.name.includes(filters.move!.toLowerCase())
               )
            )
               return false;

            return true;
         })
         .map((result) => {
            const { detail, ...item } = result.value;
            return item;
         });

      return { results, count: results.length, hasMore: false };
   }

   async getSuperContestEffectsByMove(moveName: string) {
      const response = await this.getSuperContestEffects({ move: moveName });
      return Promise.all(response.results.map((item) => this.getById(item.id)));
   }
}

// Combined endpoints
export class ContestEndpoints {
   public readonly types = new ContestTypeEndpoint();
   public readonly effects = new ContestEffectEndpoint();
   public readonly superEffects = new SuperContestEffectEndpoint();

   async searchAll(query: string, options: Omit<SearchOptions, "query"> = {}) {
      const [typeResults] = await Promise.allSettled([
         this.types.search({ ...options, query }),
      ]);

      return {
         types:
            typeResults.status === "fulfilled" ? typeResults.value.results : [],
         effects: [], // Effects are ID-based, not searchable by name
         superEffects: [],
         total:
            typeResults.status === "fulfilled" ? typeResults.value.count : 0,
      };
   }
}

// Export singleton
export const contestEndpoints = new ContestEndpoints();
