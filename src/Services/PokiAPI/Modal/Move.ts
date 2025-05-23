import {
   NamedAPIResource,
   APIResource,
   VerboseEffect,
   Name,
   Description,
} from "./Common";

/**
 * Move resource structure
 * (GET /move/{id or name})
 * @endpoint https://pokeapi.co/api/v2/move/{id or name}/
 */
export interface Move {
   /** The identifier for this move resource */
   id: number;

   /** The name of this move */
   name: string;

   /** The percent value of how likely this move is to hit */
   accuracy: number | null;

   /** The percent value of how likely it is this move will cause an additional effect */
   effect_chance: number | null;

   /** Power points. The number of times this move can be used */
   pp: number | null;

   /** A value between -8 and 8. Sets the order in which moves are executed during battle */
   priority: number;

   /** The base power of this move with a value of 0 if it does not cause damage */
   power: number | null;

   /** Contest combo data for this move */
   contest_combos: {
      /** Normal contest combo details */
      normal: {
         /** Moves that can be used before this move in a normal contest */
         use_before: NamedAPIResource[] | null;

         /** Moves that can be used after this move in a normal contest */
         use_after: NamedAPIResource[] | null;
      } | null;

      /** Super contest combo details */
      super: {
         /** Moves that can be used before this move in a super contest */
         use_before: NamedAPIResource[] | null;

         /** Moves that can be used after this move in a super contest */
         use_after: NamedAPIResource[] | null;
      } | null;
   } | null;

   /** The contest type this move belongs to */
   contest_type: NamedAPIResource | null; // @endpoint https://pokeapi.co/api/v2/contest-type/{id or name}/

   /** The effect this move has when used in a contest */
   contest_effect: APIResource | null; // @endpoint https://pokeapi.co/api/v2/contest-effect/{id}/

   /** The type of damage this move inflicts */
   damage_class: NamedAPIResource; // @endpoint https://pokeapi.co/api/v2/move-damage-class/{id or name}/

   /** The effect of this move listed in different languages */
   effect_entries: VerboseEffect[];

   /** Changes to the effect of this move across version groups */
   effect_changes: MoveEffectChange[];

   /** The flavor text descriptions of this move listed in different languages */
   flavor_text_entries: MoveFlavorText[];

   /** The generation this move was introduced in */
   generation: NamedAPIResource; // @endpoint https://pokeapi.co/api/v2/generation/{id or name}/

   /** A list of machines that can teach this move */
   machines: MachineMoveDetail[];

   /** Metadata about this move */
   meta: MoveMeta | null;

   /** The name of this move listed in different languages */
   names: Name[];

   /** A list of previous values for this move across version groups */
   past_values: MovePastValue[];

   /** A list of stats this move affects and how much it affects them */
   stat_changes: MoveStatChange[];

   /** The effect the move has when used in a super contest */
   super_contest_effect: APIResource | null; // @endpoint https://pokeapi.co/api/v2/super-contest-effect/{id}/

   /** The target of this move */
   target: NamedAPIResource; // @endpoint https://pokeapi.co/api/v2/move-target/{id or name}/

   /** The elemental type of this move */
   type: NamedAPIResource; // @endpoint https://pokeapi.co/api/v2/type/{id or name}/
}

/**
 * Effect changes for moves in different version groups
 * @endpoint https://pokeapi.co/api/v2/move/{id or name}/
 */
export interface MoveEffectChange {
   /** The version group in which the effect change occurred */
   version_group: NamedAPIResource;

   /** The effects of this move in different languages */
   effect_entries: VerboseEffect[];
}

/**
 * Flavor text for moves
 * @endpoint https://pokeapi.co/api/v2/move/{id or name}/
 */
export interface MoveFlavorText {
   /** The localized flavor text for a move */
   flavor_text: string;

   /** The language this flavor text is in */
   language: NamedAPIResource;

   /** The version group this flavor text is from */
   version_group: NamedAPIResource;
}

/**
 * Machine move detail for moves that can be learned via TM/HM
 * @endpoint https://pokeapi.co/api/v2/move/{id or name}/
 */
export interface MachineMoveDetail {
   /** The machine that teaches this move */
   machine: APIResource;

   /** The version group of this machine */
   version_group: NamedAPIResource;
}

/**
 * Move metadata
 * @endpoint https://pokeapi.co/api/v2/move/{id or name}/
 */
export interface MoveMeta {
   /** The status ailment this move inflicts */
   ailment: NamedAPIResource; // @endpoint https://pokeapi.co/api/v2/move-ailment/{id or name}/

   /** The category of this move */
   category: NamedAPIResource; // @endpoint https://pokeapi.co/api/v2/move-category/{id or name}/

