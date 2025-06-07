import { useState, useEffect, useCallback, useMemo, useRef } from "react";
import { contestService } from "../../API";
import {
   UseSuperContestEffectState,
   UseSuperContestEffectReturn,
   updateSuperContestEffectState,
   handleError,
} from "./Shared/Types";

export const useSuperContestEffect = (
   id?: number
): UseSuperContestEffectReturn => {
   const [state, setState] = useState<UseSuperContestEffectState>({
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
   const fetchSuperContestEffect = useCallback(async (effectId: number) => {
      if (!isMountedRef.current) return;

      updateSuperContestEffectState(setState, { loading: true, error: null });

      try {
         const effect = await contestService.getSuperContestEffect(effectId);

         // Only update state if component is still mounted
         if (isMountedRef.current) {
            updateSuperContestEffectState(setState, {
               data: effect,
               loading: false,
            });
         }
      } catch (error) {
         if (isMountedRef.current) {
            updateSuperContestEffectState(setState, {
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
         fetchSuperContestEffect(normalizedId);
      }
   }, [normalizedId, fetchSuperContestEffect]);

   // Effect for initial fetch
   useEffect(() => {
      if (normalizedId) {
         fetchSuperContestEffect(normalizedId);
      }
   }, [normalizedId, fetchSuperContestEffect]);

   // Cleanup effect
   useEffect(() => {
      return () => {
         isMountedRef.current = false;
      };
   }, []);

   // Memoized return
   return useMemo(() => ({ ...state, refetch }), [state, refetch]);
};
