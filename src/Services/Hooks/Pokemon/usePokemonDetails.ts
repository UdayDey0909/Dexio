import { useState, useEffect, useCallback, useMemo } from "react";
import { pokemonService } from "../../API";
import type {
   UsePokemonDetailsState,
   UsePokemonDetailsReturn,
   PokemonDetails,
} from "./Shared/Types";
import {
   updatePokemonDetailsState,
   handleError,
   useMemoizedIdentifier,
   useAbortController,
} from "./Shared/Types";

export const usePokemonDetails = (
   pokemonName?: string
): UsePokemonDetailsReturn => {
   const [state, setState] = useState<UsePokemonDetailsState>({
      data: null,
      loading: false,
      error: null,
   });

   // Memoize normalized identifier (only string names for details)
   const normalizedName = useMemoizedIdentifier(pokemonName);

   // Abort controller for request cancellation
   const { getController, abort } = useAbortController();

   // Fetch function with enhanced details
   const fetchPokemonDetails = useCallback(
      async (name: string) => {
         // Cancel previous request
         abort();
         const controller = getController();

         updatePokemonDetailsState(setState, { loading: true, error: null });

         try {
            // Get base Pokemon data
            const pokemon = await pokemonService.getPokemon(name);

            // Check if request was aborted
            if (controller.signal.aborted) return;

            // Get additional generation info
            let generationInfo;
            try {
               generationInfo = await pokemonService.getPokemonGenerationInfo(
                  name
               );
            } catch (error) {
               console.warn(
                  `Failed to get generation info for ${name}:`,
                  error
               );
            }

            // Check if request was aborted after second API call
            if (controller.signal.aborted) return;

            // Enhance Pokemon data with formatted information
            const enhancedPokemon: PokemonDetails = {
               ...pokemon,
               formattedStats: pokemon.stats.map((stat) => ({
                  name: stat.stat.name,
                  baseStat: stat.base_stat,
                  effort: stat.effort,
               })),
               totalStats: pokemon.stats.reduce(
                  (sum, stat) => sum + stat.base_stat,
                  0
               ),
               formattedAbilities: pokemon.abilities.map((ability) => ({
                  name: ability.ability.name,
                  isHidden: ability.is_hidden,
                  slot: ability.slot,
               })),
               formattedTypes: pokemon.types.map((type) => ({
                  name: type.type.name,
                  slot: type.slot,
               })),
               generationInfo,
            };

            updatePokemonDetailsState(setState, {
               data: enhancedPokemon,
               loading: false,
            });
         } catch (error) {
            if (!controller.signal.aborted) {
               updatePokemonDetailsState(setState, {
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
         fetchPokemonDetails(normalizedName);
      }
   }, [normalizedName, fetchPokemonDetails]);

   // Effect for initial fetch
   useEffect(() => {
      if (normalizedName && typeof normalizedName === "string") {
         fetchPokemonDetails(normalizedName);
      }

      // Cleanup on unmount
      return () => {
         abort();
      };
   }, [normalizedName, fetchPokemonDetails, abort]);

   // Memoized return to prevent unnecessary re-renders
   return useMemo(() => ({ ...state, refetch }), [state, refetch]);
};
