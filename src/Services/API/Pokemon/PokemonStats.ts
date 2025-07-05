// src/Services/API/Pokemon/PokemonStats.ts
import { PokemonCore } from "./PokemonCore";

export class PokemonStats extends PokemonCore {
   async getPokemonStats(pokemonName: string) {
      if (!pokemonName || typeof pokemonName !== "string") {
         throw new Error("Pokemon name is required");
      }

      const pokemon = await this.getPokemon(pokemonName);

      return {
         baseStats: pokemon.stats.map((stat) => ({
            name: stat.stat.name,
            baseStat: stat.base_stat,
            effort: stat.effort,
         })),
         totalStats: pokemon.stats.reduce(
            (sum, stat) => sum + stat.base_stat,
            0
         ),
         abilities: pokemon.abilities.map((ability) => ({
            name: ability.ability.name,
            isHidden: ability.is_hidden,
            slot: ability.slot,
         })),
         types: pokemon.types.map((type) => ({
            name: type.type.name,
            slot: type.slot,
         })),
         height: pokemon.height,
         weight: pokemon.weight,
         baseExperience: pokemon.base_experience,
      };
   }

   async getPokemonMoves(pokemonName: string, versionGroup?: string) {
      if (!pokemonName || typeof pokemonName !== "string") {
         throw new Error("Pokemon name is required");
      }

      const pokemon = await this.getPokemon(pokemonName);
      let moves = pokemon.moves;

      if (versionGroup) {
         moves = moves.filter((move) =>
            move.version_group_details.some(
               (detail) =>
                  detail.version_group.name === versionGroup.toLowerCase()
            )
         );
      }

      return moves.map((move) => ({
         name: move.move.name,
         learnMethod: move.version_group_details.map((detail) => ({
            versionGroup: detail.version_group.name,
            learnMethod: detail.move_learn_method.name,
            levelLearnedAt: detail.level_learned_at,
         })),
      }));
   }

   async getPokemonEncounters(pokemonName: string) {
      if (!pokemonName || typeof pokemonName !== "string") {
         throw new Error("Pokemon name is required");
      }

      const pokemon = await this.getPokemon(pokemonName);

      return this.executeWithErrorHandling(async () => {
         const encountersUrl = `https://pokeapi.co/api/v2/pokemon/${pokemon.id}/encounters`;
         return await this.api.utility.getResourceByUrl(encountersUrl);
      }, `Failed to fetch encounters for ${pokemonName}`);
   }
}
