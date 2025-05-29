import { BaseEndpoint } from "./Shared/Base";
import {
   Move,
   MoveCategory,
   MoveDamageClass,
   NamedAPIResource,
   NamedAPIResourceList,
} from "pokenode-ts";

/**
 * Handles move-related API interactions including categories, damage classes, and targets.
 */
export class MoveEndpoint extends BaseEndpoint {
   /**
    * Get all moves with pagination
    */
   async getList(options: { offset?: number; limit?: number } = {}) {
      const { offset, limit } = this.normalizePagination(options);
      return this.handleRequest<NamedAPIResourceList>(() =>
         this.client.listMoves(offset, limit)
      );
   }

   /**
    * Get move by ID or name
    */
   async getById(id: number | string) {
      return this.handleRequest<Move>(() => this.client.getMoveById(id));
   }

   /**
    * Get moves by type
    */
   async getByType(typeName: string | number) {
      const type = await this.handleRequest(() =>
         typeof typeName === "number"
            ? this.client.getTypeById(typeName)
            : this.client.getTypeByName(typeName)
      );
      return type.moves;
   }

   /**
    * Get moves by damage class (physical, special, status)
    */
   async getByDamageClass(damageClassName: string) {
      return this.handleRequest<MoveDamageClass>(() =>
         this.client.getMoveDamageClassById(damageClassName)
      );
   }

   /**
    * Search moves by name pattern
    */
   async search(query: string, limit = 20) {
      return this.handleRequest(async () => {
         const response = await this.axios.get<{ results: NamedAPIResource[] }>(
            `/move?limit=1000`
         );
         const allMoves: NamedAPIResource[] = response.data.results;

         const searchTerm = query.toLowerCase();
         const filtered = allMoves
            .filter((move) => move.name.toLowerCase().includes(searchTerm))
            .slice(0, limit);

         return { results: filtered, count: filtered.length };
      });
   }

   // Category methods
   async getCategoryById(id: number | string) {
      return this.handleRequest<MoveCategory>(() =>
         this.client.getMoveCategoryById(id)
      );
   }

   // Damage class methods
   async getDamageClassById(id: number | string) {
      return this.handleRequest<MoveDamageClass>(() =>
         this.client.getMoveDamageClassById(id)
      );
   }

   // Target methods
   async getTargetById(id: number | string) {
      return this.handleRequest(() => this.client.getMoveTargetById(id));
   }

   // Learn method methods
   async getLearnMethodById(id: number | string) {
      return this.handleRequest(() => this.client.getMoveLearnMethodById(id));
   }
}
