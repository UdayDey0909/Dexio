// src/Services/PokiAPI/Endpoints/GameEndpoints.ts
import { BaseEndpoint } from "./Common";
import { NamedAPIResourceList } from "../Model/Common";

/**
 * Game-specific endpoints
 */
export class GameEndpoints extends BaseEndpoint {
   /**
    * Get generation by ID or name
    */
   async getGeneration(id: number | string) {
      try {
         return await this.client.client.getGenerationByName(id.toString());
      } catch (error) {
         throw this.handleError(error);
      }
   }

   /**
    * Get list of generations
    */
   async getGenerationsList(params?: {
      limit?: number;
      offset?: number;
   }): Promise<NamedAPIResourceList> {
      return this.fetchResourceList("generation", params);
   }

   /**
    * Get Pokedex by ID or name
    */
   async getPokedex(id: number | string) {
      return this.fetchResource("pokedex", id);
   }

   /**
    * Get list of Pokedexes
    */
   async getPokedexesList(params?: {
      limit?: number;
      offset?: number;
   }): Promise<NamedAPIResourceList> {
      return this.fetchResourceList("pokedex", params);
   }

   /**
    * Get version by ID or name
    */
   async getVersion(id: number | string) {
      return this.fetchResource("version", id);
   }

   /**
    * Get list of versions
    */
   async getVersionsList(params?: {
      limit?: number;
      offset?: number;
   }): Promise<NamedAPIResourceList> {
      return this.fetchResourceList("version", params);
   }

   /**
    * Get version group by ID or name
    */
   async getVersionGroup(id: number | string) {
      return this.fetchResource("version-group", id);
   }

   /**
    * Get list of version groups
    */
   async getVersionGroupsList(params?: {
      limit?: number;
      offset?: number;
   }): Promise<NamedAPIResourceList> {
      return this.fetchResourceList("version-group", params);
   }
}
