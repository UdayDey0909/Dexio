import { NamedAPIResource, APIResource } from "./Common";

/**
 * Stats determine certain aspects of battles
 *
 * @endpoint https://pokeapi.co/api/v2/stat/{id or name}/
 */
export interface Stat {
   /** The identifier for this stat resource */
   id: number;

   /** The name for this stat resource */
   name: string;

   /** ID the games use for this stat */
   game_index: number;

   /** Whether this stat only exists within a battle */
   is_battle_only: boolean;

   /** A detail of moves which affect this stat positively or negatively */
   affecting_moves: MoveStatAffectSets;

   /** A detail of natures which affect this stat positively or negatively */
   affecting_natures: NatureStatAffectSets;

   /** A list of characteristics that are set on a Pokémon when its highest base stat is this stat */
   characteristics: APIResource[];

   /** The class of damage this stat is directly related to */
   move_damage_class: NamedAPIResource | null;

   /** The name of this stat listed in different languages */
   names: Name[];
}

/**
 * Move stat affect sets
 */
export interface MoveStatAffectSets {
   /** A list of moves and how they change the referenced stat */
   increase: MoveStatAffect[];

   /** A list of moves and how they change the referenced stat */
   decrease: MoveStatAffect[];
}

/**
 * Move stat effects
 */
export interface MoveStatAffect {
   /** The maximum amount of change to the referenced stat */
   change: number;

   /** The move causing the change */
   move: NamedAPIResource;
}

/**
 * Nature stat affect sets
 */
export interface NatureStatAffectSets {
   /** A list of natures and how they change the referenced stat */
   increase: NamedAPIResource[];

   /** A list of natures and how they change the referenced stat */
   decrease: NamedAPIResource[];
}

/**
 * Characteristics indicate which stat contains a Pokémon's highest IV
 *
 * @endpoint https://pokeapi.co/api/v2/characteristic/{id}/
 */
export interface Characteristic {
   /** The identifier for this characteristic resource */
   id: number;

   /** The remainder of the highest stat/IV divided by 5 */
   gene_modulo: number;

   /** The possible values of the highest stat that would result in a Pokémon receiving this characteristic when divided by 5 */
   possible_values: number[];

   /** The stat which results in this characteristic */
   highest_stat: NamedAPIResource;

   /** The descriptions of this characteristic listed in different languages */
   descriptions: Description[];
}

/**
 * Pokémon colors used for sorting in Pokédexes
 *
 * @endpoint https://pokeapi.co/api/v2/pokemon-color/{id or name}/
 */
export interface PokemonColor {
   /** The identifier for this Pokémon color resource */
   id: number;

   /** The name for this Pokémon color resource */
   name: string;

   /** The name of this Pokémon color listed in different languages */
   names: Name[];

   /** A list of the Pokémon species that have this color */
   pokemon_species: NamedAPIResource[];
}

/**
 * Pokémon habitats are the environments in which Pokémon live
 *
 * @endpoint https://pokeapi.co/api/v2/pokemon-habitat/{id or name}/
 */
export interface PokemonHabitat {
   /** The identifier for this Pokémon habitat resource */
   id: number;

   /** The name for this Pokémon habitat resource */
   name: string;

   /** The name of this Pokémon habitat listed in different languages */
   names: Name[];

   /** A list of the Pokémon species that can be found in this habitat */
   pokemon_species: NamedAPIResource[];
}

/**
 * Pokémon shapes determine how a Pokémon looks
 *
 * @endpoint https://pokeapi.co/api/v2/pokemon-shape/{id or name}/
 */
export interface PokemonShape {
   /** The identifier for this Pokémon shape resource */
   id: number;

   /** The name for this Pokémon shape resource */
   name: string;

   /** The "scientific" name of this Pokémon shape listed in different languages */
   awesome_names: AwesomeName[];

   /** The name of this Pokémon shape listed in different languages */
   names: Name[];

   /** A list of the Pokémon species that have this shape */
   pokemon_species: NamedAPIResource[];
}

/**
 * Awesome names for Pokémon shapes
 */
export interface AwesomeName {
   /** The localized "scientific" name for an API resource in a specific language */
   awesome_name: string;

   /** The language this awesome name is in */
   language: NamedAPIResource;
}

/**
 * Pokémon forms are different appearances of the same Pokémon species
 *
 * @endpoint https://pokeapi.co/api/v2/pokemon-form/{id or name}/
 */
export interface PokemonForm {
   /** The identifier for this Pokémon form resource */
   id: number;

   /** The name for this Pokémon form resource */
   name: string;

   /** The order in which this form should be displayed */
   order: number;

   /** The identifier for the form in formulae */
   form_order: number;

   /** True for exactly one form used as the default for each Pokémon */
   is_default: boolean;

   /** Whether this form can only happen during battle */
   is_battle_only: boolean;

   /** Whether this form requires mega evolution */
   is_mega: boolean;

   /** The name of this form */
   form_name: string;

   /** The Pokémon that can take on this form */
   pokemon: NamedAPIResource;

   /** A set of sprites used to depict this Pokémon form in the game */
   sprites: PokemonFormSprites;

   /** The version group this Pokémon form was introduced in */
   version_group: NamedAPIResource;

   /** The form specific full name of this Pokémon form, or empty if the form does not have a specific name */
   names: Name[];

   /** The form specific form name of this Pokémon form, or empty if the form does not have a specific name */
   form_names: Name[];
}

/**
 * Pokémon form sprites
 */
export interface PokemonFormSprites {
   /** The default depiction of this Pokémon form from the front in battle */
   front_default: string | null;

   /** The shiny depiction of this Pokémon form from the front in battle */
   front_shiny: string | null;

   /** The default depiction of this Pokémon form from the back in battle */
   back_default: string | null;

   /** The shiny depiction of this Pokémon form from the back in battle */
   back_shiny: string | null;
}

/**
 * Egg groups are categories which determine which Pokémon are able to interbreed
 *
 * @endpoint https://pokeapi.co/api/v2/egg-group/{id or name}/
 */
export interface EggGroup {
   /** The identifier for this egg group resource */
   id: number;

   /** The name for this egg group resource */
   name: string;

   /** The name of this egg group listed in different languages */
   names: Name[];

   /** A list of all Pokémon species that are members of this egg group */
   pokemon_species: NamedAPIResource[];
}

/**
 * Genders were introduced in Generation II for the purposes of breeding Pokémon
 *
 * @endpoint https://pokeapi.co/api/v2/gender/{id or name}/
 */
export interface Gender {
   /** The identifier for this gender resource */
   id: number;

   /** The name for this gender resource */
   name: string;

   /** A list of Pokémon species that can be this gender and how likely it is that they will be */
   pokemon_species_details: PokemonSpeciesGender[];

   /** A list of required relationships between Pokémon to be able to breed */
   required_for_evolution: NamedAPIResource[];
}

/**
 * Pokémon species gender details
 */
export interface PokemonSpeciesGender {
   /** The chance of this Pokémon being female, in eighths; or -1 for genderless */
   rate: number;

   /** A Pokémon species that can be the referenced gender */
   pokemon_species: NamedAPIResource;
}

/**
 * Localized names used for various resources
 */
export interface Name {
   /** The localized name */
   name: string;

   /** The language this name is in */
   language: NamedAPIResource;
}

/**
 * Descriptions used for various resources
 */
export interface Description {
   /** The localized description */
   description: string;

   /** The language this description is in */
   language: NamedAPIResource;
}
