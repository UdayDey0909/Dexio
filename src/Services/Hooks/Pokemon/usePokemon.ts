import { useState, useEffect, useCallback, useMemo } from "react";
import { pokemonService } from "../../API";
import type { UsePokemonState, UsePokemonReturn } from "./Shared/Types";
import {
   updatePokemonState,
   handleError,
   useMemoizedIdentifier,
   useAbortController,
} from "./Shared/Types";

export const usePokemon = (identifier?: string | number): UsePokemonReturn => {
   const [state, setState] = useState<UsePokemonState>({
      data: null,
      loading: false,
      error: null,
   });

   // Memoize normalized identifier
   const normalizedIdentifier = useMemoizedIdentifier(identifier);

   // Abort controller for request cancellation
   const { getController, abort } = useAbortController();

   // Fetch function
   const fetchPokemon = useCallback(
      async (id: string | number) => {
         // Cancel previous request
         abort();
         const controller = getController();

         updatePokemonState(setState, { loading: true, error: null });

         try {
            const pokemon = await pokemonService.getPokemon(id);

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
      },
      [getController, abort]
   );

   // Refetch function
   const refetch = useCallback(() => {
      if (normalizedIdentifier) {
         fetchPokemon(normalizedIdentifier);
      }
   }, [normalizedIdentifier, fetchPokemon]);

   // Effect for initial fetch
   useEffect(() => {
      if (normalizedIdentifier) {
         fetchPokemon(normalizedIdentifier);
      }

      // Cleanup on unmount
      return () => {
         abort();
      };
   }, [normalizedIdentifier, fetchPokemon, abort]);

   // Memoized return to prevent unnecessary re-renders
   return useMemo(() => ({ ...state, refetch }), [state, refetch]);
};
