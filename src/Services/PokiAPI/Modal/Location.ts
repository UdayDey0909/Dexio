import { NamedAPIResource, Name, VersionGameIndex } from "./Common";

/**
 * Locations that can be visited within the games.
 * Locations make up sizable portions of regions, like cities or routes.
 *
 * @endpoint https://pokeapi.co/api/v2/location/{id or name}/
 */
export interface Location {
   /** The identifier for this location resource */
   id: number;

   /** The name for this location resource */
   name: string;

   /** The region this location can be found in */
   region: NamedAPIResource | null;

   /** The name of this location listed in different languages */
   names: Name[];

   /** A list of game indices relevant to this location by generation */
   game_indices: VersionGameIndex[];

   /** Areas that can be found within this location */
   areas: NamedAPIResource[];
}

/**
 * Location areas are sections of areas, such as floors in a building or cave.
 * Each area has its own set of possible Pokémon encounters.
 *
 * @endpoint https://pokeapi.co/api/v2/location-area/{id or name}/
 */
export interface LocationArea {
   /** The identifier for this location area resource */
   id: number;

   /** The name for this location area resource */
   name: string;

   /** The internal game ID of the location area */
   game_index: number;

   /** A list of methods in which Pokémon may be encountered in this area and their chance of appearance */
   encounter_method_rates: EncounterMethodRate[];

   /** The region this location area can be found in */
   location: NamedAPIResource;

   /** The name of this location area listed in different languages */
   names: Name[];

   /** A list of Pokémon that can be encountered in this area along with version specific details about the encounter */
   pokemon_encounters: PokemonEncounter[];
}

/**
 * Encounter method rates for a location area
 */
export interface EncounterMethodRate {
   /** The method in which Pokémon may be encountered in an area */
   encounter_method: NamedAPIResource;

   /** The chance of the encounter to occur on a version of the game */
   version_details: EncounterVersionDetails[];
}

/**
 * Details for an encounter method by version
 */
export interface EncounterVersionDetails {
   /** The chance of an encounter to occur */
   rate: number;

   /** The version of the game */
   version: NamedAPIResource;
}

/**
 * Pokemon encounters in a specific location area
 */
export interface PokemonEncounter {
   /** The Pokémon being encountered */
   pokemon: NamedAPIResource;

   /** A list of versions and encounters with Pokémon that might happen in the referenced location area */
   version_details: VersionEncounterDetail[];
}

/**
 * Details about a Pokémon encounter in a given version
 */
export interface VersionEncounterDetail {
   /** The game version this encounter happens in */
   version: NamedAPIResource;

   /** The total percentage of all encounter possibilities for the referenced Pokémon in this area */
   max_chance: number;

   /** A list of encounters and their specifics */
   encounter_details: Encounter[];
}

/**
 * Details for a single encounter possibility
 */
export interface Encounter {
   /** The lowest level the Pokémon could be encountered at */
   min_level: number;

   /** The highest level the Pokémon could be encountered at */
   max_level: number;

   /** A list of condition values that must be in effect for this encounter to occur */
   condition_values: NamedAPIResource[];

   /** Percent chance that this encounter will occur */
   chance: number;

   /** The method by which this Pokémon is encountered */
   method: NamedAPIResource;
}

/**
 * A region is an organized area of the Pokémon world
 *
 * @endpoint https://pokeapi.co/api/v2/region/{id or name}/
 */
export interface Region {
   /** The identifier for this region resource */
   id: number;

   /** The name for this region resource */
   name: string;

   /** A list of locations that can be found in this region */
   locations: NamedAPIResource[];

   /** The name of this region listed in different languages */
   names: Name[];

   /** The generation this region was introduced in */
   main_generation: NamedAPIResource;

   /** A list of Pokédexes that catalog Pokémon in this region */
   pokedexes: NamedAPIResource[];

   /** A list of version groups where this region can be visited */
   version_groups: NamedAPIResource[];
}
