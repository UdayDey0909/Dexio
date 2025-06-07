import { useState, useEffect, useCallback, useMemo, useRef } from "react";
import { contestService } from "../../API";
import {
   UseContestEffectState,
   UseContestEffectReturn,
   updateContestEffectState,
   handleError,
} from "./Shared/Types";

export const useContestEffect = (id?: number): UseContestEffectReturn => {
   const [state, setState] = useState<UseContestEffectState>({
      data: null,
      loading: false,
      error: null,
   });

   // Track if component is mounted to prevent state updates on unmounted components
   const isMountedRef = useRef(true);

   // Memoize normalized ID
   const normalizedId = useMemo(() => {
      return id && typeof id === "number" && id > 0 ? id : null;
   }, [id]);

   // Fetch function with cancellation support
   const fetchContestEffect = useCallback(async (effectId: number) => {
      if (!isMountedRef.current) return;

      updateContestEffectState(setState, { loading: true, error: null });

      try {
         const effect = await contestService.getContestEffect(effectId);

         // Only update state if component is still mounted
         if (isMountedRef.current) {
            updateContestEffectState(setState, {
               data: effect,
               loading: false,
            });
         }
      } catch (error) {
         if (isMountedRef.current) {
            updateContestEffectState(setState, {
               data: null,
               loading: false,
               error: handleError(error),
            });
         }
      }
   }, []);

   // Refetch function
   const refetch = useCallback(() => {
      if (normalizedId) {
         fetchContestEffect(normalizedId);
      }
   }, [normalizedId, fetchContestEffect]);

   // Effect for initial fetch
   useEffect(() => {
      if (normalizedId) {
         fetchContestEffect(normalizedId);
      }
   }, [normalizedId, fetchContestEffect]);

   // Cleanup effect
   useEffect(() => {
      return () => {
         isMountedRef.current = false;
      };
   }, []);

   // Memoized return
   return useMemo(() => ({ ...state, refetch }), [state, refetch]);
};
