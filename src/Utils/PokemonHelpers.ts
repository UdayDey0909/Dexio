// ==========================================
// utils/pokemonHelpers.ts - Utility Functions
// ==========================================

import type { Pokemon, PokemonType, Stat } from "pokenode-ts";

export const getPokemonImageUrl = (id: number): string => {
   return `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${id}.png`;
};

export const getPokemonSpriteUrl = (
   id: number,
   shiny: boolean = false
): string => {
   const shinyPath = shiny ? "shiny/" : "";
   return `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${shinyPath}${id}.png`;
};

export const formatPokemonId = (id: number): string => {
   return `#${id.toString().padStart(3, "0")}`;
};

export const capitalizeName = (name: string): string => {
   return name.charAt(0).toUpperCase() + name.slice(1);
};

export const getTypeColor = (typeName: string): string => {
   const typeColors: Record<string, string> = {
      normal: "#A8A878",
      fire: "#F08030",
      water: "#6890F0",
      electric: "#F8D030",
      grass: "#78C850",
      ice: "#98D8D8",
      fighting: "#C03028",
      poison: "#A040A0",
      ground: "#E0C068",
      flying: "#A890F0",
      psychic: "#F85888",
      bug: "#A8B820",
      rock: "#B8A038",
      ghost: "#705898",
      dragon: "#7038F8",
      dark: "#705848",
      steel: "#B8B8D0",
      fairy: "#EE99AC",
   };

   return typeColors[typeName.toLowerCase()] || "#68A090";
};

export const getStatAbbreviation = (statName: string): string => {
   const statAbbreviations: Record<string, string> = {
      hp: "HP",
      attack: "ATK",
      defense: "DEF",
      "special-attack": "SP.ATK",
      "special-defense": "SP.DEF",
      speed: "SPD",
   };

   return statAbbreviations[statName] || statName.toUpperCase();
};

export const calculateStatTotal = (stats: Stat[]): number => {
   return stats.reduce((total, stat) => total + stat.base_stat, 0);
};

export const getPokemonTypes = (pokemon: Pokemon): string[] => {
   return pokemon.types.map((type) => type.type.name);
};

export const formatHeight = (height: number): string => {
   // Height is in decimeters, convert to meters
   const meters = height / 10;
   return `${meters}m`;
};

export const formatWeight = (weight: number): string => {
   // Weight is in hectograms, convert to kilograms
   const kg = weight / 10;
   return `${kg}kg`;
};
