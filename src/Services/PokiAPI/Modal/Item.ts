import {
   NamedAPIResource,
   VerboseEffect,
   Description,
   Effect,
   APIResource,
   Name,
   VersionGameIndex,
} from "./Common";

/**
 * An item is an object in the games which the player can pick up,
 * keep in their bag, and use in some manner.
 *
 * @endpoint https://pokeapi.co/api/v2/item/{id or name}/
 */
export interface Item {
   /** The identifier for this item resource */
   id: number;

   /** The name for this item resource */
   name: string;

   /** The price of this item in stores */
   cost: number;

   /** The power of the move Fling when used with this item */
   fling_power: number | null;

   /** The effect of the move Fling when used with this item */
   fling_effect: NamedAPIResource | null;

   /** A list of attributes this item has */
   attributes: NamedAPIResource[];

   /** The category of items this item falls into */
   category: NamedAPIResource;

   /** The effect of this item detailed in different languages */
   effect_entries: VerboseEffect[];

   /** The flavor text of this item in different languages */
   flavor_text_entries: ItemFlavorText[];

   /** A list of game indices relevant to this item by generation */
   game_indices: VersionGameIndex[];

   /** The name of this item in different languages */
   names: Name[];

   /** A set of sprites used to depict this item in the game */
   sprites: ItemSprites;

   /** A list of Pokémon that might be found holding this item */
   held_by_pokemon: ItemHolderPokemon[];

   /** An evolution chain this item requires to produce a baby during breeding */
   baby_trigger_for: APIResource | null;

   /** A list of the machines related to this item */
   machines: MachineVersionDetail[];
}

/**
 * Item flavor text entries
 */
export interface ItemFlavorText {
   /** The localized flavor text for an item */
   text: string;

   /** The language this flavor text is in */
   language: NamedAPIResource;

   /** The version group this flavor text is from */
   version_group: NamedAPIResource;
}

/**
 * Item sprites
 */
export interface ItemSprites {
   /** The default depiction of this item */
   default: string | null;
}

/**
 * Pokemon that might be found holding an item
 */
export interface ItemHolderPokemon {
   /** The Pokémon that holds this item */
   pokemon: NamedAPIResource;

   /** The details for the version in which the Pokémon can hold this item */
   version_details: ItemHolderPokemonVersionDetail[];
}

/**
 * Version details for a Pokemon holding an item
 */
export interface ItemHolderPokemonVersionDetail {
   /** How often this Pokémon holds this item in this version */
   rarity: number;

   /** The version in which the Pokémon holds this item */
   version: NamedAPIResource;
}

/**
 * Machine version detail for items that can be used as TMs/HMs
 */
export interface MachineVersionDetail {
   /** The machine (TM/HM) that teaches a move from an item */
   machine: APIResource;

   /** The version group of this machine */
   version_group: NamedAPIResource;
}

/**
 * Item attributes define particular aspects of items
 *
 * @endpoint https://pokeapi.co/api/v2/item-attribute/{id or name}/
 */
export interface ItemAttribute {
   /** The identifier for this item attribute resource */
   id: number;

   /** The name for this item attribute resource */
   name: string;

   /** A list of items that have this attribute */
   items: NamedAPIResource[];

   /** The name of this item attribute listed in different languages */
   names: Name[];

   /** The description of this item attribute listed in different languages */
   descriptions: Description[];
}

/**
 * Item categories determine where items will be placed in the players bag
 *
 * @endpoint https://pokeapi.co/api/v2/item-category/{id or name}/
 */
export interface ItemCategory {
   /** The identifier for this item category resource */
   id: number;

   /** The name for this item category resource */
   name: string;

   /** A list of items that are a part of this category */
   items: NamedAPIResource[];

   /** The name of this item category listed in different languages */
   names: Name[];

   /** The pocket items in this category would be put in */
   pocket: NamedAPIResource;
}

/**
 * The various effects of the move "Fling" when used with different items
 *
 * @endpoint https://pokeapi.co/api/v2/item-fling-effect/{id or name}/
 */
export interface ItemFlingEffect {
   /** The identifier for this fling effect resource */
   id: number;

   /** The name for this fling effect resource */
   name: string;

   /** The result of this fling effect listed in different languages */
   effect_entries: Effect[];

   /** A list of items that have this fling effect */
   items: NamedAPIResource[];
}

/**
 * Pockets within the players bag used for storing items by category
 *
 * @endpoint https://pokeapi.co/api/v2/item-pocket/{id or name}/
 */
export interface ItemPocket {
   /** The identifier for this item pocket resource */
   id: number;

   /** The name for this item pocket resource */
   name: string;

   /** A list of item categories that are relevant to this item pocket */
   categories: NamedAPIResource[];

   /** The name of this item pocket listed in different languages */
   names: Name[];
}
