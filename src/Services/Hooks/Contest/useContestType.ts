import { useState, useEffect, useCallback, useMemo } from "react";
import { contestService } from "../../API";
import {
   UseContestTypeState,
   UseContestTypeReturn,
   updateContestTypeState,
   handleError,
   useMemoizedIdentifier,
} from "./Shared/Types";

export const useContestType = (
   identifier?: string | number
): UseContestTypeReturn => {
   const [state, setState] = useState<UseContestTypeState>({
      data: null,
      loading: false,
      error: null,
   });

   // Memoize normalized identifier
   const normalizedIdentifier = useMemoizedIdentifier(identifier);

   // Fetch function
   const fetchContestType = useCallback(async (id: string | number) => {
      updateContestTypeState(setState, { loading: true, error: null });

      try {
         const contestType = await contestService.getContestType(id);
         updateContestTypeState(setState, {
            data: contestType,
            loading: false,
         });
      } catch (error) {
         updateContestTypeState(setState, {
            data: null,
            loading: false,
            error: handleError(error),
         });
      }
   }, []);

   // Refetch function
   const refetch = useCallback(() => {
      if (normalizedIdentifier) {
         fetchContestType(normalizedIdentifier);
      }
   }, [normalizedIdentifier, fetchContestType]);

   // Effect for initial fetch
   useEffect(() => {
      if (normalizedIdentifier) {
         fetchContestType(normalizedIdentifier);
      }
   }, [normalizedIdentifier, fetchContestType]);

   // Memoized return
   return useMemo(() => ({ ...state, refetch }), [state, refetch]);
};
