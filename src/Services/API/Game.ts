import { BaseService } from "../Client";
import type { Generation, Pokedex, Version, VersionGroup } from "pokenode-ts";

export class GameService extends BaseService {
   async getGeneration(identifier: string | number): Promise<Generation> {
      this.validateIdentifier(identifier, "Generation");

      return this.executeWithErrorHandling(async () => {
         return typeof identifier === "string"
            ? await this.api.game.getGenerationByName(
                 identifier.toLowerCase().trim()
              )
            : await this.api.game.getGenerationById(identifier);
      }, `Failed to fetch generation: ${identifier}`);
   }

   async getGenerationList(offset: number = 0, limit: number = 20) {
      this.validatePaginationParams(offset, limit);

      return this.executeWithErrorHandling(
         async () => await this.api.game.listGenerations(offset, limit),
         "Failed to fetch generation list"
      );
   }

   async getPokedex(identifier: string | number): Promise<Pokedex> {
      this.validateIdentifier(identifier, "Pokedex");

      return this.executeWithErrorHandling(async () => {
         return typeof identifier === "string"
            ? await this.api.game.getPokedexByName(
                 identifier.toLowerCase().trim()
              )
            : await this.api.game.getPokedexById(identifier);
      }, `Failed to fetch pokedex: ${identifier}`);
   }

   async getPokedexList(offset: number = 0, limit: number = 20) {
      this.validatePaginationParams(offset, limit);

      return this.executeWithErrorHandling(
         async () => await this.api.game.listPokedexes(offset, limit),
         "Failed to fetch pokedex list"
      );
   }

   async getVersion(identifier: string | number): Promise<Version> {
      this.validateIdentifier(identifier, "Version");

      return this.executeWithErrorHandling(async () => {
         return typeof identifier === "string"
            ? await this.api.game.getVersionByName(
                 identifier.toLowerCase().trim()
              )
            : await this.api.game.getVersionById(identifier);
      }, `Failed to fetch version: ${identifier}`);
   }

   async getVersionList(offset: number = 0, limit: number = 20) {
      this.validatePaginationParams(offset, limit);

      return this.executeWithErrorHandling(
         async () => await this.api.game.listVersions(offset, limit),
         "Failed to fetch version list"
      );
   }

   async getVersionGroup(identifier: string | number): Promise<VersionGroup> {
      this.validateIdentifier(identifier, "Version Group");

      return this.executeWithErrorHandling(async () => {
         return typeof identifier === "string"
            ? await this.api.game.getVersionGroupByName(
                 identifier.toLowerCase().trim()
              )
            : await this.api.game.getVersionGroupById(identifier);
      }, `Failed to fetch version group: ${identifier}`);
   }

   async getVersionGroupList(offset: number = 0, limit: number = 20) {
      this.validatePaginationParams(offset, limit);

      return this.executeWithErrorHandling(
         async () => await this.api.game.listVersionGroups(offset, limit),
         "Failed to fetch version group list"
      );
   }

   async getPokemonByGeneration(generationName: string) {
      this.validateIdentifier(generationName, "Generation name");

      const generation = await this.getGeneration(generationName);
      return generation.pokemon_species;
   }

   async getPokedexEntries(pokedexName: string) {
      this.validateIdentifier(pokedexName, "Pokedex name");

      const pokedex = await this.getPokedex(pokedexName);
      return pokedex.pokemon_entries;
   }
}
