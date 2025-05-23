import { Name, NamedAPIResource } from "./Common";

/**
 * Methods by which the player might can encounter Pokémon in the wild
 *
 * Endpoint: https://pokeapi.co/api/v2/encounter-method/{id or name}/
 */
export interface EncounterMethod {
   /** The identifier for this encounter method resource */
   id: number;

   /** The name for this encounter method resource */
   name: string;

   /** A good value for sorting */
   order: number;

   /** The name of this encounter method listed in different languages */
   names: Name[];
}

/**
 * Conditions which affect what Pokémon might appear in the wild
 *
 * Endpoint: https://pokeapi.co/api/v2/encounter-condition/{id or name}/
 */
export interface EncounterCondition {
   /** The identifier for this encounter condition resource */
   id: number;

   /** The name for this encounter condition resource */
   name: string;

   /** The name of this encounter condition listed in different languages */
   names: Name[];

   /** A list of possible values for this encounter condition */
   values: NamedAPIResource[];
}

/**
 * Encounter condition values are the various states that an encounter condition can have
 *
 * Endpoint: https://pokeapi.co/api/v2/encounter-condition-value/{id or name}/
 */
export interface EncounterConditionValue {
   /** The identifier for this encounter condition value resource */
   id: number;

   /** The name for this encounter condition value resource */
   name: string;

   /** The condition this encounter condition value pertains to */
   condition: NamedAPIResource;

   /** The name of this encounter condition value listed in different languages */
   names: Name[];
}
