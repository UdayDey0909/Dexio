import { Name, NamedAPIResource, VerboseEffect } from "./Common";

/**
 * Abilities provide passive effects for Pokémon in battle or in the overworld.
 * Each Pokémon has between one and three abilities.
 *
 * Endpoint: https://pokeapi.co/api/v2/ability/{id or name}/
 */
export interface Ability {
   /** The identifier for this ability resource */
   id: number;

   /** The name for this ability resource */
   name: string;

   /** Whether this ability is part of the main series of Pokémon games */
   is_main_series: boolean;

   /** The generation this ability was introduced in */
   generation: NamedAPIResource;

   /** The name of this ability listed in different languages */
   names: Name[];

   /** The effect of this ability described in different languages */
   effect_entries: VerboseEffect[];

   /** The list of previous effects this ability has had across version groups */
   effect_changes: AbilityEffectChange[];

   /** The flavor text of this ability listed in different languages */
   flavor_text_entries: AbilityFlavorText[];

   /** A list of Pokémon that could potentially have this ability */
   pokemon: AbilityPokemon[];
}

/**
 * Effect changes for abilities in different version groups
 *
 * Nested in: https://pokeapi.co/api/v2/ability/{id or name}/
 */
export interface AbilityEffectChange {
   /** The version group in which the effect change occurred */
   version_group: NamedAPIResource;

   /** The effects of this ability in different languages */
   effect_entries: VerboseEffect[];
}

/**
 * Flavor text for abilities
 *
 * Nested in: https://pokeapi.co/api/v2/ability/{id or name}/
 */
export interface AbilityFlavorText {
   /** The localized flavor text for an ability */
   flavor_text: string;

   /** The language this flavor text is in */
   language: NamedAPIResource;

   /** The version group this flavor text is from */
   version_group: NamedAPIResource;
}

/**
 * Pokemon that may have the ability
 *
 * Nested in: https://pokeapi.co/api/v2/ability/{id or name}/
 */
export interface AbilityPokemon {
   /** Whether this ability is hidden (not visible in normal gameplay) */
   is_hidden: boolean;

   /** The slot this ability occupies in the Pokémon's ability list */
   slot: number;

   /** The Pokémon that can have this ability */
   pokemon: NamedAPIResource;
}
