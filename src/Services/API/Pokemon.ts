import { BaseService } from "../Client";
import type { Pokemon, PokemonSpecies } from "pokenode-ts";

export class PokemonService extends BaseService {
   async getPokemon(identifier: string | number): Promise<Pokemon> {
      try {
         return typeof identifier === "string"
            ? await this.api.pokemon.getPokemonByName(identifier.toLowerCase())
            : await this.api.pokemon.getPokemonById(identifier);
      } catch (error) {
         throw new Error(`Failed to fetch Pokemon: ${error}`);
      }
   }

   async getPokemonList(offset: number = 0, limit: number = 20) {
      return await this.api.pokemon.listPokemons(offset, limit);
   }

   async getPokemonSpecies(
      identifier: string | number
   ): Promise<PokemonSpecies> {
      try {
         return typeof identifier === "string"
            ? await this.api.pokemon.getPokemonSpeciesByName(
                 identifier.toLowerCase()
              )
            : await this.api.pokemon.getPokemonSpeciesById(identifier);
      } catch (error) {
         throw new Error(`Failed to fetch Pokemon species: ${error}`);
      }
   }

   async getPokemonSpeciesList(offset: number = 0, limit: number = 20) {
      return await this.api.pokemon.listPokemonSpecies(offset, limit);
   }

   async getRandomPokemon(): Promise<Pokemon> {
      const randomId = Math.floor(Math.random() * 1010) + 1;
      return this.getPokemon(randomId);
   }

   async getPokemonStats(pokemonName: string) {
      const pokemon = await this.getPokemon(pokemonName);
      return {
         baseStats: pokemon.stats,
         totalStats: pokemon.stats.reduce(
            (sum, stat) => sum + stat.base_stat,
            0
         ),
         abilities: pokemon.abilities,
         types: pokemon.types,
      };
   }

   async getPokemonMoves(pokemonName: string, versionGroup?: string) {
      const pokemon = await this.getPokemon(pokemonName);
      let moves = pokemon.moves;

      if (versionGroup) {
         moves = moves.filter((move) =>
            move.version_group_details.some(
               (detail) => detail.version_group.name === versionGroup
            )
         );
      }

      return moves;
   }

   async getPokemonEncounters(pokemonName: string) {
      const pokemon = await this.getPokemon(pokemonName);
      const encountersUrl = `https://pokeapi.co/api/v2/pokemon/${pokemon.id}/encounters`;
      return await this.api.utility.getResourceByUrl(encountersUrl);
   }

   async searchPokemonByPartialName(query: string, limit: number = 20) {
      const allPokemon = await this.getPokemonList(0, 2000);
      return allPokemon.results
         .filter((pokemon) => pokemon.name.includes(query.toLowerCase()))
         .slice(0, limit);
   }

   async getPokemonByStatRange(
      statName: string,
      minValue: number,
      maxValue: number = 255
   ) {
      const pokemonList = await this.getPokemonList(0, 200);
      const pokemonPromises = pokemonList.results.map(async (pokemonRef) => {
         const pokemon = await this.getPokemon(pokemonRef.name);
         const stat = pokemon.stats.find((s) => s.stat.name === statName);
         return stat && stat.base_stat >= minValue && stat.base_stat <= maxValue
            ? pokemon
            : null;
      });
      const results = await Promise.all(pokemonPromises);
      return results.filter((pokemon) => pokemon !== null);
   }

   async batchGetPokemon(identifiers: (string | number)[]): Promise<Pokemon[]> {
      const promises = identifiers.map((id) => this.getPokemon(id));
      return await Promise.all(promises);
   }
}
