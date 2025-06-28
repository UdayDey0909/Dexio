import { useState, useEffect, useCallback, useMemo } from "react";
import { evolutionService } from "../../API";
import {
   UseEvolutionChainDetailsState,
   UseEvolutionChainDetailsReturn,
   EvolutionChainDetails,
   updateEvolutionChainDetailsState,
   handleError,
   useMemoizedStringIdentifier,
} from "./Shared/Types";

export const useEvolutionChainDetails = (
   pokemonName?: string
): UseEvolutionChainDetailsReturn => {
   const [state, setState] = useState<UseEvolutionChainDetailsState>({
      data: null,
      loading: false,
      error: null,
   });

   // Memoize normalized identifier (string only for Pokemon names)
   const normalizedName = useMemoizedStringIdentifier(pokemonName);

   // Helper function to calculate evolution details
   const enhanceEvolutionChain = useCallback(
      (chain: any): EvolutionChainDetails => {
         const countEvolutions = (
            evolutionChain: any
         ): { total: number; maxStage: number } => {
            let total = 1; // Count the base Pokemon
            let maxStage = 1;

            const traverse = (current: any, stage: number) => {
               if (current.evolves_to && current.evolves_to.length > 0) {
                  current.evolves_to.forEach((evolution: any) => {
                     total++;
                     maxStage = Math.max(maxStage, stage + 1);
                     traverse(evolution, stage + 1);
                  });
               }
            };

            traverse(evolutionChain, 1);
            return { total, maxStage };
         };

         const { total, maxStage } = countEvolutions(chain.chain);

         return {
            ...chain,
            totalEvolutions: total,
            maxEvolutionStage: maxStage,
         };
      },
      []
   );

   // Fetch function
   const fetchEvolutionChainDetails = useCallback(
      async (name: string) => {
         updateEvolutionChainDetailsState(setState, {
            loading: true,
            error: null,
         });

         try {
            const evolutionChain = await evolutionService.getFullEvolutionChain(
               name
            );
            const enhancedChain = enhanceEvolutionChain(evolutionChain);
            updateEvolutionChainDetailsState(setState, {
               data: enhancedChain,
               loading: false,
            });
         } catch (error) {
            updateEvolutionChainDetailsState(setState, {
               data: null,
               loading: false,
               error: handleError(error),
            });
         }
      },
      [enhanceEvolutionChain]
   );

   // Refetch function
   const refetch = useCallback(() => {
      if (normalizedName) {
         fetchEvolutionChainDetails(normalizedName);
      }
   }, [normalizedName, fetchEvolutionChainDetails]);

   // Effect for initial fetch
   useEffect(() => {
      if (normalizedName) {
         fetchEvolutionChainDetails(normalizedName);
      }
   }, [normalizedName, fetchEvolutionChainDetails]);

   // Memoized return
   return useMemo(() => ({ ...state, refetch }), [state, refetch]);
};
