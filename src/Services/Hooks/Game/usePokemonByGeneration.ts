import { useState, useEffect, useCallback, useMemo } from "react";
import { gameService } from "../../API";
import type {
   UsePokemonByGenerationState,
   UsePokemonByGenerationReturn,
} from "./Shared/Types";
import { updatePokemonByGenerationState, handleError } from "./Shared/Types";

export const usePokemonByGeneration = (
   generationName?: string
): UsePokemonByGenerationReturn => {
   const [state, setState] = useState<UsePokemonByGenerationState>({
      data: null,
      loading: false,
      error: null,
   });

   // Memoize normalized generation name
   const normalizedGenerationName = useMemo(() => {
      if (!generationName || typeof generationName !== "string") return null;
      return generationName.toLowerCase().trim();
   }, [generationName]);

   // Fetch function
   const fetchPokemonByGeneration = useCallback(async (genName: string) => {
      updatePokemonByGenerationState(setState, { loading: true, error: null });

      try {
         const pokemonSpecies = await gameService.getPokemonByGeneration(
            genName
         );
         // Fixed: pokemonSpecies is already NamedAPIResource[] from the API
         updatePokemonByGenerationState(setState, {
            data: pokemonSpecies,
            loading: false,
         });
      } catch (error) {
         updatePokemonByGenerationState(setState, {
            data: null,
            loading: false,
            error: handleError(error),
         });
      }
   }, []);

   // Refetch function
   const refetch = useCallback(() => {
      if (normalizedGenerationName) {
         fetchPokemonByGeneration(normalizedGenerationName);
      }
   }, [normalizedGenerationName, fetchPokemonByGeneration]);

   // Effect for initial fetch
   useEffect(() => {
      if (normalizedGenerationName) {
         fetchPokemonByGeneration(normalizedGenerationName);
      }
   }, [normalizedGenerationName, fetchPokemonByGeneration]);

   // Memoized return
   return useMemo(() => ({ ...state, refetch }), [state, refetch]);
};
