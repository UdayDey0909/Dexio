import { useState, useEffect, useCallback, useMemo } from "react";
import { gameService } from "../../API";
import type {
   UsePokedexDetailsState,
   UsePokedexDetailsReturn,
} from "./Shared/Types";
import { updatePokedexDetailsState, handleError } from "./Shared/Types";

export const usePokedexDetails = (name?: string): UsePokedexDetailsReturn => {
   const [state, setState] = useState<UsePokedexDetailsState>({
      data: null,
      loading: false,
      error: null,
   });

   // Memoize normalized name (only accept strings for details)
   const normalizedName = useMemo(() => {
      if (!name || typeof name !== "string") return null;
      return name.toLowerCase().trim();
   }, [name]);

   // Fetch function
   const fetchPokedexDetails = useCallback(async (pokedexName: string) => {
      updatePokedexDetailsState(setState, { loading: true, error: null });

      try {
         const pokedexDetails = await gameService.getPokedexDetails(
            pokedexName
         );
         updatePokedexDetailsState(setState, {
            data: pokedexDetails,
            loading: false,
         });
      } catch (error) {
         updatePokedexDetailsState(setState, {
            data: null,
            loading: false,
            error: handleError(error),
         });
      }
   }, []);

   // Refetch function
   const refetch = useCallback(() => {
      if (normalizedName) {
         fetchPokedexDetails(normalizedName);
      }
   }, [normalizedName, fetchPokedexDetails]);

   // Effect for initial fetch
   useEffect(() => {
      if (normalizedName) {
         fetchPokedexDetails(normalizedName);
      }
   }, [normalizedName, fetchPokedexDetails]);

   // Memoized return
   return useMemo(() => ({ ...state, refetch }), [state, refetch]);
};
