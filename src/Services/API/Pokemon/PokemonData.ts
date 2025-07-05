import { PokemonCore } from "./PokemonCore";
import type { Pokemon, NamedAPIResource } from "pokenode-ts";

export class PokemonData extends PokemonCore {
   async getPokemonList(offset: number = 0, limit: number = 20) {
      this.validatePaginationParams(offset, limit);

      return this.executeWithErrorHandling(
         async () => await this.api.pokemon.listPokemons(offset, limit),
         "Failed to fetch Pokemon list"
      );
   }

   async getPokemonSpeciesList(offset: number = 0, limit: number = 20) {
      this.validatePaginationParams(offset, limit);

      return this.executeWithErrorHandling(
         async () => await this.api.pokemon.listPokemonSpecies(offset, limit),
         "Failed to fetch Pokemon species list"
      );
   }

   async searchPokemonByPartialName(
      query: string,
      limit: number = 20
   ): Promise<NamedAPIResource[]> {
      if (!query || typeof query !== "string" || query.trim().length < 2) {
         throw new Error("Search query must be at least 2 characters long");
      }

      if (limit < 1 || limit > 100) {
         throw new Error("Limit must be between 1 and 100");
      }

      const allPokemon = await this.getPokemonList(0, 1500);

      return allPokemon.results
         .filter((pokemon) =>
            pokemon.name.toLowerCase().includes(query.toLowerCase().trim())
         )
         .slice(0, limit);
   }

   async getPokemonByStatRange(
      statName: string,
      minValue: number,
      maxValue: number = 255,
      sampleSize: number = 50
   ): Promise<Pokemon[]> {
      const validStats = [
         "hp",
         "attack",
         "defense",
         "special-attack",
         "special-defense",
         "speed",
      ];

      if (!validStats.includes(statName.toLowerCase())) {
         throw new Error(
            `Invalid stat name. Valid stats: ${validStats.join(", ")}`
         );
      }

      if (minValue < 0 || maxValue < minValue || maxValue > 255) {
         throw new Error(
            "Invalid stat range. Values must be 0-255 and minValue <= maxValue"
         );
      }

      if (sampleSize < 1 || sampleSize > 200) {
         throw new Error("Sample size must be between 1 and 200");
      }

      const pokemonList = await this.getPokemonList(0, sampleSize);

      const pokemonWithStats = await this.batchOperation(
         pokemonList.results,
         async (pokemonRef) => {
            try {
               const pokemon = await this.getPokemon(pokemonRef.name);
               const stat = pokemon.stats.find(
                  (s) => s.stat.name === statName.toLowerCase()
               );

               return stat &&
                  stat.base_stat >= minValue &&
                  stat.base_stat <= maxValue
                  ? pokemon
                  : null;
            } catch (error) {
               console.warn(
                  `Failed to get stats for ${pokemonRef.name}:`,
                  error
               );
               return null;
            }
         },
         3
      );

      return pokemonWithStats.filter(
         (pokemon): pokemon is Pokemon => pokemon !== null
      );
   }
}
