import { useState, useEffect, useCallback, useRef } from "react";
import { PokemonService } from "../../API/Pokemon";
import type { Pokemon, PokemonSpecies } from "pokenode-ts";

interface UsePokemonState {
   data: Pokemon | null;
   loading: boolean;
   error: string | null;
}

interface UsePokemonListState {
   data: Pokemon[];
   loading: boolean;
   error: string | null;
}

interface UsePokemonSpeciesState {
   data: PokemonSpecies | null;
   loading: boolean;
   error: string | null;
}

interface UsePokemonStatsState {
   data: any | null;
   loading: boolean;
   error: string | null;
}

// Singleton service instance
const pokemonService = new PokemonService();

export const usePokemon = (identifier?: string | number) => {
   const [state, setState] = useState<UsePokemonState>({
      data: null,
      loading: false,
      error: null,
   });

   const abortControllerRef = useRef<AbortController | null>(null);

   const fetchPokemon = useCallback(async (id: string | number) => {
      // Cancel previous request
      if (abortControllerRef.current) {
         abortControllerRef.current.abort();
      }

      abortControllerRef.current = new AbortController();

      setState((prev) => ({ ...prev, loading: true, error: null }));

      try {
         const pokemon = await pokemonService.getPokemon(id);
         setState({ data: pokemon, loading: false, error: null });
      } catch (error) {
         if (error instanceof Error && error.name !== "AbortError") {
            setState((prev) => ({
               ...prev,
               loading: false,
               error: error.message,
            }));
         }
      }
   }, []);

   const refetch = useCallback(() => {
      if (identifier) {
         fetchPokemon(identifier);
      }
   }, [identifier, fetchPokemon]);

   useEffect(() => {
      if (identifier) {
         fetchPokemon(identifier);
      }

      return () => {
         if (abortControllerRef.current) {
            abortControllerRef.current.abort();
         }
      };
   }, [identifier, fetchPokemon]);

   return {
      ...state,
      refetch,
   };
};

export const usePokemonList = (offset = 0, limit = 20) => {
   const [state, setState] = useState<UsePokemonListState>({
      data: [],
      loading: false,
      error: null,
   });

   const fetchList = useCallback(async () => {
      setState((prev) => ({ ...prev, loading: true, error: null }));

      try {
         const response = await pokemonService.getPokemonList(offset, limit);
         const pokemonList = await pokemonService.batchGetPokemon(
            response.results.slice(0, 6).map((p) => p.name) // Limit to 6 for performance
         );
         setState({ data: pokemonList, loading: false, error: null });
      } catch (error) {
         setState((prev) => ({
            ...prev,
            loading: false,
            error: error instanceof Error ? error.message : "Unknown error",
         }));
      }
   }, [offset, limit]);

   const refetch = useCallback(() => {
      fetchList();
   }, [fetchList]);

   useEffect(() => {
      fetchList();
   }, [fetchList]);

   return {
      ...state,
      refetch,
   };
};

export const usePokemonSpecies = (identifier?: string | number) => {
   const [state, setState] = useState<UsePokemonSpeciesState>({
      data: null,
      loading: false,
      error: null,
   });

   const fetchSpecies = useCallback(async (id: string | number) => {
      setState((prev) => ({ ...prev, loading: true, error: null }));

      try {
         const species = await pokemonService.getPokemonSpecies(id);
         setState({ data: species, loading: false, error: null });
      } catch (error) {
         setState((prev) => ({
            ...prev,
            loading: false,
            error: error instanceof Error ? error.message : "Unknown error",
         }));
      }
   }, []);

   const refetch = useCallback(() => {
      if (identifier) {
         fetchSpecies(identifier);
      }
   }, [identifier, fetchSpecies]);

   useEffect(() => {
      if (identifier) {
         fetchSpecies(identifier);
      }
   }, [identifier, fetchSpecies]);

   return {
      ...state,
      refetch,
   };
};

export const usePokemonStats = (pokemonName?: string) => {
   const [state, setState] = useState<UsePokemonStatsState>({
      data: null,
      loading: false,
      error: null,
   });

   const fetchStats = useCallback(async (name: string) => {
      setState((prev) => ({ ...prev, loading: true, error: null }));

      try {
         const stats = await pokemonService.getPokemonStats(name);
         setState({ data: stats, loading: false, error: null });
      } catch (error) {
         setState((prev) => ({
            ...prev,
            loading: false,
            error: error instanceof Error ? error.message : "Unknown error",
         }));
      }
   }, []);

   const refetch = useCallback(() => {
      if (pokemonName) {
         fetchStats(pokemonName);
      }
   }, [pokemonName, fetchStats]);

   useEffect(() => {
      if (pokemonName) {
         fetchStats(pokemonName);
      }
   }, [pokemonName, fetchStats]);

   return {
      ...state,
      refetch,
   };
};

export const useRandomPokemon = () => {
   const [state, setState] = useState<UsePokemonState>({
      data: null,
      loading: false,
      error: null,
   });

   const fetchRandom = useCallback(async () => {
      setState((prev) => ({ ...prev, loading: true, error: null }));

      try {
         const pokemon = await pokemonService.getRandomPokemon();
         setState({ data: pokemon, loading: false, error: null });
      } catch (error) {
         setState((prev) => ({
            ...prev,
            loading: false,
            error: error instanceof Error ? error.message : "Unknown error",
         }));
      }
   }, []);

   useEffect(() => {
      fetchRandom();
   }, []);

   return {
      ...state,
      refetch: fetchRandom,
   };
};

export const usePokemonSearch = () => {
   const [state, setState] = useState<{
      data: any[];
      loading: boolean;
      error: string | null;
   }>({
      data: [],
      loading: false,
      error: null,
   });

   const search = useCallback(async (query: string, limit = 20) => {
      if (!query || query.trim().length < 2) {
         setState({ data: [], loading: false, error: null });
         return;
      }

      setState((prev) => ({ ...prev, loading: true, error: null }));

      try {
         const results = await pokemonService.searchPokemonByPartialName(
            query,
            limit
         );
         setState({ data: results, loading: false, error: null });
      } catch (error) {
         setState((prev) => ({
            ...prev,
            loading: false,
            error: error instanceof Error ? error.message : "Unknown error",
         }));
      }
   }, []);

   const clearSearch = useCallback(() => {
      setState({ data: [], loading: false, error: null });
   }, []);

   return {
      ...state,
      search,
      clearSearch,
   };
};
