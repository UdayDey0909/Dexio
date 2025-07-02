import { useState, useEffect, useCallback, useMemo } from "react";
import { locationService } from "../../API";
import {
   type UseRegionDetailsState,
   type UseRegionDetailsReturn,
   type RegionDetails,
   updateRegionDetailsState,
   handleError,
   useMemoizedIdentifier,
} from "./Shared/Types";

export const useRegionDetails = (name?: string): UseRegionDetailsReturn => {
   const [state, setState] = useState<UseRegionDetailsState>({
      data: null,
      loading: false,
      error: null,
   });

   // Memoize normalized identifier (only accept string for details)
   const normalizedName = useMemoizedIdentifier(name);

   // Fetch function with enhanced details
   const fetchRegionDetails = useCallback(async (regionName: string) => {
      updateRegionDetailsState(setState, { loading: true, error: null });

      try {
         const region = await locationService.getRegion(regionName);

         // Transform to enhanced details
         const regionDetails: RegionDetails = {
            ...region,
            formattedName: region.name
               .split("-")
               .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
               .join(" "),
            locationCount: region.locations?.length || 0,
         };

         updateRegionDetailsState(setState, {
            data: regionDetails,
            loading: false,
         });
      } catch (error) {
         updateRegionDetailsState(setState, {
            data: null,
            loading: false,
            error: handleError(error),
         });
      }
   }, []);

   // Refetch function
   const refetch = useCallback(() => {
      if (normalizedName && typeof normalizedName === "string") {
         fetchRegionDetails(normalizedName);
      }
   }, [normalizedName, fetchRegionDetails]);

   // Effect for initial fetch
   useEffect(() => {
      if (normalizedName && typeof normalizedName === "string") {
         fetchRegionDetails(normalizedName);
      }
   }, [normalizedName, fetchRegionDetails]);

   // Memoized return
   return useMemo(() => ({ ...state, refetch }), [state, refetch]);
};
