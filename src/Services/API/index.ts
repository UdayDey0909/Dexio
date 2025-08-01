// src/Services/API/index.ts
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

// Export individual services for direct imports
export {
   PokemonService,
   AbilityService,
   TypeService,
   MoveService,
   EvolutionService,
   ItemService,
   BerryService,
   LocationService,
   ContestService,
   EncounterService,
   GameService,
   MachineService,
   UtilityService,
};

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
      this.pokemon.cleanup();
      this.abilities.cleanup();
      this.types.cleanup();
      this.moves.cleanup();
      this.evolution.cleanup();
      this.items.cleanup();
      this.berries.cleanup();
      this.locations.cleanup();
      this.contests.cleanup();
      this.encounters.cleanup();
      this.games.cleanup();
      this.machines.cleanup();
      this.utility.cleanup();
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
         serviceHealth: {
            pokemon: this.pokemon.getHealthStatus(),
            abilities: this.abilities.getHealthStatus(),
            types: this.types.getHealthStatus(),
            moves: this.moves.getHealthStatus(),
            evolution: this.evolution.getHealthStatus(),
            items: this.items.getHealthStatus(),
            berries: this.berries.getHealthStatus(),
            locations: this.locations.getHealthStatus(),
            contests: this.contests.getHealthStatus(),
            encounters: this.encounters.getHealthStatus(),
            games: this.games.getHealthStatus(),
            machines: this.machines.getHealthStatus(),
            utility: this.utility.getHealthStatus(),
         },
      };
   }
}

// Export main service instance
export const pokeApiService = new PokeAPIService();
export default pokeApiService;
