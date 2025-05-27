import {
   NamedAPIResource,
   APIResource,
   Name,
   Description,
   FlavorText,
} from "./Common";

/**
 * A Pokémon Species forms the basis for at least one Pokémon.
 * Attributes of a Pokémon species are shared across all varieties of Pokémon
 * within the species. A good example is Wormadam; Wormadam is the species which
 * can be found in three different varieties, Wormadam-Trash, Wormadam-Sandy and Wormadam-Plant.
 *
 * @endpoint https://pokeapi.co/api/v2/pokemon-species/{id or name}/
 */
export interface PokemonSpecies {
   /** The identifier for this Pokémon species resource */
   id: number;

   /** The name for this Pokémon species resource */
   name: string;

   /** The order in which species should be sorted. Based on National Dex order, except families are grouped together and sorted by stage. */
   order: number;

   /** The chance of this Pokémon being female, in eighths; or -1 for genderless */
   gender_rate: number;

   /** The base capture rate; up to 255. The higher the number, the easier the catch. */
   capture_rate: number;

   /** The happiness when caught by a normal Pokéball; up to 255. The higher the number, the happier the Pokémon. */
   base_happiness: number;

   /** Whether this is a baby Pokémon */
   is_baby: boolean;

   /** Whether this is a legendary Pokémon */
   is_legendary: boolean;

   /** Whether this is a mythical Pokémon */
   is_mythical: boolean;

   /** Initial hatch counter: one must walk 255 × (hatch_counter + 1) steps before this Pokémon's egg hatches, unless utilizing bonuses like Flame Body's */
   hatch_counter: number;

   /** Whether this Pokémon has visual gender differences */
   has_gender_differences: boolean;

   /** Whether this Pokémon can switch between forms */
   forms_switchable: boolean;

   /** The rate at which this Pokémon species gains levels */
   growth_rate: NamedAPIResource;

   /** A list of Pokédexes and the indexes of this Pokémon species within them */
   pokedex_numbers: PokemonSpeciesDexEntry[];

   /** A list of egg groups this Pokémon species is a member of */
   egg_groups: NamedAPIResource[];

   /** The color of this Pokémon for Pokédex search */
   color: NamedAPIResource;

   /** The shape of this Pokémon for Pokédex search */
   shape: NamedAPIResource;

   /** The Pokémon species that evolves into this Pokémon species */
   evolves_from_species: NamedAPIResource | null;

   /** The evolution chain this Pokémon species belongs to */
   evolution_chain: APIResource;

   /** The habitat this Pokémon species can be encountered in */
   habitat: NamedAPIResource | null;

   /** The generation this Pokémon species was introduced in */
   generation: NamedAPIResource;

   /** The name of this Pokémon species listed in different languages */
   names: Name[];

   /** A list of encounters that can be had with this Pokémon species in pal park */
   pal_park_encounters: PalParkEncounterArea[];

   /** A list of flavor text entries for this Pokémon species */
   flavor_text_entries: FlavorText[];

   /** Descriptions of different forms Pokémon take on within the Pokémon species */
   form_descriptions: Description[];

   /** The genus of this Pokémon species listed in multiple languages */
   genera: Genus[];

   /** A list of the Pokémon that exist within this Pokémon species */
   varieties: PokemonSpeciesVariety[];
}

/**
 * Pokédex entries for this species
 */
export interface PokemonSpeciesDexEntry {
   /** The index number within a Pokédex */
   entry_number: number;

   /** The Pokédex the referenced Pokémon species can be found in */
   pokedex: NamedAPIResource;
}

/**
 * Pal Park encounter areas
 */
export interface PalParkEncounterArea {
   /** The base score given to the player when the referenced Pokémon is caught during a pal park run */
   base_score: number;

   /** The base rate for encountering the referenced Pokémon in this pal park area */
   rate: number;

   /** The pal park area where this encounter happens */
   area: NamedAPIResource;
}

/**
 * Genus information for different languages
 */
export interface Genus {
   /** The localized genus for the referenced Pokémon species */
   genus: string;

   /** The language this genus is in */
   language: NamedAPIResource;
}

/**
 * Varieties of Pokémon within a species
 */
export interface PokemonSpeciesVariety {
   /** Whether this variety is the default variety */
   is_default: boolean;

   /** The Pokémon variety */
   pokemon: NamedAPIResource;
}
