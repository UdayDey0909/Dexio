import { NamedAPIResource, Description } from "./Common";

/**
 * Growth rates are the speed with which Pokémon gain levels through experience
 *
 * @endpoint https://pokeapi.co/api/v2/growth-rate/{id or name}/
 */
export interface GrowthRate {
   /** The identifier for this growth rate resource */
   id: number;

   /** The name for this growth rate resource */
   name: string;

   /** The formula used to calculate the rate at which the Pokémon species gains level */
   formula: string;

   /** The descriptions of this growth rate listed in different languages */
   descriptions: Description[];

   /** A list of levels and the amount of experience needed to attain them based on this growth rate */
   levels: GrowthRateExperienceLevel[];

   /** A list of Pokémon species that gain levels at this growth rate */
   pokemon_species: NamedAPIResource[];
}

/**
 * Experience level information for a growth rate
 */
export interface GrowthRateExperienceLevel {
   /** The level gained */
   level: number;

   /** The amount of experience required to attain this level */
   experience: number;
}
