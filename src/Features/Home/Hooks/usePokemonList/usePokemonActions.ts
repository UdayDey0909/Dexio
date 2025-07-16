import { useCallback } from "react";
import { useDebouncedCallback } from "@/Utils/useDebouncedCallback";
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
   // Use the shared debounced callback hook for loadMore
   const loadMore = useDebouncedCallback(() => {
      if (
         !state.hasMore ||
         state.loading ||
         state.refreshing ||
         state.loadingMore
      ) {
         return;
      }
      if (isMountedRef.current) {
         fetchPokemon(false, true);
      }
   }, POKEMON_LIST_CONSTANTS.LOAD_MORE_DEBOUNCE_MS);

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

   // No cleanup needed for debounced callback
   const cleanup = useCallback(() => {}, []);

   return {
      loadMore,
      onRefresh,
      refetch,
      cleanup,
   };
};
