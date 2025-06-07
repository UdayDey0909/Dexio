import { useState, useEffect, useCallback, useMemo } from "react";
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

   // Memoize normalized ID
   const normalizedId = useMemo(() => {
      return id && typeof id === "number" && id > 0 ? id : null;
   }, [id]);

   // Fetch function
   const fetchContestEffect = useCallback(async (effectId: number) => {
      updateContestEffectState(setState, { loading: true, error: null });

      try {
         const effect = await contestService.getContestEffect(effectId);
         updateContestEffectState(setState, { data: effect, loading: false });
      } catch (error) {
         updateContestEffectState(setState, {
            data: null,
            loading: false,
            error: handleError(error),
         });
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

   // Memoized return
   return useMemo(() => ({ ...state, refetch }), [state, refetch]);
};
