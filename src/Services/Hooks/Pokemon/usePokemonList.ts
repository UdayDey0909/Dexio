import { useState, useEffect, useCallback, useMemo } from "react";
import { pokemonService } from "../../API";
import type { UsePokemonListState, UsePokemonListReturn } from "./Shared/Types";
import {
   updatePokemonListState,
   handleError,
   useMemoizedPagination,
   useAbortController,
} from "./Shared/Types";

export const usePokemonList = (
   offset: number = 0,
   limit: number = 20
): UsePokemonListReturn => {
   const [state, setState] = useState<UsePokemonListState>({
      data: [],
      loading: false,
      error: null,
   });

   // Memoize pagination params with validation
   const paginationParams = useMemoizedPagination(offset, limit);

   // Abort controller for request cancellation
   const { getController, abort } = useAbortController();

   // Fetch function
   const fetchPokemonList = useCallback(async () => {
      // Cancel previous request
      abort();
      const controller = getController();

      updatePokemonListState(setState, { loading: true, error: null });

      try {
         // Get the list of Pokemon references
         const pokemonListResponse = await pokemonService.getPokemonList(
            paginationParams.offset,
            paginationParams.limit
         );

         // Check if request was aborted
         if (controller.signal.aborted) return;

         // Limit batch size for performance (max 6 for mobile)
         const pokemonNames = pokemonListResponse.results
            .slice(0, Math.min(6, pokemonListResponse.results.length))
            .map((pokemon: { name: string }) => pokemon.name);

         // Batch fetch actual Pokemon data
         const pokemonList = await pokemonService.batchGetPokemon(pokemonNames);

         // Final abort check
         if (!controller.signal.aborted) {
            updatePokemonListState(setState, {
               data: pokemonList,
               loading: false,
            });
         }
      } catch (error) {
         if (!controller.signal.aborted) {
            updatePokemonListState(setState, {
               data: [],
               loading: false,
               error: handleError(error),
            });
         }
      }
   }, [paginationParams.offset, paginationParams.limit, getController, abort]);

   // Refetch function
   const refetch = useCallback(() => {
      fetchPokemonList();
   }, [fetchPokemonList]);

   // Effect for initial fetch
   useEffect(() => {
      fetchPokemonList();

      // Cleanup on unmount
      return () => {
         abort();
      };
   }, [fetchPokemonList, abort]);

   // Memoized return to prevent unnecessary re-renders
   return useMemo(() => ({ ...state, refetch }), [state, refetch]);
};
