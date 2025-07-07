import { useEffect, useReducer, useMemo } from "react";
import { pokemonListReducer } from "./Reducer";
import { UsePokemonListReturn } from "./Types";
import { POKEMON_LIST_CONSTANTS } from "./Constants";
import { usePokemonFetch } from "./usePokemonFetch";
import { usePokemonActions } from "./usePokemonActions";

export const usePokemonList = (
   limit: number = POKEMON_LIST_CONSTANTS.DEFAULT_LIMIT,
   initialOffset: number = 0
): UsePokemonListReturn => {
   // Use useReducer for complex state management
   const [state, dispatch] = useReducer(pokemonListReducer, {
      pokemonData: [],
      loading: false,
      error: null,
      refreshing: false,
      hasMore: true,
      offset: initialOffset,
      loadingMore: false,
   });

   // Calculate batch size
   const batchSize = Math.min(limit, POKEMON_LIST_CONSTANTS.MAX_BATCH_SIZE);

   // Pokemon fetch logic
   const {
      fetchPokemon,
      cleanup: cleanupFetch,
      isMountedRef,
   } = usePokemonFetch({
      state,
      dispatch,
      batchSize,
   });

   // Pokemon actions (loadMore, refresh, etc.)
   const {
      loadMore,
      onRefresh,
      refetch,
      cleanup: cleanupActions,
   } = usePokemonActions({
      state,
      fetchPokemon,
      dispatch,
      isMountedRef,
   });

   // Initial fetch effect
   useEffect(() => {
      if (state.pokemonData.length === 0 && !state.loading && !state.error) {
         fetchPokemon();
      }
   }, []);

   // Cleanup effect
   useEffect(() => {
      return () => {
         cleanupFetch();
         cleanupActions();
      };
   }, [cleanupFetch, cleanupActions]);

   // Memoized return to prevent unnecessary re-renders
   return useMemo(
      () => ({
         ...state,
         refetch,
         onRefresh,
         loadMore,
      }),
      [state, refetch, onRefresh, loadMore]
   );
};

// Export types for external use
export type { UsePokemonListReturn, PokemonListState } from "./Types";
