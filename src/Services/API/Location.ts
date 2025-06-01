import { BaseService } from "../Client";
import type { Location, LocationArea, Region } from "pokenode-ts";

export class LocationService extends BaseService {
   async getLocation(identifier: string | number): Promise<Location> {
      try {
         return typeof identifier === "string"
            ? await this.api.location.getLocationByName(
                 identifier.toLowerCase()
              )
            : await this.api.location.getLocationById(identifier);
      } catch (error) {
         throw new Error(`Failed to fetch location: ${error}`);
      }
   }

   async getLocationList(offset: number = 0, limit: number = 20) {
      return await this.api.location.listLocations(offset, limit);
   }

   async getLocationArea(identifier: string | number): Promise<LocationArea> {
      try {
         return typeof identifier === "string"
            ? await this.api.location.getLocationAreaByName(
                 identifier.toLowerCase()
              )
            : await this.api.location.getLocationAreaById(identifier);
      } catch (error) {
         throw new Error(`Failed to fetch location area: ${error}`);
      }
   }

   async getLocationAreaList(offset: number = 0, limit: number = 20) {
      return await this.api.location.listLocationAreas(offset, limit);
   }

   async getRegion(identifier: string | number): Promise<Region> {
      try {
         return typeof identifier === "string"
            ? await this.api.location.getRegionByName(identifier.toLowerCase())
            : await this.api.location.getRegionById(identifier);
      } catch (error) {
         throw new Error(`Failed to fetch region: ${error}`);
      }
   }

   async getRegionList(offset: number = 0, limit: number = 20) {
      return await this.api.location.listRegions(offset, limit);
   }

   async getLocationsByRegion(regionName: string) {
      const region = await this.getRegion(regionName);
      return region.locations;
   }
}
