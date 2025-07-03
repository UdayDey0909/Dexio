// src/Services/Hooks/Move/useMoveLearnedBy.ts
import { useState, useEffect, useCallback, useMemo } from "react";
import { moveService } from "../../API";
import type {
   UseMoveLearnedByState,
   UseMoveLearnedByReturn,
} from "./Shared/Types";
import {
   handleError,
   updateMoveLearnedByState,
   useMemoizedIdentifier,
   createInitialMoveLearnedByState,
} from "./Shared/Types";

export const useMoveLearnedBy = (moveName?: string): UseMoveLearnedByReturn => {
   const [state, setState] = useState<UseMoveLearnedByState>(
      createInitialMoveLearnedByState()
   );

   // Memoize normalized identifier
   const normalizedMoveName = useMemoizedIdentifier(moveName);

   // Fetch function
   const fetchPokemonThatLearnMove = useCallback(async (name: string) => {
      updateMoveLearnedByState(setState, { loading: true, error: null });

      try {
         const pokemon = await moveService.getPokemonThatLearnMove(name);
         updateMoveLearnedByState(setState, { data: pokemon, loading: false });
      } catch (error) {
         updateMoveLearnedByState(setState, {
            data: [],
            loading: false,
            error: handleError(error),
         });
      }
   }, []);

   // Refetch function
   const refetch = useCallback(() => {
      if (normalizedMoveName && typeof normalizedMoveName === "string") {
         fetchPokemonThatLearnMove(normalizedMoveName);
      }
   }, [normalizedMoveName, fetchPokemonThatLearnMove]);

   // Effect for initial fetch
   useEffect(() => {
      if (normalizedMoveName && typeof normalizedMoveName === "string") {
         fetchPokemonThatLearnMove(normalizedMoveName);
      }
   }, [normalizedMoveName, fetchPokemonThatLearnMove]);

   // Memoized return
   return useMemo(() => ({ ...state, refetch }), [state, refetch]);
};
