import { PokemonService } from "./Pokemon";
import { AbilityService } from "./Ability";
import { TypeService } from "./Type";
import { MoveService } from "./Move";
import { EvolutionService } from "./Evolution";
import { ItemService } from "./Item";
import { BerryService } from "./Berry";
import { LocationService } from "./Location";
import { ContestService } from "./Contest";
import { EncounterService } from "./Encounter";
import { GameService } from "./Game";
import { MachineService } from "./Machine";
import { UtilityService } from "./Utility";

// Create singleton instances
export const pokemonService = new PokemonService();
export const abilityService = new AbilityService();
export const typeService = new TypeService();
export const moveService = new MoveService();
export const evolutionService = new EvolutionService();
export const itemService = new ItemService();
export const berryService = new BerryService();
export const locationService = new LocationService();
export const contestService = new ContestService();
export const encounterService = new EncounterService();
export const gameService = new GameService();
export const machineService = new MachineService();
export const utilityService = new UtilityService();

// Main service class that combines all services
export class PokeAPIService {
   public pokemon = pokemonService;
   public abilities = abilityService;
   public types = typeService;
   public moves = moveService;
   public evolution = evolutionService;
   public items = itemService;
   public berries = berryService;
   public locations = locationService;
   public contests = contestService;
   public encounters = encounterService;
   public games = gameService;
   public machines = machineService;
   public utility = utilityService;

   clearAllCaches() {
      this.pokemon.clearCache();
      this.abilities.clearCache();
      this.types.clearCache();
      this.moves.clearCache();
      this.evolution.clearCache();
      this.items.clearCache();
      this.berries.clearCache();
      this.locations.clearCache();
      this.contests.clearCache();
      this.encounters.clearCache();
      this.games.clearCache();
      this.machines.clearCache();
      this.utility.clearCache();
   }

   // Convenience method to get all services
   getAllServices() {
      return {
         pokemon: this.pokemon,
         abilities: this.abilities,
         types: this.types,
         moves: this.moves,
         evolution: this.evolution,
         items: this.items,
         berries: this.berries,
         locations: this.locations,
         contests: this.contests,
         encounters: this.encounters,
         games: this.games,
         machines: this.machines,
         utility: this.utility,
      };
   }

   // Get service statistics
   getServiceStats() {
      return {
         totalServices: Object.keys(this.getAllServices()).length,
         cacheInfo: this.utility.getCacheInfo(),
      };
   }
}

// Export main service instance
export const pokeApiService = new PokeAPIService();
export default pokeApiService;
