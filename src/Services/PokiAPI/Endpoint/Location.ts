// src/Services/PokiAPI/Endpoints/LocationEndpoints.ts
import { BaseEndpoint } from "./Common";
import { NamedAPIResourceList } from "../Model/Common";

/**
 * Location-specific endpoints
 */
export class LocationEndpoints extends BaseEndpoint {
   /**
    * Get location by ID or name
    */
   async getLocation(id: number | string) {
      return this.fetchResource("location", id);
   }

   /**
    * Get list of locations
    */
   async getLocationsList(params?: {
      limit?: number;
      offset?: number;
   }): Promise<NamedAPIResourceList> {
      return this.fetchResourceList("location", params);
   }

   /**
    * Get location area by ID or name
    */
   async getLocationArea(id: number | string) {
      return this.fetchResource("location-area", id);
   }

   /**
    * Get list of location areas
    */
   async getLocationAreasList(params?: {
      limit?: number;
      offset?: number;
   }): Promise<NamedAPIResourceList> {
      return this.fetchResourceList("location-area", params);
   }

   /**
    * Get Pal Park area by ID or name
    */
   async getPalParkArea(id: number | string) {
      return this.fetchResource("pal-park-area", id);
   }

   /**
    * Get list of Pal Park areas
    */
   async getPalParkAreasList(params?: {
      limit?: number;
      offset?: number;
   }): Promise<NamedAPIResourceList> {
      return this.fetchResourceList("pal-park-area", params);
   }

   /**
    * Get region by ID or name
    */
   async getRegion(id: number | string) {
      return this.fetchResource("region", id);
   }

   /**
    * Get list of regions
    */
   async getRegionsList(params?: {
      limit?: number;
      offset?: number;
   }): Promise<NamedAPIResourceList> {
      return this.fetchResourceList("region", params);
   }

   /**
    * Search locations by name
    */
   async searchLocations(
      query: string,
      limit: number = 10
   ): Promise<NamedAPIResourceList> {
      const allLocations = await this.getLocationsList({
         limit: 1000,
         offset: 0,
      });

      const filteredResults = allLocations.results.filter((location) =>
         location.name.toLowerCase().includes(query.toLowerCase())
      );

      return {
         count: filteredResults.length,
         next: null,
         previous: null,
         results: filteredResults.slice(0, limit),
      };
   }
}