   /** The minimum number of times this move hits */
   min_hits: number | null;

   /** The maximum number of times this move hits */
   max_hits: number | null;

   /** The minimum number of turns this move continues to take effect */
   min_turns: number | null;

   /** The maximum number of turns this move continues to take effect */
   max_turns: number | null;

   /** HP drain (if positive) or loss (if negative) as a percentage of damage done */
   drain: number;

   /** The amount of HP gained by the attacking Pokémon as a percentage of damage done */
   healing: number;

   /** Critical hit rate bonus */
   crit_rate: number;

   /** The chance this move has to cause an ailment */
   ailment_chance: number;

   /** The chance this move has to cause the target Pokémon to flinch */
   flinch_chance: number;

   /** The chance this move has to cause a stat change in the target Pokémon */
   stat_chance: number;
}

/**
 * Past values for moves in different version groups
 * @endpoint https://pokeapi.co/api/v2/move/{id or name}/
 */
export interface MovePastValue {
   /** The percent value of how likely this move is to hit in this version group */
   accuracy: number | null;

   /** The percent value of how likely it is this move will cause an additional effect in this version group */
   effect_chance: number | null;

   /** The base power of this move with a value of 0 if it does not cause damage in this version group */
   power: number | null;

   /** Power points. The number of times this move can be used in this version group */
   pp: number | null;

   /** The effect of this move in this version group */
   effect_entries: VerboseEffect[];

   /** The type of this move in this version group */
   type: NamedAPIResource | null;

   /** The version group in which these changes were introduced */
   version_group: NamedAPIResource;
}

/**
 * Stat changes caused by moves
 * @endpoint https://pokeapi.co/api/v2/move/{id or name}/
 */
export interface MoveStatChange {
   /** The amount of change to the referenced stat */
   change: number;

   /** The stat being affected */
   stat: NamedAPIResource;
}

/**
 * Move ailments are status conditions caused by moves used in battle
 * @endpoint https://pokeapi.co/api/v2/move-ailment/{id or name}/
 */
export interface MoveAilment {
   /** The identifier for this move ailment resource */
   id: number;

   /** The name for this move ailment resource */
   name: string;

   /** A list of moves that cause this ailment */
   moves: NamedAPIResource[];

   /** The name of this move ailment listed in different languages */
   names: Name[];
}

/**
 * Move battle styles categorize moves into different fighting styles
 * @endpoint https://pokeapi.co/api/v2/move-battle-style/{id or name}/
 */
export interface MoveBattleStyle {
   /** The identifier for this move battle style resource */
   id: number;

   /** The name for this move battle style resource */
   name: string;

   /** The name of this move battle style listed in different languages */
   names: Name[];
}

/**
 * Move categories determine whether a move is physical, special, or status
 * @endpoint https://pokeapi.co/api/v2/move-category/{id or name}/
 */
export interface MoveCategory {
   /** The identifier for this move category resource */
   id: number;

   /** The name for this move category resource */
   name: string;

   /** A list of moves that fall into this category */
   moves: NamedAPIResource[];

   /** The descriptions of this move category listed in different languages */
   descriptions: Description[];
}

/**
 * Move damage classes categorize moves based on how they deal damage
 * @endpoint https://pokeapi.co/api/v2/move-damage-class/{id or name}/
 */
export interface MoveDamageClass {
   /** The identifier for this move damage class resource */
   id: number;

   /** The name for this move damage class resource */
   name: string;

   /** The descriptions of this move damage class listed in different languages */
   descriptions: Description[];

   /** A list of moves that fall into this damage class */
   moves: NamedAPIResource[];

   /** The name of this move damage class listed in different languages */
   names: Name[];
}

/**
 * Methods by which Pokémon can learn moves
 * @endpoint https://pokeapi.co/api/v2/move-learn-method/{id or name}/
 */
export interface MoveLearnMethod {
   /** The identifier for this move learn method resource */
   id: number;

   /** The name for this move learn method resource */
   name: string;

   /** The descriptions of this move learn method listed in different languages */
   descriptions: Description[];

   /** The name of this move learn method listed in different languages */
   names: Name[];

   /** A list of version groups this move learn method applies to */
   version_groups: NamedAPIResource[];
}

/**
 * Move targets define what a move can target during battle
 * @endpoint https://pokeapi.co/api/v2/move-target/{id or name}/
 */
export interface MoveTarget {
   /** The identifier for this move target resource */
   id: number;

   /** The name for this move target resource */
   name: string;

   /** The descriptions of this move target listed in different languages */
   descriptions: Description[];

   /** A list of moves that use this target */
   moves: NamedAPIResource[];

   /** The name of this move target listed in different languages */
   names: Name[];
}
