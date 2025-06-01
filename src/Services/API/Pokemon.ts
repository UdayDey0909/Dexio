import { BaseService } from "../Client";
import type { Pokemon, PokemonSpecies, NamedAPIResource } from "pokenode-ts";

export class PokemonService extends BaseService {
   async getPokemon(identifier: string | number): Promise<Pokemon> {
      this.validateIdentifier(identifier, "Pokemon");

      return this.executeWithErrorHandling(async () => {
         return typeof identifier === "string"
            ? await this.api.pokemon.getPokemonByName(
                 identifier.toLowerCase().trim()
              )
            : await this.api.pokemon.getPokemonById(identifier);
      }, `Failed to fetch Pokemon: ${identifier}`);
   }

   async getPokemonList(offset: number = 0, limit: number = 20) {
      this.validatePaginationParams(offset, limit);

      return this.executeWithErrorHandling(
         async () => await this.api.pokemon.listPokemons(offset, limit),
         "Failed to fetch Pokemon list"
      );
   }

   async getPokemonSpecies(
      identifier: string | number
   ): Promise<PokemonSpecies> {
      this.validateIdentifier(identifier, "Pokemon Species");

      return this.executeWithErrorHandling(async () => {
         return typeof identifier === "string"
            ? await this.api.pokemon.getPokemonSpeciesByName(
                 identifier.toLowerCase().trim()
              )
            : await this.api.pokemon.getPokemonSpeciesById(identifier);
      }, `Failed to fetch Pokemon species: ${identifier}`);
   }

   async getPokemonSpeciesList(offset: number = 0, limit: number = 20) {
      this.validatePaginationParams(offset, limit);

      return this.executeWithErrorHandling(
         async () => await this.api.pokemon.listPokemonSpecies(offset, limit),
         "Failed to fetch Pokemon species list"
      );
   }

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

      // Get more Pokemon to search through
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
         3 // Lower concurrency for complex operations
      );

      return pokemonWithStats.filter(
         (pokemon): pokemon is Pokemon => pokemon !== null
      );
   }

   async batchGetPokemon(identifiers: (string | number)[]): Promise<Pokemon[]> {
      if (!Array.isArray(identifiers) || identifiers.length === 0) {
         throw new Error("Identifiers array cannot be empty");
      }

      if (identifiers.length > 50) {
         throw new Error("Batch size cannot exceed 50 Pokemon");
      }

      // Validate all identifiers first
      identifiers.forEach((id, index) => {
         try {
            this.validateIdentifier(id, `Pokemon at index ${index}`);
         } catch (error) {
            throw new Error(`Invalid identifier at index ${index}: ${error}`);
         }
      });

      return this.batchOperation(
         identifiers,
         async (id) => await this.getPokemon(id),
         5
      );
   }

   // New utility methods
   async getPokemonEvolutionLine(pokemonName: string) {
      const species = await this.getPokemonSpecies(pokemonName);
      const evolutionChainId = this.extractIdFromUrl(
         species.evolution_chain.url
      );

      if (!evolutionChainId) {
         throw new Error(`Could not find evolution chain for ${pokemonName}`);
      }

      return this.executeWithErrorHandling(
         async () =>
            await this.api.evolution.getEvolutionChainById(evolutionChainId),
         `Failed to fetch evolution chain for ${pokemonName}`
      );
   }

   async isPokemonLegendary(pokemonName: string): Promise<boolean> {
      const species = await this.getPokemonSpecies(pokemonName);
      return species.is_legendary || species.is_mythical;
   }

   async getPokemonGenerationInfo(pokemonName: string) {
      const species = await this.getPokemonSpecies(pokemonName);
      return {
         generation: species.generation.name,
         generationId: this.extractIdFromUrl(species.generation.url),
         isLegendary: species.is_legendary,
         isMythical: species.is_mythical,
         captureRate: species.capture_rate,
         baseHappiness: species.base_happiness,
         growthRate: species.growth_rate.name,
      };
   }
}
