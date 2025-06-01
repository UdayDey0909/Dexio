import { PokemonService } from "./Pokemon";
import { AbilityService } from "./Ability";
import { TypeService } from "./Type";
import { MoveService } from "./Move";
import { EvolutionService } from "./Evolution";
import { ItemService } from "./Item";
import { BerryService } from "./Berry";
import { LocationService } from "./Location";

// Create singleton instances
export const pokemonService = new PokemonService();
export const abilityService = new AbilityService();
export const typeService = new TypeService();
export const moveService = new MoveService();
export const evolutionService = new EvolutionService();
export const itemService = new ItemService();
export const berryService = new BerryService();
export const locationService = new LocationService();

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

   clearAllCaches() {
      this.pokemon.clearCache();
      this.abilities.clearCache();
      this.types.clearCache();
      this.moves.clearCache();
      this.evolution.clearCache();
      this.items.clearCache();
      this.berries.clearCache();
      this.locations.clearCache();
   }
}

// Export main service instance
export const pokeApiService = new PokeAPIService();
export default pokeApiService;
