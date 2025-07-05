// src/Services/API/Pokemon/PokemonRandom.ts
import { PokemonCore } from "./PokemonCore";
import type { Pokemon } from "pokenode-ts";

export class PokemonRandom extends PokemonCore {
   async getRandomPokemon(): Promise<Pokemon> {
      // Using Gen 1-8 Pokemon (1-898) to avoid newer forms that might not exist
      const randomId = Math.floor(Math.random() * 898) + 1;
      return this.getPokemon(randomId);
   }

   async getMultipleRandomPokemon(count: number = 6): Promise<Pokemon[]> {
      if (count < 1 || count > 20) {
         throw new Error("Count must be between 1 and 20");
      }

      const randomIds = new Set<number>();
      while (randomIds.size < count) {
         randomIds.add(Math.floor(Math.random() * 898) + 1);
      }

      return this.batchGetPokemon(Array.from(randomIds));
   }
}
