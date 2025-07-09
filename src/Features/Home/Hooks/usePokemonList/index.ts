import { useEffect, useReducer, useMemo } from "react";
import { usePokemonActions } from "./usePokemonActions";
import { POKEMON_LIST_CONSTANTS } from "./Constants";
import { usePokemonFetch } from "./usePokemonFetch";
import { UsePokemonListReturn } from "./Types";
import { pokemonListReducer } from "./Reducer";

export const usePokemonList = (
   limit: number = POKEMON_LIST_CONSTANTS.DEFAULT_LIMIT,
   initialOffset: number = 0
): UsePokemonListReturn => {
   /**
    * Reducer to manage the state of the Pokémon list.
    * It handles actions like fetching data, loading more, refreshing, and error handling.
    * The state includes:
    * - pokemonData: An array of fetched Pokémon data.
    * - loading: A boolean indicating whether data is being loaded.
    * - error: An error message, if any.
    * - refreshing: A boolean indicating whether the list is being refreshed.
    * - hasMore: A boolean indicating whether there are more data to load.
    * - offset: The current offset for loading more data.
    * - loadingMore: A boolean indicating whether more data is being loaded.
    */
   const [state, dispatch] = useReducer(pokemonListReducer, {
      pokemonData: [],
      loading: false,
      error: null,
      refreshing: false,
      hasMore: true,
      offset: initialOffset,
      loadingMore: false,
   });
   const batchSize = Math.min(limit, POKEMON_LIST_CONSTANTS.MAX_BATCH_SIZE);

   const {
      fetchPokemon,
      cleanup: cleanupFetch,
      isMountedRef,
   } = usePokemonFetch({
      state,
      dispatch,
      batchSize,
   });

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
