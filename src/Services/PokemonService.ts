// services/PokemonService.ts
import { MainClient } from "pokenode-ts";
import type {
   Pokemon,
   PokemonSpecies,
   EvolutionChain,
   Move,
   Item,
   Type,
} from "pokenode-ts";

class PokemonService {
   private api: MainClient;

   constructor() {
      // Initialize MainClient with caching for better performance
      this.api = new MainClient({
         cacheOptions: {
            ttl: 5 * 60 * 1000, // 5 minutes cache
         },
      });
   }

   // === POKEMON METHODS ===

   async getPokemon(identifier: string | number): Promise<Pokemon> {
      try {
         if (typeof identifier === "string") {
            return await this.api.pokemon.getPokemonByName(
               identifier.toLowerCase()
            );
         }
         return await this.api.pokemon.getPokemonById(identifier);
      } catch (error) {
         throw new Error(`Failed to fetch Pokemon: ${error}`);
      }
   }

   async getPokemonSpecies(
      identifier: string | number
   ): Promise<PokemonSpecies> {
      try {
         if (typeof identifier === "string") {
            return await this.api.pokemon.getPokemonSpeciesByName(
               identifier.toLowerCase()
            );
         }
         return await this.api.pokemon.getPokemonSpeciesById(identifier);
      } catch (error) {
         throw new Error(`Failed to fetch Pokemon species: ${error}`);
      }
   }

   async getPokemonList(offset: number = 0, limit: number = 20) {
      try {
         return await this.api.pokemon.listPokemons(offset, limit);
      } catch (error) {
         throw new Error(`Failed to fetch Pokemon list: ${error}`);
      }
   }

   // === TYPE METHODS ===

   async getType(identifier: string | number): Promise<Type> {
      try {
         if (typeof identifier === "string") {
            return await this.api.pokemon.getTypeByName(
               identifier.toLowerCase()
            );
         }
         return await this.api.pokemon.getTypeById(identifier);
      } catch (error) {
         throw new Error(`Failed to fetch type: ${error}`);
      }
   }

   async getTypeList() {
      try {
         return await this.api.pokemon.listTypes();
      } catch (error) {
         throw new Error(`Failed to fetch type list: ${error}`);
      }
   }

   // === EVOLUTION METHODS ===

   async getEvolutionChain(id: number): Promise<EvolutionChain> {
      try {
         return await this.api.evolution.getEvolutionChainById(id);
      } catch (error) {
         throw new Error(`Failed to fetch evolution chain: ${error}`);
      }
   }

   // === MOVE METHODS ===

   async getMove(identifier: string | number): Promise<Move> {
      try {
         if (typeof identifier === "string") {
            return await this.api.move.getMoveByName(identifier.toLowerCase());
         }
         return await this.api.move.getMoveById(identifier);
      } catch (error) {
         throw new Error(`Failed to fetch move: ${error}`);
      }
   }

   async getMoveList(offset: number = 0, limit: number = 20) {
      try {
         return await this.api.move.listMoves(offset, limit);
      } catch (error) {
         throw new Error(`Failed to fetch move list: ${error}`);
      }
   }

   // === ITEM METHODS ===

   async getItem(identifier: string | number): Promise<Item> {
      try {
         if (typeof identifier === "string") {
            return await this.api.item.getItemByName(identifier.toLowerCase());
         }
         return await this.api.item.getItemById(identifier);
      } catch (error) {
         throw new Error(`Failed to fetch item: ${error}`);
      }
   }

   async getItemList(offset: number = 0, limit: number = 20) {
      try {
         return await this.api.item.listItems(offset, limit);
      } catch (error) {
         throw new Error(`Failed to fetch item list: ${error}`);
      }
   }

   // === UTILITY METHODS ===

   async getResourceByUrl(url: string) {
      try {
         return await this.api.utility.getResourceByUrl(url);
      } catch (error) {
         throw new Error(`Failed to fetch resource: ${error}`);
      }
   }

   // Helper method to extract ID from URL
   extractIdFromUrl(url: string): number | null {
      const match = url.match(/\/(\d+)\/$/);
      return match ? parseInt(match[1], 10) : null;
   }
}

// Create and export a singleton instance
export const pokemonService = new PokemonService();
export default pokemonService;
