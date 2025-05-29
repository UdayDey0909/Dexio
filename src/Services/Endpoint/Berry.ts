import { cacheKeys, CACHE_CONFIG } from "../Client/Cache";
import { NamedAPIResource } from "../Interface/Common";
import { SearchOptions } from "../Client/Types";
import {
   Berry,
   BerryFirmness,
   BerryFlavor,
   BerryFlavorMap,
} from "../Interface/Berry";
import {
   BaseEndpoint,
   EndpointConfig,
   BaseFilters,
   FilterBuilder,
   endpointUtils,
} from "./Shared/Base";

/**
 * Extended filters for berry-specific queries
 */
export interface BerryFilters extends BaseFilters {
   /** Filter by minimum growth time (hours) */
   min_growth_time?: number;
   /** Filter by maximum growth time (hours) */
   max_growth_time?: number;
   /** Filter by firmness */
   firmness?: string;
   /** Filter by flavor */
   flavor?: string;
   /** Filter by minimum size (millimeters) */
   min_size?: number;
   /** Filter by maximum size (millimeters) */
   max_size?: number;
}

/**
 * Berry list item (simplified for list views)
 */
export interface BerryListItem extends NamedAPIResource {
   id?: number;
}

/**
 * Berry search and filter options
 */
export interface BerrySearchOptions extends SearchOptions {
   /** Filter by firmness during search */
   firmness?: string;
   /** Filter by flavor during search */
   flavor?: string;
}

/**
 * Berry endpoint configuration
 */
const berryConfig: EndpointConfig = {
   baseUrl: "https://pokeapi.co/api/v2/berry/",
   resourceName: "berry",
   defaultLimit: 20,
   cacheTime: {
      list: CACHE_CONFIG.STALE_TIME.LONG,
      detail: CACHE_CONFIG.STALE_TIME.EXTRA_LONG,
   },
};

/**
 * Berry Firmness endpoint configuration
 */
const berryFirmnessConfig: EndpointConfig = {
   baseUrl: "https://pokeapi.co/api/v2/berry-firmness/",
   resourceName: "berry-firmness",
   defaultLimit: 20,
   cacheTime: {
      list: CACHE_CONFIG.STALE_TIME.EXTRA_LONG,
      detail: CACHE_CONFIG.STALE_TIME.EXTRA_LONG,
   },
};

/**
 * Berry Flavor endpoint configuration
 */
const berryFlavorConfig: EndpointConfig = {
   baseUrl: "https://pokeapi.co/api/v2/berry-flavor/",
   resourceName: "berry-flavor",
   defaultLimit: 20,
   cacheTime: {
      list: CACHE_CONFIG.STALE_TIME.EXTRA_LONG,
      detail: CACHE_CONFIG.STALE_TIME.EXTRA_LONG,
   },
};

/**
 * BerryEndpoint class for managing berry-related API calls
 */
export class BerryEndpoint extends BaseEndpoint<Berry, BerryListItem> {
   constructor() {
      super(berryConfig, cacheKeys.berries);
   }

