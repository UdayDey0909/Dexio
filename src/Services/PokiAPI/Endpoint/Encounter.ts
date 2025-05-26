// src/Services/PokiAPI/Endpoints/EncounterEndpoints.ts
import { BaseEndpoint } from "./Common";
import { NamedAPIResourceList } from "../Model/Common";

/**
 * Encounter-specific endpoints
 */
export class EncounterEndpoints extends BaseEndpoint {
   /**
    * Get encounter method by ID or name
    */
   async getEncounterMethod(id: number | string) {
      return this.fetchResource("encounter-method", id);
   }

   /**
    * Get list of encounter methods
    */
   async getEncounterMethodsList(params?: {
      limit?: number;
      offset?: number;
   }): Promise<NamedAPIResourceList> {
      return this.fetchResourceList("encounter-method", params);
   }

   /**
    * Get encounter condition by ID or name
    */
   async getEncounterCondition(id: number | string) {
      return this.fetchResource("encounter-condition", id);
   }

   /**
    * Get list of encounter conditions
    */
   async getEncounterConditionsList(params?: {
      limit?: number;
      offset?: number;
   }): Promise<NamedAPIResourceList> {
      return this.fetchResourceList("encounter-condition", params);
   }

   /**
    * Get encounter condition value by ID or name
    */
   async getEncounterConditionValue(id: number | string) {
      return this.fetchResource("encounter-condition-value", id);
   }

   /**
    * Get list of encounter condition values
    */
   async getEncounterConditionValuesList(params?: {
      limit?: number;
      offset?: number;
   }): Promise<NamedAPIResourceList> {
      return this.fetchResourceList("encounter-condition-value", params);
   }
}
