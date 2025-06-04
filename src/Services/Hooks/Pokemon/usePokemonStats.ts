import { useState, useEffect, useCallback, useMemo } from "react";
import { pokemonService } from "../../API";
import type {
   UsePokemonStatsState,
   UsePokemonStatsReturn,
} from "./Shared/Types";
import {
   updatePokemonStatsState,
   handleError,
   useMemoizedIdentifier,
   useAbortController,
} from "./Shared/Types";

export const usePokemonStats = (
   pokemonName?: string
): UsePokemonStatsReturn => {
   const [state, setState] = useState<UsePokemonStatsState>({
      data: null,
      loading: false,
      error: null,
   });

   // Memoize normalized identifier (only strings for stats)
   const normalizedName = useMemoizedIdentifier(pokemonName);

   // Abort controller for request cancellation
   const { getController, abort } = useAbortController();

   // Fetch function
   const fetchPokemonStats = useCallback(
      async (name: string) => {
         // Cancel previous request
         abort();
         const controller = getController();

         updatePokemonStatsState(setState, { loading: true, error: null });

         try {
            const stats = await pokemonService.getPokemonStats(name);

            // Check if request was aborted
            if (!controller.signal.aborted) {
               updatePokemonStatsState(setState, {
                  data: stats,
                  loading: false,
               });
            }
         } catch (error) {
            if (!controller.signal.aborted) {
               updatePokemonStatsState(setState, {
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
      if (normalizedName && typeof normalizedName === "string") {
         fetchPokemonStats(normalizedName);
      }
   }, [normalizedName, fetchPokemonStats]);

   // Effect for initial fetch
   useEffect(() => {
      if (normalizedName && typeof normalizedName === "string") {
         fetchPokemonStats(normalizedName);
      }

      // Cleanup on unmount
      return () => {
         abort();
      };
   }, [normalizedName, fetchPokemonStats, abort]);

   // Memoized return to prevent unnecessary re-renders
   return useMemo(() => ({ ...state, refetch }), [state, refetch]);
};
