// ==========================================
// hooks/usePokemon.ts - Custom React Hook
// ==========================================

import { useState, useEffect } from "react";
import { pokemonService } from "../Services/PokemonService";
import type { Pokemon, PokemonSpecies } from "pokenode-ts";

interface UsePokemonResult {
   pokemon: Pokemon | null;
   species: PokemonSpecies | null;
   loading: boolean;
   error: string | null;
   refetch: () => void;
}

export const usePokemon = (
   identifier: string | number | null
): UsePokemonResult => {
   const [pokemon, setPokemon] = useState<Pokemon | null>(null);
   const [species, setSpecies] = useState<PokemonSpecies | null>(null);
   const [loading, setLoading] = useState(false);
   const [error, setError] = useState<string | null>(null);

   const fetchPokemon = async () => {
      if (!identifier) return;

      setLoading(true);
      setError(null);

      try {
         const [pokemonData, speciesData] = await Promise.all([
            pokemonService.getPokemon(identifier),
            pokemonService.getPokemonSpecies(identifier),
         ]);

         setPokemon(pokemonData);
         setSpecies(speciesData);
      } catch (err) {
         setError(err instanceof Error ? err.message : "An error occurred");
         setPokemon(null);
         setSpecies(null);
      } finally {
         setLoading(false);
      }
   };

   useEffect(() => {
      fetchPokemon();
   }, [identifier]);

   return {
      pokemon,
      species,
      loading,
      error,
      refetch: fetchPokemon,
   };
};
