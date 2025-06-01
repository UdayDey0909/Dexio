import { BaseService } from "../Client";
import type { Location, LocationArea, Region } from "pokenode-ts";

export class LocationService extends BaseService {
   async getLocation(identifier: string | number): Promise<Location> {
      this.validateIdentifier(identifier, "Location");

      return this.executeWithErrorHandling(async () => {
         return typeof identifier === "string"
            ? await this.api.location.getLocationByName(
                 identifier.toLowerCase().trim()
              )
            : await this.api.location.getLocationById(identifier);
      }, `Failed to fetch location: ${identifier}`);
   }

   async getLocationList(offset: number = 0, limit: number = 20) {
      this.validatePaginationParams(offset, limit);

      return this.executeWithErrorHandling(
         async () => await this.api.location.listLocations(offset, limit),
         "Failed to fetch location list"
      );
   }

   async getLocationArea(identifier: string | number): Promise<LocationArea> {
      this.validateIdentifier(identifier, "Location Area");

      return this.executeWithErrorHandling(async () => {
         return typeof identifier === "string"
            ? await this.api.location.getLocationAreaByName(
                 identifier.toLowerCase().trim()
              )
            : await this.api.location.getLocationAreaById(identifier);
      }, `Failed to fetch location area: ${identifier}`);
   }

   async getLocationAreaList(offset: number = 0, limit: number = 20) {
      this.validatePaginationParams(offset, limit);

      return this.executeWithErrorHandling(
         async () => await this.api.location.listLocationAreas(offset, limit),
         "Failed to fetch location area list"
      );
   }

   async getRegion(identifier: string | number): Promise<Region> {
      this.validateIdentifier(identifier, "Region");

      return this.executeWithErrorHandling(async () => {
         return typeof identifier === "string"
            ? await this.api.location.getRegionByName(
                 identifier.toLowerCase().trim()
              )
            : await this.api.location.getRegionById(identifier);
      }, `Failed to fetch region: ${identifier}`);
   }

   async getRegionList(offset: number = 0, limit: number = 20) {
      this.validatePaginationParams(offset, limit);

      return this.executeWithErrorHandling(
         async () => await this.api.location.listRegions(offset, limit),
         "Failed to fetch region list"
      );
   }

   async getLocationsByRegion(regionName: string) {
      this.validateIdentifier(regionName, "Region name");

      const region = await this.getRegion(regionName);
      return region.locations;
   }
}
