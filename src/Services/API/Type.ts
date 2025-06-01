import { BaseService } from "../Client";
import type { Type } from "pokenode-ts";

export class TypeService extends BaseService {
   async getType(identifier: string | number): Promise<Type> {
      this.validateIdentifier(identifier, "Type");

      return this.executeWithErrorHandling(async () => {
         return typeof identifier === "string"
            ? await this.api.pokemon.getTypeByName(
                 identifier.toLowerCase().trim()
              )
            : await this.api.pokemon.getTypeById(identifier);
      }, `Failed to fetch type: ${identifier}`);
   }

   async getTypeList() {
      return this.executeWithErrorHandling(
         async () => await this.api.pokemon.listTypes(),
         "Failed to fetch type list"
      );
   }

   async getPokemonByType(typeName: string) {
      this.validateIdentifier(typeName, "Type name");

      const type = await this.getType(typeName);
      return type.pokemon.map((p) => p.pokemon);
   }

   async getTypeEffectiveness(typeName: string) {
      this.validateIdentifier(typeName, "Type name");

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
      this.validateIdentifier(typeName, "Type name");

      const type = await this.getType(typeName);
      return type.moves;
   }
}
