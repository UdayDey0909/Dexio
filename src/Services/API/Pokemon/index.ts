// src/Services/API/Pokemon/index.ts
import { PokemonCore } from "./PokemonCore";
import { PokemonData } from "./PokemonData";
import { PokemonStats } from "./PokemonStats";
import { PokemonRandom } from "./PokemonRandom";
import { PokemonSpecies } from "./PokemonSpecies";
import type { ServiceConfig } from "../../Client/Types";

export class PokemonService {
   public readonly core: PokemonCore;
   public readonly data: PokemonData;
   public readonly stats: PokemonStats;
   public readonly random: PokemonRandom;
   public readonly species: PokemonSpecies;

   constructor(config?: ServiceConfig) {
      this.core = new PokemonCore(config);
      this.data = new PokemonData(config);
      this.stats = new PokemonStats(config);
      this.random = new PokemonRandom(config);
      this.species = new PokemonSpecies(config);
   }

   // Convenience methods for the most common operations
   async getPokemon(identifier: string | number) {
      return this.core.getPokemon(identifier);
   }

   async getPokemonStats(pokemonName: string) {
      return this.stats.getPokemonStats(pokemonName);
   }

   async getRandomPokemon() {
      return this.random.getRandomPokemon();
   }

   async searchPokemon(query: string, limit?: number) {
      return this.data.searchPokemonByPartialName(query, limit);
   }

   // Health check that works across all modules
   getHealthStatus() {
      return this.core.getHealthStatus();
   }

   cleanup() {
      this.core.cleanup();
      this.data.cleanup();
      this.stats.cleanup();
      this.random.cleanup();
      this.species.cleanup();
   }
}

// Export everything for flexible usage
export {
   PokemonCore,
   PokemonData,
   PokemonStats,
   PokemonRandom,
   PokemonSpecies,
};
export type { ServiceConfig };
