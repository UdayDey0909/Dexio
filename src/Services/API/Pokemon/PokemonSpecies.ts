import { PokemonCore } from "./PokemonCore";

export class PokemonSpecies extends PokemonCore {
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
