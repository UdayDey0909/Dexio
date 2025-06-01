import { BaseService } from "../Client";
import type { Berry, BerryFlavor, BerryFirmness } from "pokenode-ts";

export class BerryService extends BaseService {
   async getBerry(identifier: string | number): Promise<Berry> {
      try {
         return typeof identifier === "string"
            ? await this.api.berry.getBerryByName(identifier.toLowerCase())
            : await this.api.berry.getBerryById(identifier);
      } catch (error) {
         throw new Error(`Failed to fetch berry: ${error}`);
      }
   }

   async getBerryList(offset: number = 0, limit: number = 20) {
      return await this.api.berry.listBerries(offset, limit);
   }

   async getBerryFlavor(identifier: string | number): Promise<BerryFlavor> {
      try {
         return typeof identifier === "string"
            ? await this.api.berry.getBerryFlavorByName(
                 identifier.toLowerCase()
              )
            : await this.api.berry.getBerryFlavorById(identifier);
      } catch (error) {
         throw new Error(`Failed to fetch berry flavor: ${error}`);
      }
   }

   async getBerryFlavorList(offset: number = 0, limit: number = 20) {
      return await this.api.berry.listBerryFlavors(offset, limit);
   }

   async getBerryFirmness(identifier: string | number): Promise<BerryFirmness> {
      try {
         return typeof identifier === "string"
            ? await this.api.berry.getBerryFirmnessByName(
                 identifier.toLowerCase()
              )
            : await this.api.berry.getBerryFirmnessById(identifier);
      } catch (error) {
         throw new Error(`Failed to fetch berry firmness: ${error}`);
      }
   }

   async getBerryFirmnessList(offset: number = 0, limit: number = 20) {
      return await this.api.berry.listBerryFirmnesses(offset, limit);
   }

   async getBerriesByFlavor(flavorName: string) {
      const flavor = await this.getBerryFlavor(flavorName);
      return flavor.berries;
   }
}
