import { BaseEndpoint, DEFAULT_SEARCH_LIMIT } from "./Shared/Base";
import { PokemonFilters, SearchOptions } from "../Client/Types";
import {
   Pokemon,
   PokemonSpecies,
   NamedAPIResourceList,
   NamedAPIResource,
} from "pokenode-ts";

/**
 * Handles Pokémon API interactions including search, species, encounters, and forms.
 */
export class PokemonEndpoint extends BaseEndpoint {
   /**
    * Get paginated list of Pokémon
    */
   async getList(filters: PokemonFilters = {}) {
      const { offset, limit } = this.normalizePagination(filters);
      return this.handleRequest<NamedAPIResourceList>(() =>
         this.client.listPokemons(offset, limit)
      );
   }

   /**
    * Get Pokémon by ID or name
    */
   async getById(id: number | string) {
      return this.handleRequest<Pokemon>(() =>
         this.client.getPokemonById(Number(id))
      );
   }

   /**
    * Get Pokémon species by ID or name
    */
   async getSpeciesById(id: number | string) {
      return this.handleRequest<PokemonSpecies>(() =>
         this.client.getPokemonSpeciesById(Number(id))
      );
   }

   /**
    * Search Pokémon by name with improved type safety
    */
   async search(options: SearchOptions) {
      return this.handleRequest(async () => {
         const { query, limit = DEFAULT_SEARCH_LIMIT } = options;

         // Get all Pokemon for searching (consider caching this in production)
         const response = await this.axios.get<{ results: NamedAPIResource[] }>(
            `/pokemon?limit=1000`
         );
         const allPokemon: NamedAPIResource[] = response.data.results;

         const searchTerm = query.toLowerCase();
         const filtered = allPokemon
            .filter((pokemon) =>
               pokemon.name.toLowerCase().includes(searchTerm)
            )
            .slice(0, limit);

         return {
            results: filtered,
            count: filtered.length,
            query: searchTerm,
         };
      });
   }

   /**
    * Get Pokémon encounters by ID
    */
   async getEncounters(id: number | string) {
      return this.handleRequest(() => this.client.getPokemonEncounterById(id));
   }

   /**
    * Get evolution chain by ID
    */
   async getEvolutionChain(id: number | string) {
      return this.handleRequest(() => this.client.getEvolutionChainById(id));
   }

   /**
    * Get Pokémon forms by ID
    */
   async getForms(id: number | string) {
      return this.handleRequest(async () => {
         const pokemon = await this.client.getPokemonById(Number(id));
         return pokemon.forms;
      });
   }

   /**
    * Get multiple Pokémon by IDs (batch operation)
    */
   async getMultiple(ids: (number | string)[]): Promise<Pokemon[]> {
      const promises = ids.map((id) => this.getById(id));
      return Promise.all(promises);
   }

   /**
    * Get random Pokémon
    */
   async getRandom(count = 1): Promise<Pokemon[]> {
      const maxPokemonId = 1010; // Current max as of Gen 9
      const randomIds = Array.from(
         { length: count },
         () => Math.floor(Math.random() * maxPokemonId) + 1
      );
      return this.getMultiple(randomIds);
   }
}
