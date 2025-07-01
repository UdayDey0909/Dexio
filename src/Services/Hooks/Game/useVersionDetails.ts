import { useState, useEffect, useCallback, useMemo } from "react";
import { gameService } from "../../API";
import type {
   UseVersionDetailsState,
   UseVersionDetailsReturn,
} from "./Shared/Types";
import { updateVersionDetailsState, handleError } from "./Shared/Types";

export const useVersionDetails = (name?: string): UseVersionDetailsReturn => {
   const [state, setState] = useState<UseVersionDetailsState>({
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
   const fetchVersionDetails = useCallback(async (versionName: string) => {
      updateVersionDetailsState(setState, { loading: true, error: null });

      try {
         const versionDetails = await gameService.getVersionDetails(
            versionName
         );
         updateVersionDetailsState(setState, {
            data: versionDetails,
            loading: false,
         });
      } catch (error) {
         updateVersionDetailsState(setState, {
            data: null,
            loading: false,
            error: handleError(error),
         });
      }
   }, []);

   // Refetch function
   const refetch = useCallback(() => {
      if (normalizedName) {
         fetchVersionDetails(normalizedName);
      }
   }, [normalizedName, fetchVersionDetails]);

   // Effect for initial fetch
   useEffect(() => {
      if (normalizedName) {
         fetchVersionDetails(normalizedName);
      }
   }, [normalizedName, fetchVersionDetails]);

   // Memoized return
   return useMemo(() => ({ ...state, refetch }), [state, refetch]);
};
