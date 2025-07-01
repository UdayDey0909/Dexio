import { useState, useEffect, useCallback, useMemo } from "react";
import { gameService } from "../../API";
import type { UseVersionState, UseVersionReturn } from "./Shared/Types";
import {
   updateVersionState,
   handleError,
   useMemoizedIdentifier,
} from "./Shared/Types";

export const useVersion = (identifier?: string | number): UseVersionReturn => {
   const [state, setState] = useState<UseVersionState>({
      data: null,
      loading: false,
      error: null,
   });

   // Memoize normalized identifier
   const normalizedIdentifier = useMemoizedIdentifier(identifier);

   // Fetch function
   const fetchVersion = useCallback(async (id: string | number) => {
      updateVersionState(setState, { loading: true, error: null });

      try {
         const version = await gameService.getVersion(id);
         updateVersionState(setState, { data: version, loading: false });
      } catch (error) {
         updateVersionState(setState, {
            data: null,
            loading: false,
            error: handleError(error),
         });
      }
   }, []);

   // Refetch function
   const refetch = useCallback(() => {
      if (normalizedIdentifier) {
         fetchVersion(normalizedIdentifier);
      }
   }, [normalizedIdentifier, fetchVersion]);

   // Effect for initial fetch
   useEffect(() => {
      if (normalizedIdentifier) {
         fetchVersion(normalizedIdentifier);
      }
   }, [normalizedIdentifier, fetchVersion]);

   // Memoized return
   return useMemo(() => ({ ...state, refetch }), [state, refetch]);
};
