import { BaseEndpoint } from "./Shared/Base";
import { Type, NamedAPIResourceList } from "pokenode-ts";

/**
 * Handles Pokémon type-related API interactions.
 */
export class TypeEndpoint extends BaseEndpoint {
   /**
    * Get all Pokémon types with pagination
    */
   async getList(options: { offset?: number; limit?: number } = {}) {
      const { offset, limit } = this.normalizePagination(options);
      return this.handleRequest<NamedAPIResourceList>(() =>
         this.client.listTypes(offset, limit)
      );
   }

   /**
    * Get type by ID or name
    */
   async getById(id: number | string) {
      return this.handleRequest<Type>(() =>
         this.client.getTypeById(Number(id))
      );
   }

   /**
    * Get all types (convenience method)
    */
   async getAll() {
      return this.getList({ limit: 50 }); // There are currently 18-20 types
   }

   /**
    * Get type effectiveness chart
    */
   async getEffectivenessChart() {
      const allTypes = await this.getAll();
      const typeDetails = await Promise.all(
         allTypes.results.map((type) => this.getById(type.name))
      );

      return typeDetails.map((type) => ({
         name: type.name,
         doubleDamageTo: type.damage_relations.double_damage_to,
         halfDamageTo: type.damage_relations.half_damage_to,
         noDamageTo: type.damage_relations.no_damage_to,
         doubleDamageFrom: type.damage_relations.double_damage_from,
         halfDamageFrom: type.damage_relations.half_damage_from,
         noDamageFrom: type.damage_relations.no_damage_from,
      }));
   }
}
