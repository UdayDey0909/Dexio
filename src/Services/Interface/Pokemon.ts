import { NamedAPIResource, VersionGameIndex } from "./Common";

/**
 * Pokémon are the creatures that inhabit the world of the Pokémon games.
 * They can be caught using Pokéballs and trained by battling with other Pokémon.
 * Each Pokémon belongs to a specific species but may take on a variant
 * which makes it differ from other Pokémon of the same species.
 *
 * @endpoint https://pokeapi.co/api/v2/pokemon/{id or name}/
 */
export interface Pokemon {
   /** The identifier for this Pokémon resource */
   id: number;

   /** The name for this Pokémon resource */
   name: string;

   /** The base experience gained for defeating this Pokémon */
   base_experience: number | null;

   /** The height of this Pokémon in decimeters */
   height: number;

   /** Set for exactly one Pokémon used as the default for each species */
   is_default: boolean;

   /** Order for sorting. Almost national order, except families are grouped together */
   order: number;

   /** The weight of this Pokémon in hectograms */
   weight: number;

   /** A list of abilities this Pokémon could potentially have */
   abilities: PokemonAbility[];

   /** A list of forms this Pokémon can take on */
   forms: NamedAPIResource[];

   /** A list of game indices relevant to Pokémon item by generation */
   game_indices: VersionGameIndex[];

   /** A list of items this Pokémon may be holding when encountered */
   held_items: PokemonHeldItem[];

   /** A link to a list of location areas, as well as encounter details pertaining to specific versions */
   location_area_encounters: string;

   /** A list of moves along with learn methods and level details pertaining to specific version groups */
   moves: PokemonMove[];

   /** A set of sprites used to depict this Pokémon in the game */
   sprites: PokemonSprites;

   /** The species this Pokémon belongs to */
   species: NamedAPIResource;

   /** A list of base stat values for this Pokémon */
   stats: PokemonStat[];

   /** A list of details showing types this Pokémon has */
   types: PokemonType[];

   /** Data describing a Pokémon's appearance in the past */
   past_types: PokemonPastType[];
}

/**
 * Abilities the Pokémon may have
 */
export interface PokemonAbility {
   /** Whether this is a hidden ability */
   is_hidden: boolean;

   /** The slot this ability occupies in this Pokémon species */
   slot: number;

   /** The ability the Pokémon may have */
   ability: NamedAPIResource;
}

/**
 * Items a Pokémon may be holding when encountered
 */
export interface PokemonHeldItem {
   /** The item the referenced Pokémon holds */
   item: NamedAPIResource;

   /** The details of the different versions in which the item is held */
   version_details: PokemonHeldItemVersion[];
}

/**
 * Version details for held items
 */
export interface PokemonHeldItemVersion {
   /** The version in which the item is held */
   version: NamedAPIResource;

   /** How often the item is held */
   rarity: number;
}

/**
 * Moves a Pokémon can learn
 */
export interface PokemonMove {
   /** The move the Pokémon can learn */
   move: NamedAPIResource;

   /** The details of the version in which the Pokémon can learn the move */
   version_group_details: PokemonMoveVersion[];
}

/**
 * Version details for moves
 */
export interface PokemonMoveVersion {
   /** The method by which the move is learned */
   move_learn_method: NamedAPIResource;

   /** The version group in which the move is learned */
   version_group: NamedAPIResource;

   /** The minimum level to learn the move */
   level_learned_at: number;
}

/**
 * Sprites used to depict this Pokémon in the game
 */
export interface PokemonSprites {
   /** The default depiction of this Pokémon from the front in battle */
   front_default: string | null;

   /** The shiny depiction of this Pokémon from the front in battle */
   front_shiny: string | null;

   /** The female depiction of this Pokémon from the front in battle */
   front_female: string | null;

   /** The shiny female depiction of this Pokémon from the front in battle */
   front_shiny_female: string | null;

   /** The default depiction of this Pokémon from the back in battle */
   back_default: string | null;

   /** The shiny depiction of this Pokémon from the back in battle */
   back_shiny: string | null;

   /** The female depiction of this Pokémon from the back in battle */
   back_female: string | null;

   /** The shiny female depiction of this Pokémon from the back in battle */
   back_shiny_female: string | null;

   /** Additional sprite collections for different generations and versions */
   other?: {
      /** Official artwork sprites */
      "official-artwork"?: {
         front_default?: string | null;
         front_shiny?: string | null;
      };
      /** Home sprites */
      home?: {
         front_default?: string | null;
         front_female?: string | null;
         front_shiny?: string | null;
         front_shiny_female?: string | null;
      };
      /** Dream World sprites */
      dream_world?: {
         front_default?: string | null;
         front_female?: string | null;
      };
   };

   /** Version-specific sprite collections */
   versions?: {
      [generation: string]: {
         [version: string]: {
            animated?: PokemonVersionSprites;
            back_default?: string | null;
            back_female?: string | null;
            back_shiny?: string | null;
            back_shiny_female?: string | null;
            front_default?: string | null;
            front_female?: string | null;
            front_shiny?: string | null;
            front_shiny_female?: string | null;
         };
      };
   };
}

/**
 * Version-specific sprite collection
 */
export interface PokemonVersionSprites {
   back_default?: string | null;
   back_female?: string | null;
   back_shiny?: string | null;
   back_shiny_female?: string | null;
   front_default?: string | null;
   front_female?: string | null;
   front_shiny?: string | null;
   front_shiny_female?: string | null;
}

/**
 * Base stats for a Pokémon
 */
export interface PokemonStat {
   /** The stat the Pokémon has */
   stat: NamedAPIResource;

   /** The effort points (EV) the Pokémon has in the stat */
   effort: number;

   /** The base value of the stat */
   base_stat: number;
}

/**
 * Types the Pokémon has
 */
export interface PokemonType {
   /** The order the Pokémon's types are listed in */
   slot: number;

   /** The type the referenced Pokémon has */
   type: NamedAPIResource;
}

/**
 * Past type data for a Pokémon
 */
export interface PokemonPastType {
   /** The generation of this Pokémon's past types */
   generation: NamedAPIResource;

   /** The types the Pokémon had in past generations */
   types: PokemonType[];
}
