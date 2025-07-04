import { useState, useEffect, useCallback, useMemo } from "react";
import { gameService } from "../../API";
import type { UseGenerationState, UseGenerationReturn } from "./Shared/Types";
import {
   updateGenerationState,
   handleError,
   useMemoizedIdentifier,
} from "./Shared/Types";

export const useGeneration = (
   identifier?: string | number
): UseGenerationReturn => {
   const [state, setState] = useState<UseGenerationState>({
      data: null,
      loading: false,
      error: null,
   });

   // Memoize normalized identifier
   const normalizedIdentifier = useMemoizedIdentifier(identifier);

   // Fetch function
   const fetchGeneration = useCallback(async (id: string | number) => {
      updateGenerationState(setState, { loading: true, error: null });

      try {
         const generation = await gameService.getGeneration(id);
         updateGenerationState(setState, { data: generation, loading: false });
      } catch (error) {
         updateGenerationState(setState, {
            data: null,
            loading: false,
            error: handleError(error),
         });
      }
   }, []);

   // Refetch function
   const refetch = useCallback(() => {
      if (normalizedIdentifier) {
         fetchGeneration(normalizedIdentifier);
      }
   }, [normalizedIdentifier, fetchGeneration]);

   // Effect for initial fetch
   useEffect(() => {
      if (normalizedIdentifier) {
         fetchGeneration(normalizedIdentifier);
      }
   }, [normalizedIdentifier, fetchGeneration]);

   // Memoized return
   return useMemo(() => ({ ...state, refetch }), [state, refetch]);
};
