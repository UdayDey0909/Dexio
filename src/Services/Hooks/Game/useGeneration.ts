import { useState, useEffect, useCallback, useMemo } from "react";
import { gameService } from "../../API";
import type {
   UseGenerationState,
   UseGenerationReturn,
   updateGenerationState,
   handleError,
   useMemoizedIdentifier,
} from "./Shared/Types";
import {
   updateGenerationState as updateState,
   handleError as handleErr,
   useMemoizedIdentifier as useMemoId,
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
   const normalizedIdentifier = useMemoId(identifier);

   // Fetch function
   const fetchGeneration = useCallback(async (id: string | number) => {
      updateState(setState, { loading: true, error: null });

      try {
         const generation = await gameService.getGeneration(id);
         updateState(setState, { data: generation, loading: false });
      } catch (error) {
         updateState(setState, {
            data: null,
            loading: false,
            error: handleErr(error),
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
