import { BaseService } from "../Client";
import type { EvolutionChain, EvolutionTrigger } from "pokenode-ts";

export class EvolutionService extends BaseService {
   async getEvolutionChain(id: number): Promise<EvolutionChain> {
      this.validateIdentifier(id, "Evolution Chain");

      return this.executeWithErrorHandling(
         async () => await this.api.evolution.getEvolutionChainById(id),
         `Failed to fetch evolution chain: ${id}`
      );
   }

   async getEvolutionChainList(offset: number = 0, limit: number = 20) {
      this.validatePaginationParams(offset, limit);

      return this.executeWithErrorHandling(
         async () =>
            await this.api.evolution.listEvolutionChains(offset, limit),
         "Failed to fetch evolution chain list"
      );
   }

   async getEvolutionTrigger(
      identifier: string | number
   ): Promise<EvolutionTrigger> {
      this.validateIdentifier(identifier, "Evolution Trigger");

      return this.executeWithErrorHandling(async () => {
         return typeof identifier === "string"
            ? await this.api.evolution.getEvolutionTriggerByName(
                 identifier.toLowerCase().trim()
              )
            : await this.api.evolution.getEvolutionTriggerById(identifier);
      }, `Failed to fetch evolution trigger: ${identifier}`);
   }

   async getEvolutionTriggerList(offset: number = 0, limit: number = 20) {
      this.validatePaginationParams(offset, limit);

      return this.executeWithErrorHandling(
         async () =>
            await this.api.evolution.listEvolutionTriggers(offset, limit),
         "Failed to fetch evolution trigger list"
      );
   }

   async getFullEvolutionChain(pokemonName: string) {
      this.validateIdentifier(pokemonName, "Pokemon name");

      return this.executeWithErrorHandling(async () => {
         const speciesUrl = `https://pokeapi.co/api/v2/pokemon-species/${pokemonName
            .toLowerCase()
            .trim()}`;
         const species = (await this.api.utility.getResourceByUrl(
            speciesUrl
         )) as {
            evolution_chain: { url: string };
         };

         const evolutionChainId = this.extractIdFromUrl(
            species.evolution_chain.url
         );
         if (!evolutionChainId) {
            throw new Error(
               `Could not extract evolution chain ID for ${pokemonName}`
            );
         }

         return await this.getEvolutionChain(evolutionChainId);
      }, `Failed to fetch full evolution chain for ${pokemonName}`);
   }
}
