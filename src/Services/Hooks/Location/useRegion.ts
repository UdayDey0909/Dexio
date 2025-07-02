import { useState, useEffect, useCallback, useMemo } from "react";
import { locationService } from "../../API";
import {
   type UseRegionState,
   type UseRegionReturn,
   updateRegionState,
   handleError,
   useMemoizedIdentifier,
} from "./Shared/Types";

export const useRegion = (identifier?: string | number): UseRegionReturn => {
   const [state, setState] = useState<UseRegionState>({
      data: null,
      loading: false,
      error: null,
   });

   // Memoize normalized identifier
   const normalizedIdentifier = useMemoizedIdentifier(identifier);

   // Fetch function
   const fetchRegion = useCallback(async (id: string | number) => {
      updateRegionState(setState, { loading: true, error: null });

      try {
         const region = await locationService.getRegion(id);
         updateRegionState(setState, { data: region, loading: false });
      } catch (error) {
         updateRegionState(setState, {
            data: null,
            loading: false,
            error: handleError(error),
         });
      }
   }, []);

   // Refetch function
   const refetch = useCallback(() => {
      if (normalizedIdentifier) {
         fetchRegion(normalizedIdentifier);
      }
   }, [normalizedIdentifier, fetchRegion]);

   // Effect for initial fetch
   useEffect(() => {
      if (normalizedIdentifier) {
         fetchRegion(normalizedIdentifier);
      }
   }, [normalizedIdentifier, fetchRegion]);

   // Memoized return
   return useMemo(() => ({ ...state, refetch }), [state, refetch]);
};
