import { useState, useEffect, useCallback, useMemo } from "react";
import { typeService } from "../../API";
import {
   UsePokemonByTypeState,
   UsePokemonByTypeReturn,
   handleError,
   updatePokemonByTypeState,
   useMemoizedIdentifier,
} from "./Shared/Types";

export const usePokemonByType = (typeName?: string): UsePokemonByTypeReturn => {
   const [state, setState] = useState<UsePokemonByTypeState>({
      data: [],
      loading: false,
      error: null,
   });

   // Memoize normalized identifier
   const normalizedName = useMemoizedIdentifier(typeName);

   // Fetch function
   const fetchPokemonByType = useCallback(async (name: string) => {
      updatePokemonByTypeState(setState, { loading: true, error: null });

      try {
         const pokemon = await typeService.getPokemonByType(name);
         updatePokemonByTypeState(setState, { data: pokemon, loading: false });
      } catch (error) {
         updatePokemonByTypeState(setState, {
            data: [],
            loading: false,
            error: handleError(error),
         });
      }
   }, []);

   // Refetch function
   const refetch = useCallback(() => {
      if (normalizedName && typeof normalizedName === "string") {
         fetchPokemonByType(normalizedName);
      }
   }, [normalizedName, fetchPokemonByType]);

   // Effect for initial fetch
   useEffect(() => {
      if (normalizedName && typeof normalizedName === "string") {
         fetchPokemonByType(normalizedName);
      }
   }, [normalizedName, fetchPokemonByType]);

   // Memoized return
   return useMemo(() => ({ ...state, refetch }), [state, refetch]);
};
