// src/Services/PokiAPI/Endpoints/index.ts
export { BaseEndpoint } from "./Common";
export { PokemonEndpoints } from "./Pokemon";
export { AbilityEndpoints } from "./Ability";
export { BerryEndpoints } from "./Berry";
export { ContestEndpoints } from "./Contest";
export { EncounterEndpoints } from "./Encounter";
export { EvolutionEndpoints } from "./Evolution";
export { GameEndpoints } from "./Game";
export { ItemEndpoints } from "./Item";
export { LocationEndpoints } from "./Location";
export { MoveEndpoints } from "./Move";
export { StatEndpoints } from "./Stat";
export { TypeEndpoints } from "./Type";
export { MachineEndpoints } from "./Machine";
/**
 * Main API endpoints instance
 * Provides access to all endpoint categories
 */
export class PokiAPIEndpoints {
   // Core Pokemon resources
   public readonly pokemon = new PokemonEndpoint();
   public readonly abilities = new AbilityEndpoint();
   public readonly types = new TypeEndpoint();
   public readonly stats = new StatEndpoint();

   // Items and berries
   public readonly berries = new BerryEndpoint();
   public readonly items = new ItemEndpoint();
   public readonly machines = new MachineEndpoint();

   // Moves and combat
   public readonly moves = new MoveEndpoint();
   public readonly contests = new ContestEndpoint();

   // World and locations
   public readonly locations = new LocationEndpoint();
   public readonly encounters = new EncounterEndpoint();

   // Game mechanics
   public readonly evolution = new EvolutionEndpoint();
   public readonly games = new GameEndpoint();

   /**
    * Health check for the API
    */
   async healthCheck(): Promise<boolean> {
      try {
         await this.pokemon.getPokemonList({ limit: 1, offset: 0 });
         return true;
      } catch {
         return false;
      }
   }

   /**
    * Get comprehensive API status and resource counts
    */
   async getAPIInfo() {
      try {
         const [
            pokemonList,
            abilitiesList,
            typesList,
            movesList,
            itemsList,
            locationsList,
            generationsList,
         ] = await Promise.allSettled([
            this.pokemon.getPokemonList({ limit: 1, offset: 0 }),
            this.abilities.getAbilitiesList({ limit: 1, offset: 0 }),
            this.types.getTypesList({ limit: 1, offset: 0 }),
            this.moves.getMovesList({ limit: 1, offset: 0 }),
            this.items.getItemsList({ limit: 1, offset: 0 }),
            this.locations.getLocationsList({ limit: 1, offset: 0 }),
            this.games.getGenerationsList({ limit: 1, offset: 0 }),
         ]);

         const getCount = (result: PromiseSettledResult<any>) =>
            result.status === "fulfilled" ? result.value.count : 0;

         return {
            status: "healthy",
            resources: {
               pokemon: getCount(pokemonList),
               abilities: getCount(abilitiesList),
               types: getCount(typesList),
               moves: getCount(movesList),
               items: getCount(itemsList),
               locations: getCount(locationsList),
               generations: getCount(generationsList),
            },
            timestamp: new Date().toISOString(),
         };
      } catch (error) {
         return {
            status: "error",
            error: error instanceof Error ? error.message : "Unknown error",
            timestamp: new Date().toISOString(),
         };
      }
   }

   /**
    * Get quick reference data for common resources
    */
   async getQuickReference() {
      try {
         const [types, generations, stats] = await Promise.all([
            this.types.getTypesList({ limit: 100, offset: 0 }),
            this.games.getGenerationsList({ limit: 20, offset: 0 }),
            this.stats.getStatsList({ limit: 10, offset: 0 }),
         ]);

         return {
            types: types.results,
            generations: generations.results,
            stats: stats.results,
         };
      } catch (error) {
         throw this.handleError(error);
      }
   }

   /**
    * Global search across multiple resource types
    */
   async globalSearch(query: string, limit: number = 5) {
      const [pokemon, moves, abilities, items, locations] =
         await Promise.allSettled([
            this.pokemon.searchPokemon({ query, limit }),
            this.moves.searchMoves(query, limit),
            this.abilities.searchAbilities(query, limit),
            this.items.searchItems(query, limit),
            this.locations.searchLocations(query, limit),
         ]);

      const getResults = (result: PromiseSettledResult<any>) =>
         result.status === "fulfilled" ? result.value.results : [];

      return {
         pokemon: getResults(pokemon),
         moves: getResults(moves),
         abilities: getResults(abilities),
         items: getResults(items),
         locations: getResults(locations),
      };
   }

   /**
    * Batch fetch multiple resources by type
    */
   async batchFetch(
      requests: Array<{ type: keyof PokiAPIEndpoints; id: number | string }>
   ) {
      const promises = requests.map(async (req) => {
         try {
            const endpoint = this[req.type] as any;
            if (endpoint && typeof endpoint.get === "function") {
               return await endpoint.get(req.id);
            }
            return null;
         } catch (error) {
            return {
               error: this.handleError(error),
               type: req.type,
               id: req.id,
            };
         }
      });

      return Promise.allSettled(promises);
   }

   private handleError(error: any) {
      return {
         code: error.response?.status?.toString() || "NETWORK_ERROR",
         message: error.message || "An unexpected error occurred",
         details: error.response?.data?.message,
         retryable: error.response?.status >= 500 || !error.response,
      };
   }
}

/**
 * Default export - singleton instance of the main API endpoints
 */
export const pokiAPI = new PokiAPIEndpoints();
