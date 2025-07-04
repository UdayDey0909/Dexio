import { useState, useEffect, useCallback, useMemo } from "react";
import { locationService } from "../../API";
import {
   type UseLocationState,
   type UseLocationReturn,
   updateLocationState,
   handleError,
   useMemoizedIdentifier,
} from "./Shared/Types";

export const useLocation = (
   identifier?: string | number
): UseLocationReturn => {
   const [state, setState] = useState<UseLocationState>({
      data: null,
      loading: false,
      error: null,
   });

   // Memoize normalized identifier
   const normalizedIdentifier = useMemoizedIdentifier(identifier);

   // Fetch function
   const fetchLocation = useCallback(async (id: string | number) => {
      updateLocationState(setState, { loading: true, error: null });

      try {
         const location = await locationService.getLocation(id);
         updateLocationState(setState, { data: location, loading: false });
      } catch (error) {
         updateLocationState(setState, {
            data: null,
            loading: false,
            error: handleError(error),
         });
      }
   }, []);

   // Refetch function
   const refetch = useCallback(() => {
      if (normalizedIdentifier) {
         fetchLocation(normalizedIdentifier);
      }
   }, [normalizedIdentifier, fetchLocation]);

   // Effect for initial fetch
   useEffect(() => {
      if (normalizedIdentifier) {
         fetchLocation(normalizedIdentifier);
      }
   }, [normalizedIdentifier, fetchLocation]);

   // Memoized return
   return useMemo(() => ({ ...state, refetch }), [state, refetch]);
};
