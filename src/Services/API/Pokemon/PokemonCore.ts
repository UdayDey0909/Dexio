import { BaseService } from "../../Client";
import type { Pokemon, PokemonSpecies } from "pokenode-ts";

export class PokemonCore extends BaseService {
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

   async batchGetPokemon(identifiers: (string | number)[]): Promise<Pokemon[]> {
      if (!Array.isArray(identifiers) || identifiers.length === 0) {
         throw new Error("Identifiers array cannot be empty");
      }

      if (identifiers.length > 50) {
         throw new Error("Batch size cannot exceed 50 Pokemon");
      }

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
}
