import { useState, useEffect, useCallback, useMemo } from "react";
import { locationService } from "../../API";
import {
   type UseLocationsByRegionState,
   type UseLocationsByRegionReturn,
   updateLocationsByRegionState,
   handleError,
   useMemoizedRegionName,
} from "./Shared/Types";

export const useLocationsByRegion = (
   regionName?: string
): UseLocationsByRegionReturn => {
   const [state, setState] = useState<UseLocationsByRegionState>({
      data: [],
      loading: false,
      error: null,
   });

   // Memoize normalized region name
   const normalizedRegionName = useMemoizedRegionName(regionName);

   // Fetch function
   const fetchLocationsByRegion = useCallback(async (name: string) => {
      updateLocationsByRegionState(setState, { loading: true, error: null });

      try {
         const locations = await locationService.getLocationsByRegion(name);
         updateLocationsByRegionState(setState, {
            data: locations || [],
            loading: false,
         });
      } catch (error) {
         updateLocationsByRegionState(setState, {
            data: [],
            loading: false,
            error: handleError(error),
         });
      }
   }, []);

   // Refetch function
   const refetch = useCallback(() => {
      if (normalizedRegionName) {
         fetchLocationsByRegion(normalizedRegionName);
      }
   }, [normalizedRegionName, fetchLocationsByRegion]);

   // Effect for initial fetch
   useEffect(() => {
      if (normalizedRegionName) {
         fetchLocationsByRegion(normalizedRegionName);
      }
   }, [normalizedRegionName, fetchLocationsByRegion]);

   // Memoized return
   return useMemo(() => ({ ...state, refetch }), [state, refetch]);
};
