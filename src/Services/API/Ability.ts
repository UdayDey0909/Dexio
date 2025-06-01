import { BaseService } from "../Client";
import type { Ability } from "pokenode-ts";

export class AbilityService extends BaseService {
   async getAbility(identifier: string | number): Promise<Ability> {
      this.validateIdentifier(identifier, "Ability");

      return this.executeWithErrorHandling(async () => {
         return typeof identifier === "string"
            ? await this.api.pokemon.getAbilityByName(
                 identifier.toLowerCase().trim()
              )
            : await this.api.pokemon.getAbilityById(identifier);
      }, `Failed to fetch ability: ${identifier}`);
   }

   async getAbilityList(offset: number = 0, limit: number = 20) {
      this.validatePaginationParams(offset, limit);

      return this.executeWithErrorHandling(
         async () => await this.api.pokemon.listAbilities(offset, limit),
         "Failed to fetch ability list"
      );
   }

   async getAbilityDetails(abilityName: string) {
      this.validateIdentifier(abilityName, "Ability name");

      const ability = await this.getAbility(abilityName);
      return {
         ...ability,
         pokemonWithAbility: ability.pokemon,
         effectEntries: ability.effect_entries,
         flavorTextEntries: ability.flavor_text_entries,
      };
   }
}
