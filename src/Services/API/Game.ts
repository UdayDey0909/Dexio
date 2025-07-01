import { BaseService } from "../Client";
import type { Generation, Pokedex, Version, VersionGroup } from "pokenode-ts";
import type {
   GenerationDetails,
   PokedexDetails,
   VersionDetails,
   VersionGroupDetails,
} from "../Hooks/Game/Shared/Types";

export class GameService extends BaseService {
   // Generation methods
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

   async getGenerationDetails(name: string): Promise<GenerationDetails> {
      this.validateIdentifier(name, "Generation name");

      const generation = await this.getGeneration(name);

      return {
         ...generation,
         pokemonCount: generation.pokemon_species.length,
         mainRegion: generation.main_region?.name || null,
         gameVersions: generation.version_groups.map((vg) => vg.name),
      };
   }

   // Pokedex methods
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

   async getPokedexDetails(name: string): Promise<PokedexDetails> {
      this.validateIdentifier(name, "Pokedex name");

      const pokedex = await this.getPokedex(name);

      return {
         ...pokedex,
         entryCount: pokedex.pokemon_entries.length,
         regionName: pokedex.region?.name || null,
         pokemonNames: pokedex.pokemon_entries.map(
            (entry) => entry.pokemon_species.name
         ),
      };
   }

   // Version methods
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

   async getVersionDetails(name: string): Promise<VersionDetails> {
      this.validateIdentifier(name, "Version name");

      const version = await this.getVersion(name);

      return {
         ...version,
         generationName: version.version_group?.name || null,
         versionGroupName: version.version_group?.name || null,
      };
   }

   // Version Group methods
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

   async getVersionGroupDetails(name: string): Promise<VersionGroupDetails> {
      this.validateIdentifier(name, "Version Group name");

      const versionGroup = await this.getVersionGroup(name);

      return {
         ...versionGroup,
         generationName: versionGroup.generation?.name || null,
         versionNames: versionGroup.versions.map((v) => v.name),
         regionNames: versionGroup.regions.map((r) => r.name),
      };
   }

   // Helper methods
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
