import { NamedAPIResource, Name } from "./Common";

/**
 * Types are properties for Pokémon and their moves. Each type has three properties:
 * which types of Pokémon it is super effective against, which types of Pokémon
 * it is not very effective against, and which types of Pokémon it is completely
 * ineffective against.
 *
 * @endpoint https://pokeapi.co/api/v2/type/{id or name}/
 */
export interface Type {
   /** The identifier for this type resource */
   id: number;

   /** The name for this type resource */
   name: string;

   /** A detail of how effective this type is toward others and vice versa */
   damage_relations: TypeRelations;

   /** A list of details of how effective this type was toward others and vice versa in previous generations */
   past_damage_relations: TypeRelationsPast[];

   /** A list of game indices relevant to this type by generation */
   game_indices: TypeGameIndex[];

   /** The generation this type was introduced in */
   generation: NamedAPIResource;

   /** The class of damage inflicted by this type */
   move_damage_class: NamedAPIResource | null;

   /** The name of this type listed in different languages */
   names: Name[];

   /** A list of details of Pokémon that have this type */
   pokemon: TypePokemon[];

   /** A list of moves that have this type */
   moves: NamedAPIResource[];
}

/**
 * Type effectiveness relationships
 */
export interface TypeRelations {
   /** A list of types this type has no effect on */
   no_damage_to: NamedAPIResource[];

   /** A list of types this type is not very effective against */
   half_damage_to: NamedAPIResource[];

   /** A list of types this type is very effective against */
   double_damage_to: NamedAPIResource[];

   /** A list of types that have no effect on this type */
   no_damage_from: NamedAPIResource[];

   /** A list of types that are not very effective against this type */
   half_damage_from: NamedAPIResource[];

   /** A list of types that are very effective against this type */
   double_damage_from: NamedAPIResource[];
}

/**
 * Past type effectiveness relationships
 */
export interface TypeRelationsPast {
   /** The generation from which this type relationship changed */
   generation: NamedAPIResource;

   /** The damage relations this type had in past generations */
   damage_relations: TypeRelations;
}

/**
 * Game index for types
 */
export interface TypeGameIndex {
   /** The internal ID of an API resource within game data */
   game_index: number;

   /** The generation relevant to this game index */
   generation: NamedAPIResource;
}

/**
 * Pokémon that have this type
 */
export interface TypePokemon {
   /** The order the Pokémon's types are listed in */
   slot: number;

   /** The Pokémon that has the referenced type */
   pokemon: NamedAPIResource;
}
