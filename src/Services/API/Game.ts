import { BaseService } from "../Client";
import type { Generation, Pokedex, Version, VersionGroup } from "pokenode-ts";

export class GameService extends BaseService {
   async getGeneration(identifier: string | number): Promise<Generation> {
      try {
         return typeof identifier === "string"
            ? await this.api.game.getGenerationByName(identifier.toLowerCase())
            : await this.api.game.getGenerationById(identifier);
      } catch (error) {
         throw new Error(`Failed to fetch generation: ${error}`);
      }
   }

   async getGenerationList(offset: number = 0, limit: number = 20) {
      return await this.api.game.listGenerations(offset, limit);
   }

   async getPokedex(identifier: string | number): Promise<Pokedex> {
      try {
         return typeof identifier === "string"
            ? await this.api.game.getPokedexByName(identifier.toLowerCase())
            : await this.api.game.getPokedexById(identifier);
      } catch (error) {
         throw new Error(`Failed to fetch pokedex: ${error}`);
      }
   }

   async getPokedexList(offset: number = 0, limit: number = 20) {
      return await this.api.game.listPokedexes(offset, limit);
   }

   async getVersion(identifier: string | number): Promise<Version> {
      try {
         return typeof identifier === "string"
            ? await this.api.game.getVersionByName(identifier.toLowerCase())
            : await this.api.game.getVersionById(identifier);
      } catch (error) {
         throw new Error(`Failed to fetch version: ${error}`);
      }
   }

   async getVersionList(offset: number = 0, limit: number = 20) {
      return await this.api.game.listVersions(offset, limit);
   }

   async getVersionGroup(identifier: string | number): Promise<VersionGroup> {
      try {
         return typeof identifier === "string"
            ? await this.api.game.getVersionGroupByName(
                 identifier.toLowerCase()
              )
            : await this.api.game.getVersionGroupById(identifier);
      } catch (error) {
         throw new Error(`Failed to fetch version group: ${error}`);
      }
   }

   async getVersionGroupList(offset: number = 0, limit: number = 20) {
      return await this.api.game.listVersionGroups(offset, limit);
   }

   async getPokemonByGeneration(generationName: string) {
      const generation = await this.getGeneration(generationName);
      return generation.pokemon_species;
   }

   async getPokedexEntries(pokedexName: string) {
      const pokedex = await this.getPokedex(pokedexName);
      return pokedex.pokemon_entries;
   }
}
