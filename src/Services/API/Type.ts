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

   async getTypeList(offset: number = 0, limit: number = 20) {
      this.validatePaginationParams(offset, limit);

      return this.executeWithErrorHandling(
         async () => await this.api.pokemon.listTypes(offset, limit),
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

   async batchGetTypes(identifiers: (string | number)[]): Promise<Type[]> {
      if (!Array.isArray(identifiers) || identifiers.length === 0) {
         throw new Error("Identifiers array cannot be empty");
      }

      if (identifiers.length > 30) {
         throw new Error("Batch size cannot exceed 30 types");
      }

      return this.batchOperation(
         identifiers,
         async (id) => await this.getType(id),
         5
      );
   }

   async getAllTypes(): Promise<Type[]> {
      const typeNames = [
         "normal",
         "fire",
         "water",
         "electric",
         "grass",
         "ice",
         "fighting",
         "poison",
         "ground",
         "flying",
         "psychic",
         "bug",
         "rock",
         "ghost",
         "dragon",
         "dark",
         "steel",
         "fairy",
      ];

      return this.batchOperation(
         typeNames,
         async (name) => await this.getType(name),
         6
      );
   }

   async getTypeMatchups(attackingType: string, defendingType: string) {
      this.validateIdentifier(attackingType, "Attacking type");
      this.validateIdentifier(defendingType, "Defending type");

      const type = await this.getType(attackingType);

      // Check effectiveness against defending type
      const isDoubleDamage = type.damage_relations.double_damage_to.some(
         (t) => t.name === defendingType.toLowerCase()
      );
      const isHalfDamage = type.damage_relations.half_damage_to.some(
         (t) => t.name === defendingType.toLowerCase()
      );
      const isNoDamage = type.damage_relations.no_damage_to.some(
         (t) => t.name === defendingType.toLowerCase()
      );

      let multiplier = 1;
      let effectiveness:
         | "normal"
         | "super_effective"
         | "not_very_effective"
         | "no_effect" = "normal";

      if (isDoubleDamage) {
         multiplier = 2;
         effectiveness = "super_effective";
      } else if (isHalfDamage) {
         multiplier = 0.5;
         effectiveness = "not_very_effective";
      } else if (isNoDamage) {
         multiplier = 0;
         effectiveness = "no_effect";
      }

      return {
         attackingType,
         defendingType,
         multiplier,
         effectiveness,
      };
   }
}
