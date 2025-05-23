import { NamedAPIResource, Name, Effect, FlavorText } from "./Common";

/**
 * Contest types are categories judges used to weigh a Pokémon's condition in Pokémon contests
 */
export interface ContestType {
   /** The identifier for this contest type resource */
   id: number;

   /** The name for this contest type resource */
   name: string;

   /** The berry flavor that correlates with this contest type */
   berry_flavor: NamedAPIResource;

   /** The name of this contest type listed in different languages */
   names: Name[];
}

/**
 * Contest effects refer to the effects of moves when used in contests
 */
export interface ContestEffect {
   /** The identifier for this contest effect resource */
   id: number;

   /** The base number of hearts the user gets when using this move */
   appeal: number;

   /** The base number of hearts the user's opponent loses when using this move */
   jam: number;

   /** The result of this contest effect listed in different languages */
   effect_entries: Effect[];

   /** The flavor text of this contest effect listed in different languages */
   flavor_text_entries: FlavorText[];
}

/**
 * Super contest effects refer to the effects of moves when used in super contests
 */
export interface SuperContestEffect {
   /** The identifier for this super contest effect resource */
   id: number;

   /** The level of appeal this super contest effect has */
   appeal: number;

   /** The flavor text of this super contest effect listed in different languages */
   flavor_text_entries: FlavorText[];

   /** A list of moves that have this super contest effect */
   moves: NamedAPIResource[];
}
