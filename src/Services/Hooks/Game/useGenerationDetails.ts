import { useState, useEffect, useCallback, useMemo } from "react";
import { gameService } from "../../API";
import type {
   UseGenerationDetailsState,
   UseGenerationDetailsReturn,
} from "./Shared/Types";
import {
   updateGenerationDetailsState,
   handleError,
   useMemoizedIdentifier,
} from "./Shared/Types";

export const useGenerationDetails = (
   name?: string
): UseGenerationDetailsReturn => {
   const [state, setState] = useState<UseGenerationDetailsState>({
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
   const fetchGenerationDetails = useCallback(
      async (generationName: string) => {
         updateGenerationDetailsState(setState, { loading: true, error: null });

         try {
            const generationDetails = await gameService.getGenerationDetails(
               generationName
            );
            updateGenerationDetailsState(setState, {
               data: generationDetails,
               loading: false,
            });
         } catch (error) {
            updateGenerationDetailsState(setState, {
               data: null,
               loading: false,
               error: handleError(error),
            });
         }
      },
      []
   );

   // Refetch function
   const refetch = useCallback(() => {
      if (normalizedName) {
         fetchGenerationDetails(normalizedName);
      }
   }, [normalizedName, fetchGenerationDetails]);

   // Effect for initial fetch
   useEffect(() => {
      if (normalizedName) {
         fetchGenerationDetails(normalizedName);
      }
   }, [normalizedName, fetchGenerationDetails]);

   // Memoized return
   return useMemo(() => ({ ...state, refetch }), [state, refetch]);
};
