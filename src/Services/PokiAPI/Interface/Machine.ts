import { NamedAPIResource } from "./Common";
/**
 * Machines are the representation of items that teach moves to Pokémon
 *
 * @endpoint https://pokeapi.co/api/v2/machine/{id or name}/
 */
export interface Machine {
   /** The identifier for this machine resource */
   id: number;

   /** The TM or HM item that corresponds to this machine */
   item: NamedAPIResource;

   /** The move that is taught by this machine */
   move: NamedAPIResource;

   /** The version group that this machine applies to */
   version_group: NamedAPIResource;
}
