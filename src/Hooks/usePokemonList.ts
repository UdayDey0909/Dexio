// ==========================================
// hooks/usePokemonList.ts - List Hook
// ==========================================

import { useState, useEffect } from "react";
import { pokemonService } from "../Services/PokemonService";
import type { NamedAPIResourceList } from "pokenode-ts";

interface UsePokemonListResult {
   pokemonList: NamedAPIResourceList | null;
   loading: boolean;
   error: string | null;
   loadMore: () => void;
   refresh: () => void;
}

export const usePokemonList = (
   initialLimit: number = 20
): UsePokemonListResult => {
   const [pokemonList, setPokemonList] = useState<NamedAPIResourceList | null>(
      null
   );
   const [loading, setLoading] = useState(false);
   const [error, setError] = useState<string | null>(null);
   const [offset, setOffset] = useState(0);
   const [limit] = useState(initialLimit);

   const fetchPokemonList = async (
      currentOffset: number,
      append: boolean = false
   ) => {
      setLoading(true);
      setError(null);

      try {
         const data = await pokemonService.getPokemonList(currentOffset, limit);

         if (append && pokemonList) {
            setPokemonList({
               ...data,
               results: [...pokemonList.results, ...data.results],
            });
         } else {
            setPokemonList(data);
         }
      } catch (err) {
         setError(err instanceof Error ? err.message : "An error occurred");
      } finally {
         setLoading(false);
      }
   };

   const loadMore = () => {
      const newOffset = offset + limit;
      setOffset(newOffset);
      fetchPokemonList(newOffset, true);
   };

   const refresh = () => {
      setOffset(0);
      fetchPokemonList(0, false);
   };

   useEffect(() => {
      fetchPokemonList(0);
   }, []);

   return {
      pokemonList,
      loading,
      error,
      loadMore,
      refresh,
   };
};
