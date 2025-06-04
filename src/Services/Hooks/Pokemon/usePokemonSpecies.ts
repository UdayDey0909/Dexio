import { useState, useEffect, useCallback, useMemo } from "react";
import { pokemonService } from "../../API";
import type {
   UsePokemonSpeciesState,
   UsePokemonSpeciesReturn,
} from "./Shared/Types";
import {
   updatePokemonSpeciesState,
   handleError,
   useMemoizedIdentifier,
   useAbortController,
} from "./Shared/Types";

export const usePokemonSpecies = (
   identifier?: string | number
): UsePokemonSpeciesReturn => {
   const [state, setState] = useState<UsePokemonSpeciesState>({
      data: null,
      loading: false,
      error: null,
   });

   // Memoize normalized identifier
   const normalizedIdentifier = useMemoizedIdentifier(identifier);

   // Abort controller for request cancellation
   const { getController, abort } = useAbortController();

   // Fetch function
   const fetchPokemonSpecies = useCallback(
      async (id: string | number) => {
         // Cancel previous request
         abort();
         const controller = getController();

         updatePokemonSpeciesState(setState, { loading: true, error: null });

         try {
            const species = await pokemonService.getPokemonSpecies(id);

            // Check if request was aborted
            if (!controller.signal.aborted) {
               updatePokemonSpeciesState(setState, {
                  data: species,
                  loading: false,
               });
            }
         } catch (error) {
            if (!controller.signal.aborted) {
               updatePokemonSpeciesState(setState, {
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
         fetchPokemonSpecies(normalizedIdentifier);
      }
   }, [normalizedIdentifier, fetchPokemonSpecies]);

   // Effect for initial fetch
   useEffect(() => {
      if (normalizedIdentifier) {
         fetchPokemonSpecies(normalizedIdentifier);
      }

      // Cleanup on unmount
      return () => {
         abort();
      };
   }, [normalizedIdentifier, fetchPokemonSpecies, abort]);

   // Memoized return to prevent unnecessary re-renders
   return useMemo(() => ({ ...state, refetch }), [state, refetch]);
};
