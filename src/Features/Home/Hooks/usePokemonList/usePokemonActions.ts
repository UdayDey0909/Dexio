import { useCallback, useRef } from "react";
import { PokemonListState } from "./Types";
import { POKEMON_LIST_CONSTANTS } from "./Constants";

interface UsePokemonActionsParams {
   state: PokemonListState;
   fetchPokemon: (isRefresh?: boolean, isLoadMore?: boolean) => Promise<void>;
   dispatch: React.Dispatch<any>;
   isMountedRef: React.MutableRefObject<boolean>;
}

export const usePokemonActions = ({
   state,
   fetchPokemon,
   dispatch,
   isMountedRef,
}: UsePokemonActionsParams) => {
   const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

   // Debounced load more with proper cleanup
   const loadMore = useCallback(() => {
      if (
         !state.hasMore ||
         state.loading ||
         state.refreshing ||
         state.loadingMore
      ) {
         return;
      }

      // Clear existing timeout
      if (timeoutRef.current) {
         clearTimeout(timeoutRef.current);
      }

      // Set new timeout
      timeoutRef.current = setTimeout(() => {
         if (isMountedRef.current) {
            fetchPokemon(false, true);
         }
      }, POKEMON_LIST_CONSTANTS.LOAD_MORE_DEBOUNCE_MS);
   }, [
      state.hasMore,
      state.loading,
      state.refreshing,
      state.loadingMore,
      fetchPokemon,
      isMountedRef,
   ]);

   // Refresh function
   const onRefresh = useCallback(() => {
      dispatch({ type: "RESET" });
      fetchPokemon(true, false);
   }, [fetchPokemon, dispatch]);

   // Refetch function
   const refetch = useCallback(() => {
      dispatch({ type: "RESET" });
      fetchPokemon(false, false);
   }, [fetchPokemon, dispatch]);

   const cleanup = useCallback(() => {
      // Clear any pending timeouts
      if (timeoutRef.current) {
         clearTimeout(timeoutRef.current);
      }
   }, []);

   return {
      loadMore,
      onRefresh,
      refetch,
      cleanup,
   };
};
