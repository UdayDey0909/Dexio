import { useState, useEffect, useCallback, useMemo } from "react";
import { gameService } from "../../API";
import type {
   UsePokedexEntriesState,
   UsePokedexEntriesReturn,
} from "./Shared/Types";
import { updatePokedexEntriesState, handleError } from "./Shared/Types";

export const usePokedexEntries = (
   pokedexName?: string
): UsePokedexEntriesReturn => {
   const [state, setState] = useState<UsePokedexEntriesState>({
      data: null,
      loading: false,
      error: null,
   });

   // Memoize normalized pokedex name
   const normalizedPokedexName = useMemo(() => {
      if (!pokedexName || typeof pokedexName !== "string") return null;
      return pokedexName.toLowerCase().trim();
   }, [pokedexName]);

   // Fetch function
   const fetchPokedexEntries = useCallback(async (pdxName: string) => {
      updatePokedexEntriesState(setState, { loading: true, error: null });

      try {
         const entries = await gameService.getPokedexEntries(pdxName);
         updatePokedexEntriesState(setState, {
            data: entries,
            loading: false,
         });
      } catch (error) {
         updatePokedexEntriesState(setState, {
            data: null,
            loading: false,
            error: handleError(error),
         });
      }
   }, []);

   // Refetch function
   const refetch = useCallback(() => {
      if (normalizedPokedexName) {
         fetchPokedexEntries(normalizedPokedexName);
      }
   }, [normalizedPokedexName, fetchPokedexEntries]);

   // Effect for initial fetch
   useEffect(() => {
      if (normalizedPokedexName) {
         fetchPokedexEntries(normalizedPokedexName);
      }
   }, [normalizedPokedexName, fetchPokedexEntries]);

   // Memoized return
   return useMemo(() => ({ ...state, refetch }), [state, refetch]);
};
