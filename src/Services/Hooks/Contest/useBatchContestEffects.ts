import { useState, useEffect, useCallback, useMemo } from "react";
import { contestService } from "../../API";
import {
   UseBatchContestEffectsState,
   UseBatchContestEffectsReturn,
   updateBatchContestEffectsState,
   handleError,
   useMemoizedIds,
} from "./Shared/Types";

export const useBatchContestEffects = (
   ids?: number[]
): UseBatchContestEffectsReturn => {
   const [state, setState] = useState<UseBatchContestEffectsState>({
      data: [],
      loading: false,
      error: null,
   });

   // Memoize and validate IDs
   const normalizedIds = useMemoizedIds(ids);

   // Fetch function
   const fetchBatchContestEffects = useCallback(async (effectIds: number[]) => {
      updateBatchContestEffectsState(setState, { loading: true, error: null });

      try {
         const effects = await contestService.batchGetContestEffects(effectIds);
         updateBatchContestEffectsState(setState, {
            data: effects,
            loading: false,
         });
      } catch (error) {
         updateBatchContestEffectsState(setState, {
            data: [],
            loading: false,
            error: handleError(error),
         });
      }
   }, []);

   // Refetch function
   const refetch = useCallback(() => {
      if (normalizedIds && normalizedIds.length > 0) {
         fetchBatchContestEffects(normalizedIds);
      }
   }, [normalizedIds, fetchBatchContestEffects]);

   // Effect for initial fetch
   useEffect(() => {
      if (normalizedIds && normalizedIds.length > 0) {
         fetchBatchContestEffects(normalizedIds);
      }
   }, [normalizedIds, fetchBatchContestEffects]);

   // Memoized return
   return useMemo(() => ({ ...state, refetch }), [state, refetch]);
};
