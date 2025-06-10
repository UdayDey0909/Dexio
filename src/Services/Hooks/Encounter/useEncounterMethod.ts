import { useState, useEffect, useCallback, useMemo } from "react";
import { encounterService } from "../../API";
import type {
   UseEncounterMethodState,
   UseEncounterMethodReturn,
} from "./Shared/Types";
import {
   handleError,
   updateEncounterMethodState,
   useMemoizedIdentifier,
} from "./Shared/Types";

export const useEncounterMethod = (
   identifier?: string | number
): UseEncounterMethodReturn => {
   const [state, setState] = useState<UseEncounterMethodState>({
      data: null,
      loading: false,
      error: null,
   });

   // Memoize normalized identifier
   const normalizedIdentifier = useMemoizedIdentifier(identifier);

   // Fetch function
   const fetchEncounterMethod = useCallback(async (id: string | number) => {
      updateEncounterMethodState(setState, { loading: true, error: null });

      try {
         const encounterMethod = await encounterService.getEncounterMethod(id);
         updateEncounterMethodState(setState, {
            data: encounterMethod,
            loading: false,
         });
      } catch (error) {
         updateEncounterMethodState(setState, {
            data: null,
            loading: false,
            error: handleError(error),
         });
      }
   }, []);

   // Refetch function
   const refetch = useCallback(() => {
      if (normalizedIdentifier) {
         fetchEncounterMethod(normalizedIdentifier);
      }
   }, [normalizedIdentifier, fetchEncounterMethod]);

   // Effect for initial fetch
   useEffect(() => {
      if (normalizedIdentifier) {
         fetchEncounterMethod(normalizedIdentifier);
      }
   }, [normalizedIdentifier, fetchEncounterMethod]);

   // Memoized return
   return useMemo(() => ({ ...state, refetch }), [state, refetch]);
};
