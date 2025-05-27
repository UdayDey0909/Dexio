// src/Services/PokiAPI/Endpoints/MoveEndpoints.ts
import { BaseEndpoint } from "./Common";
import { NamedAPIResourceList } from "../Interface/Common";

/**
 * Move-specific endpoints
 */
export class MoveEndpoints extends BaseEndpoint {
   /**
    * Get move by ID or name
    */
   async getMove(id: number | string) {
      try {
         return await this.client.client.getMoveByName(id.toString());
      } catch (error) {
         throw this.handleError(error);
      }
   }

   /**
    * Get list of moves
    */
   async getMovesList(params?: {
      limit?: number;
      offset?: number;
   }): Promise<NamedAPIResourceList> {
      return this.fetchResourceList("move", params);
   }

   /**
    * Get move ailment by ID or name
    */
   async getMoveAilment(id: number | string) {
      return this.fetchResource("move-ailment", id);
   }

   /**
    * Get list of move ailments
    */
   async getMoveAilmentsList(params?: {
      limit?: number;
      offset?: number;
   }): Promise<NamedAPIResourceList> {
      return this.fetchResourceList("move-ailment", params);
   }

   /**
    * Get move battle style by ID or name
    */
   async getMoveBattleStyle(id: number | string) {
      return this.fetchResource("move-battle-style", id);
   }

   /**
    * Get list of move battle styles
    */
   async getMoveBattleStylesList(params?: {
      limit?: number;
      offset?: number;
   }): Promise<NamedAPIResourceList> {
      return this.fetchResourceList("move-battle-style", params);
   }

   /**
    * Get move category by ID or name
    */
   async getMoveCategory(id: number | string) {
      return this.fetchResource("move-category", id);
   }

   /**
    * Get list of move categories
    */
   async getMoveCategoriesList(params?: {
      limit?: number;
      offset?: number;
   }): Promise<NamedAPIResourceList> {
      return this.fetchResourceList("move-category", params);
   }

   /**
    * Get move damage class by ID or name
    */
   async getMoveDamageClass(id: number | string) {
      return this.fetchResource("move-damage-class", id);
   }

   /**
    * Get list of move damage classes
    */
   async getMoveDamageClassesList(params?: {
      limit?: number;
      offset?: number;
   }): Promise<NamedAPIResourceList> {
      return this.fetchResourceList("move-damage-class", params);
   }

   /**
    * Get move learn method by ID or name
    */
   async getMoveLearnMethod(id: number | string) {
      return this.fetchResource("move-learn-method", id);
   }

   /**
    * Get list of move learn methods
    */
   async getMoveLearnMethodsList(params?: {
      limit?: number;
      offset?: number;
   }): Promise<NamedAPIResourceList> {
      return this.fetchResourceList("move-learn-method", params);
   }

   /**
    * Get move target by ID or name
    */
   async getMoveTarget(id: number | string) {
      return this.fetchResource("move-target", id);
   }

   /**
    * Get list of move targets
    */
   async getMoveTargetsList(params?: {
      limit?: number;
      offset?: number;
   }): Promise<NamedAPIResourceList> {
      return this.fetchResourceList("move-target", params);
   }

   /**
    * Search moves by name
    */
   async searchMoves(
      query: string,
      limit: number = 10
   ): Promise<NamedAPIResourceList> {
      const allMoves = await this.getMovesList({ limit: 2000, offset: 0 });

      const filteredResults = allMoves.results.filter((move) =>
         move.name.toLowerCase().includes(query.toLowerCase())
      );

      return {
         count: filteredResults.length,
         next: null,
         previous: null,
         results: filteredResults.slice(0, limit),
      };
   }
}
