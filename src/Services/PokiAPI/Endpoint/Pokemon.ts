// src/Services/PokiAPI/Endpoints/PokemonEndpoints.ts
import { Pokemon } from "pokenode-ts";
import { BaseEndpoint } from "./Common";
import { PokemonFilters, SearchOptions } from "../Client/Types";
import { NamedAPIResourceList } from "../Interface/Common";

/**
 * Pokemon-specific endpoints with advanced functionality
 */
export class PokemonEndpoints extends BaseEndpoint {
   private readonly endpoint = "pokemon";

   /**
    * Get a specific Pokemon by ID or name
    */
   async getPokemon(id: number | string): Promise<Pokemon> {
      try {
         // Use pokenode-ts client for full Pokemon data
         return await this.client.client.getPokemonByName(id.toString());
      } catch (error) {
         throw this.handleError(error);
      }
   }

   /**
    * Get a list of Pokemon with optional filtering
    */
   async getPokemonList(
      filters?: PokemonFilters
   ): Promise<NamedAPIResourceList> {
      return this.fetchResourceList(this.endpoint, filters);
   }

   /**
    * Search Pokemon by name or partial name
    */
   async searchPokemon(options: SearchOptions): Promise<NamedAPIResourceList> {
      const allPokemon = await this.getPokemonList({
         limit: 2000, // Get a large set to search through
         offset: 0,
      });

      const query = options.query.toLowerCase();
      const filteredResults = allPokemon.results.filter((pokemon) =>
         pokemon.name.toLowerCase().includes(query)
      );

      // Apply limit if specified
      const limit = options.limit || 10;
      const limitedResults = filteredResults.slice(0, limit);

      return {
         count: filteredResults.length,
         next: null,
         previous: null,
         results: limitedResults,
      };
   }

   /**
    * Get Pokemon species information
    */
   async getPokemonSpecies(id: number | string) {
      try {
         return await this.client.client.getPokemonSpeciesById(
            typeof id === "string" ? parseInt(id) : id
         );
      } catch (error) {
         throw this.handleError(error);
      }
   }

   /**
    * Get Pokemon evolution chain
    */
   async getPokemonEvolutionChain(id: number | string) {
      try {
         return await this.client.client.getEvolutionChainById(
            typeof id === "string" ? parseInt(id) : id
         );
      } catch (error) {
         throw this.handleError(error);
      }
   }

   /**
    * Get Pokemon encounters (locations where it can be found)
    */
   async getPokemonEncounters(id: number | string) {
      return this.fetchResource(`${this.endpoint}/${id}/encounters`, "");
   }

   /**
    * Get Pokemon moves that it can learn
    */
   async getPokemonMoves(id: number | string) {
      const pokemon = await this.getPokemon(id);
      return pokemon.moves;
   }

   /**
    * Get Pokemon by type
    */
   async getPokemonByType(typeId: number | string): Promise<any> {
      try {
         return await this.client.client.getTypeByName(typeId.toString());
      } catch (error) {
         throw this.handleError(error);
      }
   }

   /**
    * Get Pokemon by generation
    */
   async getPokemonByGeneration(generationId: number | string) {
      try {
         return await this.client.client.getGenerationById(
            typeof generationId === "string"
               ? parseInt(generationId)
               : generationId
         );
      } catch (error) {
         throw this.handleError(error);
      }
   }

   /**
    * Get multiple Pokemon by IDs (batch operation)
    */
   async getBatchPokemon(ids: (number | string)[]): Promise<Pokemon[]> {
      const promises = ids.map((id) => this.getPokemon(id));
      const results = await Promise.allSettled(promises);

      return results
         .filter(
            (result): result is PromiseFulfilledResult<Pokemon> =>
               result.status === "fulfilled"
         )
         .map((result) => result.value);
   }

   /**
    * Get random Pokemon
    */
   async getRandomPokemon(count: number = 1): Promise<Pokemon[]> {
      // Get total count first
      const list = await this.getPokemonList({ limit: 1, offset: 0 });
      const totalCount = list.count;

      // Generate random IDs
      const randomIds = Array.from(
         { length: count },
         () => Math.floor(Math.random() * totalCount) + 1
      );

      return this.getBatchPokemon(randomIds);
   }
}
