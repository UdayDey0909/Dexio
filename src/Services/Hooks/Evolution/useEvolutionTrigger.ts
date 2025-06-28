import { useState, useEffect, useCallback, useMemo } from "react";
import { evolutionService } from "../../API";
import {
   UseEvolutionTriggerState,
   UseEvolutionTriggerReturn,
   updateEvolutionTriggerState,
   handleError,
   useMemoizedIdentifier,
} from "./Shared/Types";

export const useEvolutionTrigger = (
   identifier?: string | number
): UseEvolutionTriggerReturn => {
   const [state, setState] = useState<UseEvolutionTriggerState>({
      data: null,
      loading: false,
      error: null,
   });

   // Memoize normalized identifier
   const normalizedIdentifier = useMemoizedIdentifier(identifier);

   // Fetch function
   const fetchEvolutionTrigger = useCallback(async (id: string | number) => {
      updateEvolutionTriggerState(setState, { loading: true, error: null });

      try {
         const evolutionTrigger = await evolutionService.getEvolutionTrigger(
            id
         );
         updateEvolutionTriggerState(setState, {
            data: evolutionTrigger,
            loading: false,
         });
      } catch (error) {
         updateEvolutionTriggerState(setState, {
            data: null,
            loading: false,
            error: handleError(error),
         });
      }
   }, []);

   // Refetch function
   const refetch = useCallback(() => {
      if (normalizedIdentifier) {
         fetchEvolutionTrigger(normalizedIdentifier);
      }
   }, [normalizedIdentifier, fetchEvolutionTrigger]);

   // Effect for initial fetch
   useEffect(() => {
      if (normalizedIdentifier) {
         fetchEvolutionTrigger(normalizedIdentifier);
      }
   }, [normalizedIdentifier, fetchEvolutionTrigger]);

   // Memoized return
   return useMemo(() => ({ ...state, refetch }), [state, refetch]);
};
