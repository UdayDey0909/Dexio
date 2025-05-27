// src/Services/PokiAPI/Endpoints/StatEndpoints.ts
import { BaseEndpoint } from "./Common";
import { NamedAPIResourceList } from "../Interface/Common";

/**
 * Stat-specific endpoints
 */
export class StatEndpoints extends BaseEndpoint {
   /**
    * Get stat by ID or name
    */
   async getStat(id: number | string) {
      return this.fetchResource("stat", id);
   }

   /**
    * Get list of stats
    */
   async getStatsList(params?: {
      limit?: number;
      offset?: number;
   }): Promise<NamedAPIResourceList> {
      return this.fetchResourceList("stat", params);
   }

   /**
    * Get characteristic by ID
    */
   async getCharacteristic(id: number) {
      return this.fetchResource("characteristic", id);
   }

   /**
    * Get list of characteristics
    */
   async getCharacteristicsList(params?: {
      limit?: number;
      offset?: number;
   }): Promise<NamedAPIResourceList> {
      return this.fetchResourceList("characteristic", params);
   }

   /**
    * Get growth rate by ID or name
    */
   async getGrowthRate(id: number | string) {
      return this.fetchResource("growth-rate", id);
   }

   /**
    * Get list of growth rates
    */
   async getGrowthRatesList(params?: {
      limit?: number;
      offset?: number;
   }): Promise<NamedAPIResourceList> {
      return this.fetchResourceList("growth-rate", params);
   }

   /**
    * Get nature by ID or name
    */
   async getNature(id: number | string) {
      return this.fetchResource("nature", id);
   }

   /**
    * Get list of natures
    */
   async getNaturesList(params?: {
      limit?: number;
      offset?: number;
   }): Promise<NamedAPIResourceList> {
      return this.fetchResourceList("nature", params);
   }

   /**
    * Get Pokeathlon stat by ID or name
    */
   async getPokeathlonStat(id: number | string) {
      return this.fetchResource("pokeathlon-stat", id);
   }

   /**
    * Get list of Pokeathlon stats
    */
   async getPokeathlonStatsList(params?: {
      limit?: number;
      offset?: number;
   }): Promise<NamedAPIResourceList> {
      return this.fetchResourceList("pokeathlon-stat", params);
   }
}
