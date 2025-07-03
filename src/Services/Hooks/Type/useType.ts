import { useState, useEffect, useCallback, useMemo } from "react";
import { typeService } from "../../API";
import {
   UseTypeState,
   UseTypeReturn,
   handleError,
   updateTypeState,
   useMemoizedIdentifier,
} from "./Shared/Types";

export const useType = (identifier?: string | number): UseTypeReturn => {
   const [state, setState] = useState<UseTypeState>({
      data: null,
      loading: false,
      error: null,
   });

   // Memoize normalized identifier
   const normalizedIdentifier = useMemoizedIdentifier(identifier);

   // Fetch function
   const fetchType = useCallback(async (id: string | number) => {
      updateTypeState(setState, { loading: true, error: null });

      try {
         const type = await typeService.getType(id);
         updateTypeState(setState, { data: type, loading: false });
      } catch (error) {
         updateTypeState(setState, {
            data: null,
            loading: false,
            error: handleError(error),
         });
      }
   }, []);

   // Refetch function
   const refetch = useCallback(() => {
      if (normalizedIdentifier) {
         fetchType(normalizedIdentifier);
      }
   }, [normalizedIdentifier, fetchType]);

   // Effect for initial fetch
   useEffect(() => {
      if (normalizedIdentifier) {
         fetchType(normalizedIdentifier);
      }
   }, [normalizedIdentifier, fetchType]);

   // Memoized return
   return useMemo(() => ({ ...state, refetch }), [state, refetch]);
};
