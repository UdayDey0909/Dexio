import { useState, useEffect, useCallback, useMemo } from "react";
import { locationService } from "../../API";
import {
   type UseLocationAreaState,
   type UseLocationAreaReturn,
   updateLocationAreaState,
   handleError,
   useMemoizedIdentifier,
} from "./Shared/Types";

export const useLocationArea = (
   identifier?: string | number
): UseLocationAreaReturn => {
   const [state, setState] = useState<UseLocationAreaState>({
      data: null,
      loading: false,
      error: null,
   });

   // Memoize normalized identifier
   const normalizedIdentifier = useMemoizedIdentifier(identifier);

   // Fetch function
   const fetchLocationArea = useCallback(async (id: string | number) => {
      updateLocationAreaState(setState, { loading: true, error: null });

      try {
         const locationArea = await locationService.getLocationArea(id);
         updateLocationAreaState(setState, {
            data: locationArea,
            loading: false,
         });
      } catch (error) {
         updateLocationAreaState(setState, {
            data: null,
            loading: false,
            error: handleError(error),
         });
      }
   }, []);

   // Refetch function
   const refetch = useCallback(() => {
      if (normalizedIdentifier) {
         fetchLocationArea(normalizedIdentifier);
      }
   }, [normalizedIdentifier, fetchLocationArea]);

   // Effect for initial fetch
   useEffect(() => {
      if (normalizedIdentifier) {
         fetchLocationArea(normalizedIdentifier);
      }
   }, [normalizedIdentifier, fetchLocationArea]);

   // Memoized return
   return useMemo(() => ({ ...state, refetch }), [state, refetch]);
};
