import { useState, useEffect, useCallback, useMemo } from "react";
import { locationService } from "../../API";
import {
   type UseLocationDetailsState,
   type UseLocationDetailsReturn,
   type LocationDetails,
   updateLocationDetailsState,
   handleError,
   useMemoizedIdentifier,
} from "./Shared/Types";

export const useLocationDetails = (name?: string): UseLocationDetailsReturn => {
   const [state, setState] = useState<UseLocationDetailsState>({
      data: null,
      loading: false,
      error: null,
   });

   // Memoize normalized identifier (only accept string for details)
   const normalizedName = useMemoizedIdentifier(name);

   // Fetch function with enhanced details
   const fetchLocationDetails = useCallback(async (locationName: string) => {
      updateLocationDetailsState(setState, { loading: true, error: null });

      try {
         const location = await locationService.getLocation(locationName);

         // Transform to enhanced details
         const locationDetails: LocationDetails = {
            ...location,
            formattedName: location.name
               .split("-")
               .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
               .join(" "),
            areaCount: location.areas?.length || 0,
         };

         updateLocationDetailsState(setState, {
            data: locationDetails,
            loading: false,
         });
      } catch (error) {
         updateLocationDetailsState(setState, {
            data: null,
            loading: false,
            error: handleError(error),
         });
      }
   }, []);

   // Refetch function
   const refetch = useCallback(() => {
      if (normalizedName && typeof normalizedName === "string") {
         fetchLocationDetails(normalizedName);
      }
   }, [normalizedName, fetchLocationDetails]);

   // Effect for initial fetch
   useEffect(() => {
      if (normalizedName && typeof normalizedName === "string") {
         fetchLocationDetails(normalizedName);
      }
   }, [normalizedName, fetchLocationDetails]);

   // Memoized return
   return useMemo(() => ({ ...state, refetch }), [state, refetch]);
};
