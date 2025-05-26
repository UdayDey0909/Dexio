// src/Services/PokiAPI/Endpoints/BerryEndpoints.ts
import { BaseEndpoint } from "./Common";
import { Berry, BerryFirmness, BerryFlavor } from "../Model/Berry";
import { NamedAPIResourceList } from "../Model/Common";

/**
 * Berry-specific endpoints
 */
export class BerryEndpoints extends BaseEndpoint {
   private readonly endpoint = "berry";

   /**
    * Get a specific berry by ID or name
    */
   async getBerry(id: number | string): Promise<Berry> {
      return this.fetchResource<Berry>(this.endpoint, id);
   }

   /**
    * Get a list of all berries
    */
   async getBerriesList(params?: {
      limit?: number;
      offset?: number;
   }): Promise<NamedAPIResourceList> {
      return this.fetchResourceList(this.endpoint, params);
   }

   /**
    * Get berry firmness by ID or name
    */
   async getBerryFirmness(id: number | string): Promise<BerryFirmness> {
      return this.fetchResource<BerryFirmness>("berry-firmness", id);
   }

   /**
    * Get berry flavor by ID or name
    */
   async getBerryFlavor(id: number | string): Promise<BerryFlavor> {
      return this.fetchResource<BerryFlavor>("berry-flavor", id);
   }

   /**
    * Get all berry firmness types
    */
   async getBerryFirmnessList(params?: {
      limit?: number;
      offset?: number;
   }): Promise<NamedAPIResourceList> {
      return this.fetchResourceList("berry-firmness", params);
   }

   /**
    * Get all berry flavors
    */
   async getBerryFlavorsList(params?: {
      limit?: number;
      offset?: number;
   }): Promise<NamedAPIResourceList> {
      return this.fetchResourceList("berry-flavor", params);
   }

   /**
    * Search berries by name
    */
   async searchBerries(
      query: string,
      limit: number = 10
   ): Promise<NamedAPIResourceList> {
      const allBerries = await this.getBerriesList({ limit: 1000, offset: 0 });

      const filteredResults = allBerries.results.filter((berry) =>
         berry.name.toLowerCase().includes(query.toLowerCase())
      );

      return {
         count: filteredResults.length,
         next: null,
         previous: null,
         results: filteredResults.slice(0, limit),
      };
   }

   /**
    * Get berries by firmness
    */
   async getBerriesByFirmness(firmnessId: number | string): Promise<Berry[]> {
      const firmness = await this.getBerryFirmness(firmnessId);
      const berriesData = await Promise.allSettled(
         firmness.berries.map((berry) =>
            this.getBerry(this.extractIdFromUrl(berry.url))
         )
      );

      return berriesData
         .filter(
            (result): result is PromiseFulfilledResult<Berry> =>
               result.status === "fulfilled"
         )
         .map((result) => result.value);
   }

   /**
    * Get berries by flavor
    */
   async getBerriesByFlavor(flavorId: number | string): Promise<Berry[]> {
      const flavor = await this.getBerryFlavor(flavorId);
      const berriesData = await Promise.allSettled(
         flavor.berries.map((berryMap) =>
            this.getBerry(this.extractIdFromUrl(berryMap.berry.url))
         )
      );

      return berriesData
         .filter(
            (result): result is PromiseFulfilledResult<Berry> =>
               result.status === "fulfilled"
         )
         .map((result) => result.value);
   }
}
