import { useState, useEffect, useCallback, useMemo } from "react";
import { pokemonService } from "../../API";
import type { UsePokemonState, UseRandomPokemonReturn } from "./Shared/Types";
import {
   updatePokemonState,
   handleError,
   useAbortController,
} from "./Shared/Types";

export const useRandomPokemon = (): UseRandomPokemonReturn => {
   const [state, setState] = useState<UsePokemonState>({
      data: null,
      loading: false,
      error: null,
   });

   // Abort controller for request cancellation
   const { getController, abort } = useAbortController();

   // Fetch random Pokemon function
   const fetchRandomPokemon = useCallback(async () => {
      // Cancel previous request
      abort();
      const controller = getController();

      updatePokemonState(setState, { loading: true, error: null });

      try {
         const pokemon = await pokemonService.getRandomPokemon();

         // Check if request was aborted
         if (!controller.signal.aborted) {
            updatePokemonState(setState, { data: pokemon, loading: false });
         }
      } catch (error) {
         if (!controller.signal.aborted) {
            updatePokemonState(setState, {
               data: null,
               loading: false,
               error: handleError(error),
            });
         }
      }
   }, [getController, abort]);

   // Refetch function (same as fetchRandomPokemon)
   const refetch = useCallback(() => {
      fetchRandomPokemon();
   }, [fetchRandomPokemon]);

   // Generate new random Pokemon (alias for fetchRandomPokemon for clarity)
   const generateNew = useCallback(() => {
      fetchRandomPokemon();
   }, [fetchRandomPokemon]);

   // Effect for initial fetch
   useEffect(() => {
      fetchRandomPokemon();

      // Cleanup on unmount
      return () => {
         abort();
      };
   }, [fetchRandomPokemon, abort]);

   // Memoized return to prevent unnecessary re-renders
   return useMemo(
      () => ({
         ...state,
         refetch,
         generateNew,
      }),
      [state, refetch, generateNew]
   );
};
