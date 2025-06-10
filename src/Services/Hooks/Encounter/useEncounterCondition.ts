import { useState, useEffect, useCallback, useMemo } from "react";
import { encounterService } from "../../API";
import type {
   UseEncounterConditionState,
   UseEncounterConditionReturn,
} from "./Shared/Types";
import {
   handleError,
   updateEncounterConditionState,
   useMemoizedIdentifier,
} from "./Shared/Types";

export const useEncounterCondition = (
   identifier?: string | number
): UseEncounterConditionReturn => {
   const [state, setState] = useState<UseEncounterConditionState>({
      data: null,
      loading: false,
      error: null,
   });

   // Memoize normalized identifier
   const normalizedIdentifier = useMemoizedIdentifier(identifier);

   // Fetch function
   const fetchEncounterCondition = useCallback(async (id: string | number) => {
      updateEncounterConditionState(setState, { loading: true, error: null });

      try {
         const encounterCondition =
            await encounterService.getEncounterCondition(id);
         updateEncounterConditionState(setState, {
            data: encounterCondition,
            loading: false,
         });
      } catch (error) {
         updateEncounterConditionState(setState, {
            data: null,
            loading: false,
            error: handleError(error),
         });
      }
   }, []);

   // Refetch function
   const refetch = useCallback(() => {
      if (normalizedIdentifier) {
         fetchEncounterCondition(normalizedIdentifier);
      }
   }, [normalizedIdentifier, fetchEncounterCondition]);

   // Effect for initial fetch
   useEffect(() => {
      if (normalizedIdentifier) {
         fetchEncounterCondition(normalizedIdentifier);
      }
   }, [normalizedIdentifier, fetchEncounterCondition]);

   // Memoized return
   return useMemo(() => ({ ...state, refetch }), [state, refetch]);
};
