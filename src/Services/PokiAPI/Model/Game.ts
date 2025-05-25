import { NamedAPIResource, Description, Name } from "./Common";

/**
 * A generation is a grouping of the Pokémon games that separates them based on
 * the Pokémon they include. In each generation, a new set of Pokémon, moves,
 * abilities, and types that did not exist in the previous generation are released.
 *
 * @endpoint https://pokeapi.co/api/v2/generation/{id or name}/
 */
export interface Generation {
   /** The identifier for this generation resource */
   id: number;

   /** The name for this generation resource */
   name: string;

   /** A list of abilities that were introduced in this generation */
   abilities: NamedAPIResource[];

   /** The name of this generation listed in different languages */
   names: Name[];

   /** The main region this generation was introduced in */
   main_region: NamedAPIResource;

   /** A list of moves that were introduced in this generation */
   moves: NamedAPIResource[];

   /** A list of Pokémon species that were introduced in this generation */
   pokemon_species: NamedAPIResource[];

   /** A list of types that were introduced in this generation */
   types: NamedAPIResource[];

   /** A list of version groups that are part of this generation */
   version_groups: NamedAPIResource[];
}

/**
 * A Pokédex is a handheld electronic encyclopedia device
 *
 * @endpoint https://pokeapi.co/api/v2/pokedex/{id or name}/
 */
export interface Pokedex {
   /** The identifier for this Pokédex resource */
   id: number;

   /** The name for this Pokédex resource */
   name: string;

   /** Whether this Pokédex is the main series Pokédex */
   is_main_series: boolean;

   /** The descriptions of this Pokédex listed in different languages */
   descriptions: Description[];

   /** The name of this Pokédex listed in different languages */
   names: Name[];

   /** A list of Pokémon catalogued in this Pokédex and their indexes */
   pokemon_entries: PokemonEntry[];

   /** The region this Pokédex catalogues Pokémon for */
   region: NamedAPIResource | null;

   /** A list of version groups this Pokédex is relevant to */
   version_groups: NamedAPIResource[];
}

/**
 * Pokemon entry in a Pokédex
 */
export interface PokemonEntry {
   /** The index of this Pokémon species entry within the Pokédex */
   entry_number: number;

   /** The Pokémon species being encountered */
   pokemon_species: NamedAPIResource;
}

/**
 * Versions of the games
 *
 * @endpoint https://pokeapi.co/api/v2/version/{id or name}/
 */
export interface Version {
   /** The identifier for this version resource */
   id: number;

   /** The name for this version resource */
   name: string;

   /** The name of this version listed in different languages */
   names: Name[];

   /** The version group this version belongs to */
   version_group: NamedAPIResource;
}

/**
 * Version groups categorize highly similar versions of the games
 *
 * @endpoint https://pokeapi.co/api/v2/version-group/{id or name}/
 */
export interface VersionGroup {
   /** The identifier for this version group resource */
   id: number;

   /** The name for this version group resource */
   name: string;

   /** Order for sorting */
   order: number;

   /** The generation this version group belongs to */
   generation: NamedAPIResource;

   /** A list of methods in which Pokémon can learn moves in this version group */
   move_learn_methods: NamedAPIResource[];

   /** A list of Pokédexes introduced in this version group */
   pokedexes: NamedAPIResource[];

   /** A list of regions that can be visited in this version group */
   regions: NamedAPIResource[];

   /** The versions this version group owns */
   versions: NamedAPIResource[];
}
