import { BaseService } from "../Client";
import type { Type } from "pokenode-ts";

export class TypeService extends BaseService {
   async getType(identifier: string | number): Promise<Type> {
      try {
         return typeof identifier === "string"
            ? await this.api.pokemon.getTypeByName(identifier.toLowerCase())
            : await this.api.pokemon.getTypeById(identifier);
      } catch (error) {
         throw new Error(`Failed to fetch type: ${error}`);
      }
   }

   async getTypeList() {
      return await this.api.pokemon.listTypes();
   }

   async getPokemonByType(typeName: string) {
      const type = await this.getType(typeName);
      return type.pokemon.map((p) => p.pokemon);
   }

   async getTypeEffectiveness(typeName: string) {
      const type = await this.getType(typeName);
      return {
         doubleDamageTo: type.damage_relations.double_damage_to,
         doubleDamageFrom: type.damage_relations.double_damage_from,
         halfDamageTo: type.damage_relations.half_damage_to,
         halfDamageFrom: type.damage_relations.half_damage_from,
         noDamageTo: type.damage_relations.no_damage_to,
         noDamageFrom: type.damage_relations.no_damage_from,
      };
   }

   async getMovesByType(typeName: string) {
      const type = await this.getType(typeName);
      return type.moves;
   }
}
