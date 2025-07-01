import { useState, useEffect, useCallback, useMemo } from "react";
import { gameService } from "../../API";
import type { UsePokedexState, UsePokedexReturn } from "./Shared/Types";
import {
   updatePokedexState,
   handleError,
   useMemoizedIdentifier,
} from "./Shared/Types";

export const usePokedex = (identifier?: string | number): UsePokedexReturn => {
   const [state, setState] = useState<UsePokedexState>({
      data: null,
      loading: false,
      error: null,
   });

   // Memoize normalized identifier
   const normalizedIdentifier = useMemoizedIdentifier(identifier);

   // Fetch function
   const fetchPokedex = useCallback(async (id: string | number) => {
      updatePokedexState(setState, { loading: true, error: null });

      try {
         const pokedex = await gameService.getPokedex(id);
         updatePokedexState(setState, { data: pokedex, loading: false });
      } catch (error) {
         updatePokedexState(setState, {
            data: null,
            loading: false,
            error: handleError(error),
         });
      }
   }, []);

   // Refetch function
   const refetch = useCallback(() => {
      if (normalizedIdentifier) {
         fetchPokedex(normalizedIdentifier);
      }
   }, [normalizedIdentifier, fetchPokedex]);

   // Effect for initial fetch
   useEffect(() => {
      if (normalizedIdentifier) {
         fetchPokedex(normalizedIdentifier);
      }
   }, [normalizedIdentifier, fetchPokedex]);

   // Memoized return
   return useMemo(() => ({ ...state, refetch }), [state, refetch]);
};
