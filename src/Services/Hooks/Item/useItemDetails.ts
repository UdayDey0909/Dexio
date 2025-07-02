import { useState, useEffect, useCallback, useMemo, useRef } from "react";
import { itemService } from "../../API";
import type { UseItemDetailsState, UseItemDetailsReturn } from "./Shared/Types";
import {
   handleError,
   updateItemDetailsState,
   useMemoizedIdentifier,
} from "./Shared/Types";

export const useItemDetails = (name?: string): UseItemDetailsReturn => {
   const [state, setState] = useState<UseItemDetailsState>({
      data: null,
      loading: false,
      error: null,
   });

   // Track mounted state to prevent state updates after unmount
   const isMountedRef = useRef(true);

   // Use shared memoized identifier utility instead of custom logic
   const normalizedName = useMemoizedIdentifier(name);

   // Validate that the identifier is a string for details endpoint
   const validatedName = useMemo(() => {
      if (normalizedName && typeof normalizedName === "string") {
         return normalizedName;
      }
      return null;
   }, [normalizedName]);

   // Fetch function with proper dependencies and cleanup
   const fetchItemDetails = useCallback(
      async (itemName: string) => {
         if (!isMountedRef.current) return;

         updateItemDetailsState(setState, { loading: true, error: null });

         try {
            const itemDetails = await itemService.getItemDetails(itemName);

            // Check if component is still mounted before updating state
            if (isMountedRef.current) {
               updateItemDetailsState(setState, {
                  data: itemDetails,
                  loading: false,
               });
            }
         } catch (error) {
            if (isMountedRef.current) {
               updateItemDetailsState(setState, {
                  data: null,
                  loading: false,
                  error: handleError(error),
               });
            }
         }
      },
      [itemService]
   ); // Include itemService in dependencies

   // Refetch function
   const refetch = useCallback(() => {
      if (validatedName && isMountedRef.current) {
         fetchItemDetails(validatedName);
      }
   }, [validatedName, fetchItemDetails]);

   // Effect for initial fetch
   useEffect(() => {
      if (validatedName) {
         fetchItemDetails(validatedName);
      }
   }, [validatedName, fetchItemDetails]);

   // Cleanup effect to prevent memory leaks
   useEffect(() => {
      return () => {
         isMountedRef.current = false;
      };
   }, []);

   // Memoized return
   return useMemo(() => ({ ...state, refetch }), [state, refetch]);
};
