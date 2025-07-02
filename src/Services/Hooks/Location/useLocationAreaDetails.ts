import { useState, useEffect, useCallback, useMemo } from "react";
import { locationService } from "../../API";
import {
   type UseLocationAreaDetailsState,
   type UseLocationAreaDetailsReturn,
   type LocationAreaDetails,
   updateLocationAreaDetailsState,
   handleError,
   useMemoizedIdentifier,
} from "./Shared/Types";

export const useLocationAreaDetails = (
   name?: string
): UseLocationAreaDetailsReturn => {
   const [state, setState] = useState<UseLocationAreaDetailsState>({
      data: null,
      loading: false,
      error: null,
   });

   // Memoize normalized identifier (only accept string for details)
   const normalizedName = useMemoizedIdentifier(name);

   // Fetch function with enhanced details
   const fetchLocationAreaDetails = useCallback(async (areaName: string) => {
      updateLocationAreaDetailsState(setState, { loading: true, error: null });

      try {
         const locationArea = await locationService.getLocationArea(areaName);

         // Transform to enhanced details
         const locationAreaDetails: LocationAreaDetails = {
            ...locationArea,
            formattedName: locationArea.name
               .split("-")
               .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
               .join(" "),
            encounterCount: locationArea.pokemon_encounters?.length || 0,
         };

         updateLocationAreaDetailsState(setState, {
            data: locationAreaDetails,
            loading: false,
         });
      } catch (error) {
         updateLocationAreaDetailsState(setState, {
            data: null,
            loading: false,
            error: handleError(error),
         });
      }
   }, []);

   // Refetch function
   const refetch = useCallback(() => {
      if (normalizedName && typeof normalizedName === "string") {
         fetchLocationAreaDetails(normalizedName);
      }
   }, [normalizedName, fetchLocationAreaDetails]);

   // Effect for initial fetch
   useEffect(() => {
      if (normalizedName && typeof normalizedName === "string") {
         fetchLocationAreaDetails(normalizedName);
      }
   }, [normalizedName, fetchLocationAreaDetails]);

   // Memoized return
   return useMemo(() => ({ ...state, refetch }), [state, refetch]);
};
