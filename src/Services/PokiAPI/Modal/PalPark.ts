import { NamedAPIResource, Name } from "./Common";

/**
 * Areas used for grouping Pokémon from the Pal Park
 *
 * @endpoint https://pokeapi.co/api/v2/pal-park-area/{id or name}/
 */
export interface PalParkArea {
   /** The identifier for this Pal Park area resource */
   id: number;

   /** The name for this Pal Park area resource */
   name: string;

   /** The name of this Pal Park area listed in different languages */
   names: Name[];

   /** A list of Pokémon that can be encountered in this area */
   pokemon_encounters: PalParkEncounterSpecies[];
}

/**
 * Pokémon encounters in Pal Park areas
 */
export interface PalParkEncounterSpecies {
   /** The base score given to the player when the referenced Pokémon is caught */
   base_score: number;

   /** The base rate for encountering the referenced Pokémon */
   rate: number;

   /** The Pokémon species that can be encountered */
   pokemon_species: NamedAPIResource;
}
