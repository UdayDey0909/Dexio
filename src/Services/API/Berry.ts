import { BaseService } from "../Client";
import type { Berry, BerryFlavor, BerryFirmness } from "pokenode-ts";

export class BerryService extends BaseService {
   async getBerry(identifier: string | number): Promise<Berry> {
      this.validateIdentifier(identifier, "Berry");

      return this.executeWithErrorHandling(async () => {
         return typeof identifier === "string"
            ? await this.api.berry.getBerryByName(
                 identifier.toLowerCase().trim()
              )
            : await this.api.berry.getBerryById(identifier);
      }, `Failed to fetch berry: ${identifier}`);
   }

   async getBerryList(offset: number = 0, limit: number = 20) {
      this.validatePaginationParams(offset, limit);

      return this.executeWithErrorHandling(
         async () => await this.api.berry.listBerries(offset, limit),
         "Failed to fetch berry list"
      );
   }

   async getBerryFlavor(identifier: string | number): Promise<BerryFlavor> {
      this.validateIdentifier(identifier, "Berry Flavor");

      return this.executeWithErrorHandling(async () => {
         return typeof identifier === "string"
            ? await this.api.berry.getBerryFlavorByName(
                 identifier.toLowerCase().trim()
              )
            : await this.api.berry.getBerryFlavorById(identifier);
      }, `Failed to fetch berry flavor: ${identifier}`);
   }

   async getBerryFlavorList(offset: number = 0, limit: number = 20) {
      this.validatePaginationParams(offset, limit);

      return this.executeWithErrorHandling(
         async () => await this.api.berry.listBerryFlavors(offset, limit),
         "Failed to fetch berry flavor list"
      );
   }

   async getBerryFirmness(identifier: string | number): Promise<BerryFirmness> {
      this.validateIdentifier(identifier, "Berry Firmness");

      return this.executeWithErrorHandling(async () => {
         return typeof identifier === "string"
            ? await this.api.berry.getBerryFirmnessByName(
                 identifier.toLowerCase().trim()
              )
            : await this.api.berry.getBerryFirmnessById(identifier);
      }, `Failed to fetch berry firmness: ${identifier}`);
   }

   async getBerryFirmnessList(offset: number = 0, limit: number = 20) {
      this.validatePaginationParams(offset, limit);

      return this.executeWithErrorHandling(
         async () => await this.api.berry.listBerryFirmnesses(offset, limit),
         "Failed to fetch berry firmness list"
      );
   }

   async getBerriesByFlavor(flavorName: string) {
      this.validateIdentifier(flavorName, "Flavor name");

      const flavor = await this.getBerryFlavor(flavorName);
      return flavor.berries;
   }
}
