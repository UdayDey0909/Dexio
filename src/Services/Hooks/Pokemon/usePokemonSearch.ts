import { useState, useCallback, useMemo } from "react";
import { pokemonService } from "../../API";
import type {
   UsePokemonSearchState,
   UsePokemonSearchReturn,
} from "./Shared/Types";
import {
   updatePokemonSearchState,
   handleError,
   useMemoizedSearchQuery,
   useAbortController,
} from "./Shared/Types";

export const usePokemonSearch = (): UsePokemonSearchReturn => {
   const [state, setState] = useState<UsePokemonSearchState>({
      data: [],
      loading: false,
      error: null,
   });

   // Abort controller for request cancellation
   const { getController, abort } = useAbortController();

   // Search function
   const search = useCallback(
      async (query: string, limit: number = 20) => {
         // Validate query
         const normalizedQuery = query?.trim();
         if (!normalizedQuery || normalizedQuery.length < 2) {
            updatePokemonSearchState(setState, {
               data: [],
               loading: false,
               error: null,
            });
            return;
         }

         // Cancel previous request
         abort();
         const controller = getController();

         updatePokemonSearchState(setState, { loading: true, error: null });

         try {
            const results = await pokemonService.searchPokemonByPartialName(
               normalizedQuery,
               Math.min(Math.max(1, limit), 100) // Ensure limit is between 1-100
            );

            // Check if request was aborted
            if (!controller.signal.aborted) {
               updatePokemonSearchState(setState, {
                  data: results,
                  loading: false,
               });
            }
         } catch (error) {
            if (!controller.signal.aborted) {
               updatePokemonSearchState(setState, {
                  data: [],
                  loading: false,
                  error: handleError(error),
               });
            }
         }
      },
      [getController, abort]
   );

   // Clear search function
   const clearSearch = useCallback(() => {
      abort(); // Cancel any ongoing search
      updatePokemonSearchState(setState, {
         data: [],
         loading: false,
         error: null,
      });
   }, [abort]);

   // Memoized return to prevent unnecessary re-renders
   return useMemo(
      () => ({
         ...state,
         search,
         clearSearch,
      }),
      [state, search, clearSearch]
   );
};
