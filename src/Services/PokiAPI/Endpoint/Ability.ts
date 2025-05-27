// src/Services/PokiAPI/Endpoints/AbilityEndpoints.ts
import { BaseEndpoint } from "./Common";
import { Ability } from "../Interface/Ability";
import { NamedAPIResourceList } from "../Interface/Common";

/**
 * Ability-specific endpoints
 */
export class AbilityEndpoints extends BaseEndpoint {
   private readonly endpoint = "ability";

   /**
    * Get a specific ability by ID or name
    */
   async getAbility(id: number | string): Promise<Ability> {
      return this.fetchResource<Ability>(this.endpoint, id);
   }

   /**
    * Get a list of all abilities
    */
   async getAbilitiesList(params?: {
      limit?: number;
      offset?: number;
   }): Promise<NamedAPIResourceList> {
      return this.fetchResourceList(this.endpoint, params);
   }

   /**
    * Search abilities by name
    */
   async searchAbilities(
      query: string,
      limit: number = 10
   ): Promise<NamedAPIResourceList> {
      const allAbilities = await this.getAbilitiesList({
         limit: 1000,
         offset: 0,
      });

      const filteredResults = allAbilities.results.filter((ability) =>
         ability.name.toLowerCase().includes(query.toLowerCase())
      );

      return {
         count: filteredResults.length,
         next: null,
         previous: null,
         results: filteredResults.slice(0, limit),
      };
   }

   /**
    * Get abilities by generation
    */
   async getAbilitiesByGeneration(
      generationId: number | string
   ): Promise<Ability[]> {
      const allAbilities = await this.getAbilitiesList({
         limit: 1000,
         offset: 0,
      });
      const abilitiesData = await Promise.allSettled(
         allAbilities.results.map((ability) => this.getAbility(ability.name))
      );

      return abilitiesData
         .filter(
            (result): result is PromiseFulfilledResult<Ability> =>
               result.status === "fulfilled"
         )
         .map((result) => result.value)
         .filter((ability) => {
            const genId = this.extractIdFromUrl(ability.generation.url);
            return (
               genId ===
               (typeof generationId === "string"
                  ? parseInt(generationId)
                  : generationId)
            );
         });
   }
}
