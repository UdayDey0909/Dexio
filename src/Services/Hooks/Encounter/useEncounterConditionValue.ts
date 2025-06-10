import { useState, useEffect, useCallback, useMemo } from "react";
import { encounterService } from "../../API";
import type {
   UseEncounterConditionValueState,
   UseEncounterConditionValueReturn,
} from "./Shared/Types";
import {
   handleError,
   updateEncounterConditionValueState,
   useMemoizedIdentifier,
} from "./Shared/Types";

export const useEncounterConditionValue = (
   identifier?: string | number
): UseEncounterConditionValueReturn => {
   const [state, setState] = useState<UseEncounterConditionValueState>({
      data: null,
      loading: false,
      error: null,
   });

   // Memoize normalized identifier
   const normalizedIdentifier = useMemoizedIdentifier(identifier);

   // Fetch function
   const fetchEncounterConditionValue = useCallback(
      async (id: string | number) => {
         updateEncounterConditionValueState(setState, {
            loading: true,
            error: null,
         });

         try {
            const encounterConditionValue =
               await encounterService.getEncounterConditionValue(id);
            updateEncounterConditionValueState(setState, {
               data: encounterConditionValue,
               loading: false,
            });
         } catch (error) {
            updateEncounterConditionValueState(setState, {
               data: null,
               loading: false,
               error: handleError(error),
            });
         }
      },
      []
   );

   // Refetch function
   const refetch = useCallback(() => {
      if (normalizedIdentifier) {
         fetchEncounterConditionValue(normalizedIdentifier);
      }
   }, [normalizedIdentifier, fetchEncounterConditionValue]);

   // Effect for initial fetch
   useEffect(() => {
      if (normalizedIdentifier) {
         fetchEncounterConditionValue(normalizedIdentifier);
      }
   }, [normalizedIdentifier, fetchEncounterConditionValue]);

   // Memoized return
   return useMemo(() => ({ ...state, refetch }), [state, refetch]);
};
