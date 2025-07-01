import { useState, useEffect, useCallback, useMemo } from "react";
import { gameService } from "../../API";
import type {
   UseVersionGroupState,
   UseVersionGroupReturn,
} from "./Shared/Types";
import {
   updateVersionGroupState,
   handleError,
   useMemoizedIdentifier,
} from "./Shared/Types";

export const useVersionGroup = (
   identifier?: string | number
): UseVersionGroupReturn => {
   const [state, setState] = useState<UseVersionGroupState>({
      data: null,
      loading: false,
      error: null,
   });

   // Memoize normalized identifier
   const normalizedIdentifier = useMemoizedIdentifier(identifier);

   // Fetch function
   const fetchVersionGroup = useCallback(async (id: string | number) => {
      updateVersionGroupState(setState, { loading: true, error: null });

      try {
         const versionGroup = await gameService.getVersionGroup(id);
         updateVersionGroupState(setState, {
            data: versionGroup,
            loading: false,
         });
      } catch (error) {
         updateVersionGroupState(setState, {
            data: null,
            loading: false,
            error: handleError(error),
         });
      }
   }, []);

   // Refetch function
   const refetch = useCallback(() => {
      if (normalizedIdentifier) {
         fetchVersionGroup(normalizedIdentifier);
      }
   }, [normalizedIdentifier, fetchVersionGroup]);

   // Effect for initial fetch
   useEffect(() => {
      if (normalizedIdentifier) {
         fetchVersionGroup(normalizedIdentifier);
      }
   }, [normalizedIdentifier, fetchVersionGroup]);

   // Memoized return
   return useMemo(() => ({ ...state, refetch }), [state, refetch]);
};
