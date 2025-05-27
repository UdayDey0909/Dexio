// src/Services/PokiAPI/Endpoints/EvolutionEndpoints.ts
import { BaseEndpoint } from "./Common";
import { NamedAPIResourceList } from "../Interface/Common";

/**
 * Evolution-specific endpoints
 */
export class EvolutionEndpoints extends BaseEndpoint {
   /**
    * Get evolution chain by ID
    */
   async getEvolutionChain(id: number) {
      try {
         return await this.client.client.getEvolutionChainById(id);
      } catch (error) {
         throw this.handleError(error);
      }
   }

   /**
    * Get evolution trigger by ID or name
    */
   async getEvolutionTrigger(id: number | string) {
      return this.fetchResource("evolution-trigger", id);
   }

   /**
    * Get list of evolution triggers
    */
   async getEvolutionTriggersList(params?: {
      limit?: number;
      offset?: number;
   }): Promise<NamedAPIResourceList> {
      return this.fetchResourceList("evolution-trigger", params);
   }

   /**
    * Search evolution chains by Pokemon name
    */
   async searchEvolutionChains(pokemonName: string) {
      try {
         const pokemon = await this.client.client.getPokemonByName(pokemonName);
         const species = await this.client.client.getPokemonSpeciesById(
            pokemon.id
         );
         const chainId = this.extractIdFromUrl(species.evolution_chain.url);
         return await this.getEvolutionChain(chainId);
      } catch (error) {
         throw this.handleError(error);
      }
   }
}
