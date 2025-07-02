import { useState, useEffect, useCallback, useMemo, useRef } from "react";
import { itemService } from "../../API";
import type { UseItemState, UseItemReturn } from "./Shared/Types";
import {
   handleError,
   updateItemState,
   useMemoizedIdentifier,
} from "./Shared/Types";

export const useItem = (identifier?: string | number): UseItemReturn => {
   const [state, setState] = useState<UseItemState>({
      data: null,
      loading: false,
      error: null,
   });

   // Track mounted state to prevent state updates after unmount
   const isMountedRef = useRef(true);

   // Memoize normalized identifier
   const normalizedIdentifier = useMemoizedIdentifier(identifier);

   // Fetch function with proper dependencies and cleanup
   const fetchItem = useCallback(
      async (id: string | number) => {
         if (!isMountedRef.current) return;

         updateItemState(setState, { loading: true, error: null });

         try {
            const item = await itemService.getItem(id);

            // Check if component is still mounted before updating state
            if (isMountedRef.current) {
               updateItemState(setState, { data: item, loading: false });
            }
         } catch (error) {
            if (isMountedRef.current) {
               updateItemState(setState, {
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
      if (normalizedIdentifier && isMountedRef.current) {
         fetchItem(normalizedIdentifier);
      }
   }, [normalizedIdentifier, fetchItem]);

   // Effect for initial fetch
   useEffect(() => {
      if (normalizedIdentifier) {
         fetchItem(normalizedIdentifier);
      }
   }, [normalizedIdentifier, fetchItem]);

   // Cleanup effect to prevent memory leaks
   useEffect(() => {
      return () => {
         isMountedRef.current = false;
      };
   }, []);

   // Memoized return
   return useMemo(() => ({ ...state, refetch }), [state, refetch]);
};
