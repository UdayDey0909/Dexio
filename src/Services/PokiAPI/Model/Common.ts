/**
 * Standard resource with URL reference
 */
export interface APIResource {
   /** URL pointing to the referenced resource */
   url: string;
}

/**
 * Standard named resource with name and URL reference
 */
export interface NamedAPIResource {
   /** The name of the referenced resource */
   name: string;

   /** URL pointing to the referenced resource */
   url: string;
}

/**
 * Pagination result wrapper interface
 */
export interface PaginatedResults<T> {
   /** The total number of resources available from this API */
   count: number;

   /** URL to the next page of resources (null if this is the last page) */
   next: string | null;

   /** URL to the previous page of resources (null if this is the first page) */
   previous: string | null;

   /** List of resources for the current page */
   results: T[];
}

/**
 * Type alias for a paginated list of named API resources
 */
export type NamedAPIResourceList = PaginatedResults<NamedAPIResource>;

/**
 * Description entry with language information
 */
export interface Description {
   /** The localized description text */
   description: string;

   /** The language this description is in */
   language: NamedAPIResource;
}

/**
 * Effect entry with language information
 */
export interface Effect {
   /** The localized effect text */
   effect: string;

   /** The language this effect is in */
   language: NamedAPIResource;
}

/**
 * Effect entry with short effect and language information
 */
export interface VerboseEffect {
   /** The localized effect text */
   effect: string;

   /** The localized short effect text */
   short_effect: string;

   /** The language this effect is in */
   language: NamedAPIResource;
}

/**
 * Name entry with language information
 */
export interface Name {
   /** The localized name */
   name: string;

   /** The language this name is in */
   language: NamedAPIResource;
}

/**
 * Flavor text entry with version and language information
 */
export interface FlavorText {
   /** The localized flavor text */
   flavor_text: string;

   /** The language this flavor text is in */
   language: NamedAPIResource;

   /** The game version this flavor text is from */
   version: NamedAPIResource;
}

/**
 * Game index information with version reference
 */
export interface VersionGameIndex {
   /** The internal ID of the game index */
   game_index: number;

   /** The version this game index is relevant to */
   version: NamedAPIResource;
}

/**
 * Language information
 * Endpoint: https://pokeapi.co/api/v2/language/{id or name}/
 */
export interface Language {
   /** The identifier for this language resource */
   id: number;

   /** The name of the language */
   name: string;

   /** Whether this language is considered an official language */
   official: boolean;

   /** The ISO639 code for this language */
   iso639: string;

   /** The ISO3166 code for this language */
   iso3166: string;

   /** The localized names of this language, listed in different languages */
   names: Name[];
}
