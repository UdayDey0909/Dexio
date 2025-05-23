import { NamedAPIResource, Name } from "./Common";

/**
 * Natures influence how a Pokémon's stats grow
 * @endpoint https://pokeapi.co/api/v2/nature/{id or name}/
 */
export interface Nature {
   /** The identifier for this nature resource */
   id: number;

   /** The name for this nature resource */
   name: string;

   /** The stat decreased by 10% in Pokémon with this nature */
   decreased_stat: NamedAPIResource | null; // https://pokeapi.co/api/v2/stat/{id or name}/

   /** The stat increased by 10% in Pokémon with this nature */
   increased_stat: NamedAPIResource | null; // https://pokeapi.co/api/v2/stat/{id or name}/

   /** The flavor hated by Pokémon with this nature */
   hates_flavor: NamedAPIResource | null; // https://pokeapi.co/api/v2/berry-flavor/{id or name}/

   /** The flavor liked by Pokémon with this nature */
   likes_flavor: NamedAPIResource | null; // https://pokeapi.co/api/v2/berry-flavor/{id or name}/

   /** A list of Pokéathlon stats this nature effects and how much it effects them */
   pokeathlon_stat_changes: NaturePokeAthlonStatChange[]; // https://pokeapi.co/api/v2/pokeathlon-stat/{id or name}/

   /** A list of battle style preferences based on moves */
   move_battle_style_preferences: MoveBattleStylePreference[]; // https://pokeapi.co/api/v2/move-battle-style/{id or name}/

   /** The name of this nature listed in different languages */
   names: Name[];
}

/**
 * Pokéathlon stat changes caused by natures
 */
export interface NaturePokeAthlonStatChange {
   /** The maximum change in a Pokéathlon stat */
   max_change: number;

   /** The Pokéathlon stat being affected */
   pokeathlon_stat: NamedAPIResource; // https://pokeapi.co/api/v2/pokeathlon-stat/{id or name}/
}

/**
 * Battle style preferences for natures
 */
export interface MoveBattleStylePreference {
   /** Chance of using moves with this battle style when HP is low */
   low_hp_preference: number;

   /** Chance of using moves with this battle style when HP is high */
   high_hp_preference: number;

   /** The battle style being referenced */
   move_battle_style: NamedAPIResource; // https://pokeapi.co/api/v2/move-battle-style/{id or name}/
}
