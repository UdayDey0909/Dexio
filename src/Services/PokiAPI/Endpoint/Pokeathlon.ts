import { NamedAPIResource, Name } from "./Common";

/**
 * Pokéathlon stats are different attributes of a Pokémon's performance in Pokéathlon events
 *
 * @endpoint https://pokeapi.co/api/v2/pokeathlon-stat/{id or name}/
 */
export interface PokeathlonStat {
   /** The identifier for this Pokéathlon stat resource */
   id: number;

   /** The name for this Pokéathlon stat resource */
   name: string;

   /** The name of this Pokéathlon stat listed in different languages */
   names: Name[];

   /** A detail of natures which affect this Pokéathlon stat positively or negatively */
   affecting_natures: NaturePokeathlonStatAffectSets;
}

/**
 * Nature Pokéathlon stat affect sets
 */
export interface NaturePokeathlonStatAffectSets {
   /** A list of natures and how they change the referenced Pokéathlon stat */
   increase: NaturePokeathlonStatAffect[];

   /** A list of natures and how they change the referenced Pokéathlon stat */
   decrease: NaturePokeathlonStatAffect[];
}

/**
 * Nature Pokéathlon stat effects
 */
export interface NaturePokeathlonStatAffect {
   /** The maximum amount of change to the referenced Pokéathlon stat */
   max_change: number;

   /** The nature causing the change */
   nature: NamedAPIResource;
}
