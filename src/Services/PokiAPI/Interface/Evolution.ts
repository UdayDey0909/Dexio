import { NamedAPIResource, Name } from "./Common";

/**
 * Endpoint: https://pokeapi.co/api/v2/evolution-chain/{id}/
 *
 * Evolution chains are essentially family trees. They start with the lowest
 * stage within a family and detail evolution conditions for each as well as
 * Pokémon they can evolve into up through the hierarchy.
 */
export interface EvolutionChain {
   /** The identifier for this evolution chain resource */
   id: number;

   /** The item that a Pokémon would be holding when mating that would trigger the egg hatching a baby Pokémon */
   baby_trigger_item: NamedAPIResource | null;

   /** The base chain link object */
   chain: ChainLink;
}

/**
 * Link in an evolution chain
 */
export interface ChainLink {
   /** Whether this link is for a baby Pokémon (can only evolve, cannot be evolved into) */
   is_baby: boolean;

   /** The Pokémon species at this point in the evolution chain */
   species: NamedAPIResource;

   /** All details regarding the specific details of the referenced Pokémon species evolution */
   evolution_details: EvolutionDetail[];

   /** A list of chain objects containing Pokémon that evolve from this Pokémon */
   evolves_to: ChainLink[];
}

/**
 * Details of an evolution step
 */
export interface EvolutionDetail {
   /** The item required to trigger evolution (null if not needed) */
   item: NamedAPIResource | null;

   /** The type of event that triggers evolution */
   trigger: NamedAPIResource;

   /** The gender the evolving Pokémon must be (null if gender-independent) */
   gender: number | null;

   /** The item the evolving Pokémon must be holding (null if not needed) */
   held_item: NamedAPIResource | null;

   /** The move that must be known by the evolving Pokémon (null if not needed) */
   known_move: NamedAPIResource | null;

   /** The type of the move that must be known by the evolving Pokémon (null if not needed) */
   known_move_type: NamedAPIResource | null;

   /** The location the evolution must be triggered at (null if not location-dependent) */
   location: NamedAPIResource | null;

   /** The minimum level the evolving Pokémon must be at (null if not level-dependent) */
   min_level: number | null;

   /** The minimum happiness the evolving Pokémon must have (null if not happiness-dependent) */
   min_happiness: number | null;

   /** The minimum beauty the evolving Pokémon must have (null if not beauty-dependent) */
   min_beauty: number | null;

   /** The minimum affection the evolving Pokémon must have (null if not affection-dependent) */
   min_affection: number | null;

   /** Whether it must be raining in the overworld to evolve */
   needs_overworld_rain: boolean;

   /** The Pokémon species that must be in the party (null if not needed) */
   party_species: NamedAPIResource | null;

   /** The type of Pokémon that must be in the party (null if not needed) */
   party_type: NamedAPIResource | null;

   /** The required relation between physical and special attack (-1: Special > Physical, 0: Same, 1: Physical > Special) */
   relative_physical_stats: number | null;

   /** The required time of day for evolution (day, night, or empty string if not time-dependent) */
   time_of_day: string;

   /** The Pokémon species for trading (null if not a trade evolution) */
   trade_species: NamedAPIResource | null;

   /** Whether the 3DS needs to be turned upside-down for evolution */
   turn_upside_down: boolean;
}

/**
 * Endpoint: https://pokeapi.co/api/v2/evolution-trigger/{id or name}/
 *
 * Evolution triggers are the events and conditions that cause a Pokémon to evolve
 */
export interface EvolutionTrigger {
   /** The identifier for this evolution trigger resource */
   id: number;

   /** The name for this evolution trigger resource */
   name: string;

   /** The name of this evolution trigger listed in different languages */
   names: Name[];

   /** A list of Pokémon species that result from this evolution trigger */
   pokemon_species: NamedAPIResource[];
}
