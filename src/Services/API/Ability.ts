import { BaseService } from "../Client";
import type { Ability } from "pokenode-ts";

export class AbilityService extends BaseService {
   async getAbility(identifier: string | number): Promise<Ability> {
      try {
         return typeof identifier === "string"
            ? await this.api.pokemon.getAbilityByName(identifier.toLowerCase())
            : await this.api.pokemon.getAbilityById(identifier);
      } catch (error) {
         throw new Error(`Failed to fetch ability: ${error}`);
      }
   }

   async getAbilityList(offset: number = 0, limit: number = 20) {
      return await this.api.pokemon.listAbilities(offset, limit);
   }

   async getAbilityDetails(abilityName: string) {
      const ability = await this.getAbility(abilityName);
      return {
         ...ability,
         pokemonWithAbility: ability.pokemon,
         effectEntries: ability.effect_entries,
         flavorTextEntries: ability.flavor_text_entries,
      };
   }
}
