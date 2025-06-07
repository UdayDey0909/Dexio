import { useState, useEffect, useCallback, useMemo } from "react";
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

   // Memoize normalized ID
   const normalizedId = useMemo(() => {
      return id && typeof id === "number" && id > 0 ? id : null;
   }, [id]);

   // Fetch function
   const fetchSuperContestEffect = useCallback(async (effectId: number) => {
      updateSuperContestEffectState(setState, { loading: true, error: null });

      try {
         const effect = await contestService.getSuperContestEffect(effectId);
         updateSuperContestEffectState(setState, {
            data: effect,
            loading: false,
         });
      } catch (error) {
         updateSuperContestEffectState(setState, {
            data: null,
            loading: false,
            error: handleError(error),
         });
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

   // Memoized return
   return useMemo(() => ({ ...state, refetch }), [state, refetch]);
};
