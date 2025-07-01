import { useState, useEffect, useCallback, useMemo } from "react";
import { gameService } from "../../API";
import type {
   UseVersionGroupDetailsState,
   UseVersionGroupDetailsReturn,
} from "./Shared/Types";
import { updateVersionGroupDetailsState, handleError } from "./Shared/Types";

export const useVersionGroupDetails = (
   name?: string
): UseVersionGroupDetailsReturn => {
   const [state, setState] = useState<UseVersionGroupDetailsState>({
      data: null,
      loading: false,
      error: null,
   });

   // Memoize normalized name (only accept strings for details)
   const normalizedName = useMemo(() => {
      if (!name || typeof name !== "string") return null;
      return name.toLowerCase().trim();
   }, [name]);

   // Fetch function
   const fetchVersionGroupDetails = useCallback(async (vgName: string) => {
      updateVersionGroupDetailsState(setState, { loading: true, error: null });

      try {
         const versionGroupDetails = await gameService.getVersionGroupDetails(
            vgName
         );
         updateVersionGroupDetailsState(setState, {
            data: versionGroupDetails,
            loading: false,
         });
      } catch (error) {
         updateVersionGroupDetailsState(setState, {
            data: null,
            loading: false,
            error: handleError(error),
         });
      }
   }, []);

   // Refetch function
   const refetch = useCallback(() => {
      if (normalizedName) {
         fetchVersionGroupDetails(normalizedName);
      }
   }, [normalizedName, fetchVersionGroupDetails]);

   // Effect for initial fetch
   useEffect(() => {
      if (normalizedName) {
         fetchVersionGroupDetails(normalizedName);
      }
   }, [normalizedName, fetchVersionGroupDetails]);

   // Memoized return
   return useMemo(() => ({ ...state, refetch }), [state, refetch]);
};
