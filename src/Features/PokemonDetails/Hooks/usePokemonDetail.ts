// src/Features/PokemonDetails/Hooks/usePokemonDetail.ts
import { useState, useEffect, useMemo } from "react";
import { PokemonService } from "@/Services/API/Pokemon";
import type { Pokemon, PokemonSpecies } from "pokenode-ts";

interface PokemonDetailData {
   pokemon: Pokemon | null;
   species: PokemonSpecies | null;
}

interface UsePokemonDetailReturn {
   pokemonData: PokemonDetailData;
   loading: boolean;
   error: string | null;
   refetch: () => void;
   isShiny: boolean;
   toggleShiny: () => void;
   currentSprite: string;
   hasShinySprite: boolean;
}

export const usePokemonDetail = (pokemonId: string): UsePokemonDetailReturn => {
   const [pokemonData, setPokemonData] = useState<PokemonDetailData>({
      pokemon: null,
      species: null,
   });
   const [loading, setLoading] = useState(true);
   const [error, setError] = useState<string | null>(null);
   const [isShiny, setIsShiny] = useState(false);

   const fetchPokemonData = async () => {
      try {
         setLoading(true);
         setError(null);

         const pokemonService = new PokemonService();

         // Fetch Pokemon and Species data in parallel
         const [pokemon, species] = await Promise.all([
            pokemonService.getPokemon(pokemonId),
            pokemonService.getPokemonSpecies(pokemonId),
         ]);

         setPokemonData({
            pokemon,
            species,
         });
      } catch (err) {
         setError(
            err instanceof Error ? err.message : "Failed to fetch Pokemon data"
         );
      } finally {
         setLoading(false);
      }
   };

   useEffect(() => {
      if (pokemonId) {
         fetchPokemonData();
      }
   }, [pokemonId]);

   const currentSprite = useMemo(() => {
      if (!pokemonData.pokemon) return "";

      if (isShiny) {
         return (
            pokemonData.pokemon.sprites.front_shiny ||
            pokemonData.pokemon.sprites.front_default ||
            ""
         );
      }

      return pokemonData.pokemon.sprites.front_default || "";
   }, [pokemonData.pokemon, isShiny]);

   const hasShinySprite = useMemo(() => {
      return !!pokemonData.pokemon?.sprites.front_shiny;
   }, [pokemonData.pokemon]);

   const toggleShiny = () => {
      if (hasShinySprite) {
         setIsShiny(!isShiny);
      }
   };

   const refetch = () => {
      fetchPokemonData();
   };

   return {
      pokemonData,
      loading,
      error,
      refetch,
      isShiny,
      toggleShiny,
      currentSprite,
      hasShinySprite,
   };
};

// Type colors for Pokemon types
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

export const usePokemonTypeColors = () => {
   const getTypeColor = (type: string): string => {
      return typeColors[type.toLowerCase()] || "#68A090";
   };

   const getTypeGradient = (types: string[]): string[] => {
      return types.map((type) => getTypeColor(type));
   };

   return {
      getTypeColor,
      getTypeGradient,
   };
};
