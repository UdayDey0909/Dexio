// src/Services/PokiAPI/Endpoints/ContestEndpoints.ts
import { BaseEndpoint } from "./Common";
import { NamedAPIResourceList } from "../Interface/Common";

/**
 * Contest-specific endpoints
 */
export class ContestEndpoints extends BaseEndpoint {
   /**
    * Get contest type by ID or name
    */
   async getContestType(id: number | string) {
      return this.fetchResource("contest-type", id);
   }

   /**
    * Get list of contest types
    */
   async getContestTypesList(params?: {
      limit?: number;
      offset?: number;
   }): Promise<NamedAPIResourceList> {
      return this.fetchResourceList("contest-type", params);
   }

   /**
    * Get contest effect by ID
    */
   async getContestEffect(id: number) {
      return this.fetchResource("contest-effect", id);
   }

   /**
    * Get list of contest effects
    */
   async getContestEffectsList(params?: {
      limit?: number;
      offset?: number;
   }): Promise<NamedAPIResourceList> {
      return this.fetchResourceList("contest-effect", params);
   }

   /**
    * Get super contest effect by ID
    */
   async getSuperContestEffect(id: number) {
      return this.fetchResource("super-contest-effect", id);
   }

   /**
    * Get list of super contest effects
    */
   async getSuperContestEffectsList(params?: {
      limit?: number;
      offset?: number;
   }): Promise<NamedAPIResourceList> {
      return this.fetchResourceList("super-contest-effect", params);
   }
}
