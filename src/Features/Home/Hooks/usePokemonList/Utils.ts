import type { Pokemon } from "pokenode-ts";
import { PokemonCardData } from "../../Types";

export const transformPokemonToCardData = (
   pokemon: Pokemon
): PokemonCardData => {
   // Remove anything after a dash (including the dash) from the name
   const displayName = pokemon.name.split("-")[0];
   return {
      id: pokemon.id,
      name: displayName.charAt(0).toUpperCase() + displayName.slice(1),
      image: {
         uri:
            pokemon.sprites.other?.["official-artwork"]?.front_default ||
            pokemon.sprites.front_default ||
            `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${pokemon.id}.png`,
      },
      types: pokemon.types.map(
         (type) =>
            type.type.name.charAt(0).toUpperCase() + type.type.name.slice(1)
      ),
   };
};

export const generatePokemonIds = (
   offset: number,
   batchSize: number,
   totalPokemon: number
): number[] => {
   return Array.from(
      { length: batchSize },
      (_, index) => offset + index + 1
   ).filter((id) => id <= totalPokemon);
};

export const calculatePaginationData = (
   currentOffset: number,
   fetchedCount: number,
   batchSize: number,
   totalPokemon: number
) => {
   const newOffset = currentOffset + fetchedCount;
   const hasMoreData = newOffset < totalPokemon && fetchedCount === batchSize;

   return { newOffset, hasMoreData };
};
