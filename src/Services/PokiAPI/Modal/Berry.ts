import { NamedAPIResource, Name } from "./Common";

/**
 * Berries are small fruits that can provide HP and status condition restoration,
 * stat enhancement, and even damage negation when eaten by Pokémon.
 */
export interface Berry {
   /** The identifier for this berry resource */
   id: number;

   /** The name for this berry resource */
   name: string;

   /** Time it takes the tree to grow one stage, in hours */
   growth_time: number;

   /** The maximum number of berries that can grow on one tree */
   max_harvest: number;

   /** The power of the move "Natural Gift" when used with this berry */
   natural_gift_power: number;

   /** The size of this berry, in millimeters */
   size: number;

   /** The smoothness of this berry, used in making Pokéblocks or Poffins */
   smoothness: number;

   /** The speed at which this berry dries out the soil as it grows */
   soil_dryness: number;

   /** The firmness of this berry */
   firmness: NamedAPIResource;

   /** The flavor of this berry */
   flavors: BerryFlavorMap[];

   /** The item that corresponds to this berry */
   item: NamedAPIResource;

   /** The type of the move "Natural Gift" when used with this berry */
   natural_gift_type: NamedAPIResource;
}

/**
 * Maps berries to their different flavors
 */
export interface BerryFlavorMap {
   /** How powerful the referenced flavor is for this berry */
   potency: number;

   /** The flavor that correlates with this berry */
   flavor: NamedAPIResource;
}

/**
 * Berry firmness determines how hard a berry is
 */
export interface BerryFirmness {
   /** The identifier for this berry firmness resource */
   id: number;

   /** The name for this berry firmness resource */
   name: string;

   /** A list of berries with this firmness */
   berries: NamedAPIResource[];

   /** The name of this berry firmness listed in different languages */
   names: Name[];
}

/**
 * Flavors determine whether a Pokémon will benefit or suffer from eating a berry
 */
export interface BerryFlavor {
   /** The identifier for this berry flavor resource */
   id: number;

   /** The name for this berry flavor resource */
   name: string;

   /** A list of berries with this flavor */
   berries: FlavorBerryMap[];

   /** The contest type that correlates with this berry flavor */
   contest_type: NamedAPIResource;

   /** The name of this berry flavor listed in different languages */
   names: Name[];
}

/**
 * Maps flavors to berries
 */
export interface FlavorBerryMap {
   /** How powerful the referenced flavor is for this berry */
   potency: number;

   /** The berry with this flavor */
   berry: NamedAPIResource;
}
