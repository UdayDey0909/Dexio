import { BaseService } from "../Client";
import type { EvolutionChain, EvolutionTrigger } from "pokenode-ts";

export class EvolutionService extends BaseService {
   async getEvolutionChain(id: number): Promise<EvolutionChain> {
      return await this.api.evolution.getEvolutionChainById(id);
   }

   async getEvolutionChainList(offset: number = 0, limit: number = 20) {
      return await this.api.evolution.listEvolutionChains(offset, limit);
   }

   async getEvolutionTrigger(
      identifier: string | number
   ): Promise<EvolutionTrigger> {
      try {
         return typeof identifier === "string"
            ? await this.api.evolution.getEvolutionTriggerByName(
                 identifier.toLowerCase()
              )
            : await this.api.evolution.getEvolutionTriggerById(identifier);
      } catch (error) {
         throw new Error(`Failed to fetch evolution trigger: ${error}`);
      }
   }

   async getEvolutionTriggerList(offset: number = 0, limit: number = 20) {
      return await this.api.evolution.listEvolutionTriggers(offset, limit);
   }

   async getFullEvolutionChain(pokemonName: string) {
      // You'll need to import PokemonService or pass species data
      // For now, creating a basic implementation
      const speciesUrl = `https://pokeapi.co/api/v2/pokemon-species/${pokemonName.toLowerCase()}`;
      const species = (await this.api.utility.getResourceByUrl(speciesUrl)) as {
         evolution_chain: { url: string };
      };
      const evolutionChainId = this.extractIdFromUrl(
         species.evolution_chain.url
      );
      if (evolutionChainId) {
         return await this.getEvolutionChain(evolutionChainId);
      }
      throw new Error(`Could not find evolution chain for ${pokemonName}`);
   }
}
