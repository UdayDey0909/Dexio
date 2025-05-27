// src/Services/PokiAPI/Endpoints/TypeEndpoints.ts
import { BaseEndpoint } from "./Common";
import { NamedAPIResourceList } from "../Interface/Common";

/**
 * Type-specific endpoints
 */
export class TypeEndpoints extends BaseEndpoint {
   /**
    * Get type by ID or name
    */
   async getType(id: number | string) {
      try {
         return await this.client.client.getTypeByName(id.toString());
      } catch (error) {
         throw this.handleError(error);
      }
   }

   /**
    * Get list of types
    */
   async getTypesList(params?: {
      limit?: number;
      offset?: number;
   }): Promise<NamedAPIResourceList> {
      return this.fetchResourceList("type", params);
   }

   /**
    * Get all Pokemon of a specific type
    */
   async getPokemonByType(typeId: number | string) {
      const typeData = await this.getType(typeId);
      return typeData.pokemon;
   }

   /**
    * Get type effectiveness chart
    */
   async getTypeEffectivenessChart() {
      const allTypes = await this.getTypesList({ limit: 100, offset: 0 });
      const typeEffectiveness: Record<string, any> = {};

      for (const typeRef of allTypes.results) {
         const typeData = await this.getType(typeRef.name);
         typeEffectiveness[typeRef.name] = {
            double_damage_to: typeData.damage_relations.double_damage_to,
            half_damage_to: typeData.damage_relations.half_damage_to,
            no_damage_to: typeData.damage_relations.no_damage_to,
            double_damage_from: typeData.damage_relations.double_damage_from,
            half_damage_from: typeData.damage_relations.half_damage_from,
            no_damage_from: typeData.damage_relations.no_damage_from,
         };
      }

      return typeEffectiveness;
   }
}