   /**
    * Get berries with advanced filtering
    * @param filters - Berry-specific filters
    * @returns Promise resolving to filtered berries
    */
   async getBerries(filters: BerryFilters = {}): Promise<{
      results: BerryListItem[];
      count: number;
      hasMore: boolean;
   }> {
      try {
         const response = await this.getList(filters);
         let filteredResults = response.results;

         // Apply client-side filters that require detailed data
         if (this.hasDetailedFilters(filters)) {
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
                  return this.matchesDetailedFilters(item.detail, filters);
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
    * Search berries with enhanced options
    * @param options - Enhanced search options
    * @returns Promise resolving to search results
    */
   async searchBerries(options: BerrySearchOptions): Promise<{
      results: BerryListItem[];
      total: number;
   }> {
      try {
         const baseSearch = await this.search(options);
         let results = baseSearch.results;

         // Apply additional search filters if specified
         if (options.firmness || options.flavor) {
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

                  if (options.firmness) {
                     const firmness = item.detail.firmness.name.toLowerCase();
                     if (!firmness.includes(options.firmness.toLowerCase())) {
                        return false;
                     }
                  }

                  if (options.flavor) {
                     const hasMatchingFlavor = item.detail.flavors.some(
                        (flavorMap: BerryFlavorMap) =>
                           flavorMap.flavor.name
                              .toLowerCase()
                              .includes(options.flavor!.toLowerCase())
                     );
                     if (!hasMatchingFlavor) return false;
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
    * Get berry by name or ID with error handling
    * @param identifier - Berry name or ID
    * @returns Promise resolving to berry details
    */
   async getBerry(identifier: string | number): Promise<Berry> {
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
    * Get berries by firmness
    * @param firmness - Firmness name or ID
    * @returns Promise resolving to berries with specified firmness
    */
   async getBerriesByFirmness(firmness: string | number): Promise<Berry[]> {
      try {
         const allBerries = await this.getList({ limit: 1000 });

         const detailedBerries = await Promise.all(
            allBerries.results.slice(0, 100).map(async (item) => {
               try {
                  return await this.getById(
                     endpointUtils.extractIdFromUrl(item.url) || item.name
                  );
               } catch {
                  return null;
               }
            })
         );

         const firmnessName =
            typeof firmness === "string"
               ? firmness.toLowerCase()
               : firmness.toString();

         return detailedBerries.filter((berry): berry is Berry => {
            if (!berry) return false;
            return (
               berry.firmness.name.toLowerCase() === firmnessName ||
               endpointUtils
                  .extractIdFromUrl(berry.firmness.url)
                  ?.toString() === firmnessName
            );
         });
      } catch (error) {
         throw this.handleError(error);
      }
   }

   /**
    * Get berries by flavor
    * @param flavor - Flavor name or ID
    * @returns Promise resolving to berries with specified flavor
    */
   async getBerriesByFlavor(flavor: string | number): Promise<Berry[]> {
      try {
         const allBerries = await this.getList({ limit: 1000 });

         const detailedBerries = await Promise.all(
            allBerries.results.slice(0, 100).map(async (item) => {
               try {
                  return await this.getById(
                     endpointUtils.extractIdFromUrl(item.url) || item.name
                  );
               } catch {
                  return null;
               }
            })
         );

         const flavorName =
            typeof flavor === "string"
               ? flavor.toLowerCase()
               : flavor.toString();

         return detailedBerries.filter((berry): berry is Berry => {
            if (!berry) return false;
            return berry.flavors.some(
               (flavorMap) =>
                  flavorMap.flavor.name.toLowerCase() === flavorName ||
                  endpointUtils
                     .extractIdFromUrl(flavorMap.flavor.url)
                     ?.toString() === flavorName
            );
         });
      } catch (error) {
         throw this.handleError(error);
      }
   }

   /**
    * Get random berry
    * @returns Promise resolving to random berry
    */
   async getRandomBerry(): Promise<Berry> {
      try {
         const count = await this.getCount();
         const randomId = Math.floor(Math.random() * count) + 1;
         return await this.getBerry(randomId);
      } catch (error) {
         throw this.handleError(error);
      }
   }

   /**
    * Check if filters require detailed berry data
    * @param filters - Berry filters
    * @returns Boolean indicating if detailed data is needed
    */
   private hasDetailedFilters(filters: BerryFilters): boolean {
      return !!(
         filters.min_growth_time ||
         filters.max_growth_time ||
         filters.firmness ||
         filters.flavor ||
         filters.min_size ||
         filters.max_size
      );
   }

   /**
    * Check if berry matches detailed filters
    * @param berry - Berry detail data
    * @param filters - Berry filters
    * @returns Boolean indicating if berry matches filters
    */
   private matchesDetailedFilters(
      berry: Berry,
      filters: BerryFilters
   ): boolean {
      if (
         filters.min_growth_time &&
         berry.growth_time < filters.min_growth_time
      ) {
         return false;
      }

      if (
         filters.max_growth_time &&
         berry.growth_time > filters.max_growth_time
      ) {
         return false;
      }

      if (filters.min_size && berry.size < filters.min_size) {
         return false;
      }

      if (filters.max_size && berry.size > filters.max_size) {
         return false;
      }

      if (filters.firmness) {
         const firmness = berry.firmness.name.toLowerCase();
         if (!firmness.includes(filters.firmness.toLowerCase())) {
            return false;
         }
      }

      if (filters.flavor) {
         const hasMatchingFlavor = berry.flavors.some((flavorMap) =>
            flavorMap.flavor.name
               .toLowerCase()
               .includes(filters.flavor!.toLowerCase())
         );
         if (!hasMatchingFlavor) return false;
      }

      return true;
   }
}

/**
 * BerryFirmnessEndpoint class for managing berry firmness API calls
 */
export class BerryFirmnessEndpoint extends BaseEndpoint<
   BerryFirmness,
   NamedAPIResource
> {
   constructor() {
      super(berryFirmnessConfig, cacheKeys.berryFirmness);
   }

   /**
    * Get berry firmness by name or ID
    * @param identifier - Firmness name or ID
    * @returns Promise resolving to berry firmness details
    */
   async getBerryFirmness(identifier: string | number): Promise<BerryFirmness> {
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
    * Get all berry firmness options
    * @returns Promise resolving to all firmness options
    */
   async getAllFirmness(): Promise<BerryFirmness[]> {
      try {
         const response = await this.getList({ limit: 100 });
         return await this.getByIds(
            response.results.map(
               (item) => endpointUtils.extractIdFromUrl(item.url) || item.name
            )
         );
      } catch (error) {
         throw this.handleError(error);
      }
   }
}

/**
 * BerryFlavorEndpoint class for managing berry flavor API calls
 */
export class BerryFlavorEndpoint extends BaseEndpoint<
   BerryFlavor,
   NamedAPIResource
> {
   constructor() {
      super(berryFlavorConfig, cacheKeys.berryFlavors);
   }

   /**
    * Get berry flavor by name or ID
    * @param identifier - Flavor name or ID
    * @returns Promise resolving to berry flavor details
    */
   async getBerryFlavor(identifier: string | number): Promise<BerryFlavor> {
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
    * Get all berry flavor options
    * @returns Promise resolving to all flavor options
    */
   async getAllFlavors(): Promise<BerryFlavor[]> {
      try {
         const response = await this.getList({ limit: 100 });
         return await this.getByIds(
            response.results.map(
               (item) => endpointUtils.extractIdFromUrl(item.url) || item.name
            )
         );
      } catch (error) {
         throw this.handleError(error);
      }
   }
}

/**
 * Filter builder for berry queries
 */
export class BerryFilterBuilder extends FilterBuilder<BerryFilters> {
   /**
    * Filter by minimum growth time
    * @param hours - Minimum growth time in hours
    * @returns Builder instance
    */
   minGrowthTime(hours: number): this {
      return this.custom("min_growth_time", hours);
   }

   /**
    * Filter by maximum growth time
    * @param hours - Maximum growth time in hours
    * @returns Builder instance
    */
   maxGrowthTime(hours: number): this {
      return this.custom("max_growth_time", hours);
   }

   /**
    * Filter by firmness
    * @param firmness - Firmness name
    * @returns Builder instance
    */
   firmness(firmness: string): this {
      return this.custom("firmness", firmness);
   }

   /**
    * Filter by flavor
    * @param flavor - Flavor name
    * @returns Builder instance
    */
   flavor(flavor: string): this {
      return this.custom("flavor", flavor);
   }

   /**
    * Filter by minimum size
    * @param size - Minimum size in millimeters
    * @returns Builder instance
    */
   minSize(size: number): this {
      return this.custom("min_size", size);
   }

   /**
    * Filter by maximum size
    * @param size - Maximum size in millimeters
    * @returns Builder instance
    */
   maxSize(size: number): this {
      return this.custom("max_size", size);
   }
}

/**
 * Singleton instances of the berry endpoints
 */
export const berryEndpoint = new BerryEndpoint();
export const berryFirmnessEndpoint = new BerryFirmnessEndpoint();
export const berryFlavorEndpoint = new BerryFlavorEndpoint();
