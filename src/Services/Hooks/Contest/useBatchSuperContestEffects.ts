import { useState, useEffect, useCallback, useMemo } from "react";
import { contestService } from "../../API";
import {
   UseBatchSuperContestEffectsState,
   UseBatchSuperContestEffectsReturn,
   updateBatchSuperContestEffectsState,
   handleError,
   useMemoizedIds,
} from "./Shared/Types";

export const useBatchSuperContestEffects = (
   ids?: number[]
): UseBatchSuperContestEffectsReturn => {
   const [state, setState] = useState<UseBatchSuperContestEffectsState>({
      data: [],
      loading: false,
      error: null,
   });

   // Memoize and validate IDs
   const normalizedIds = useMemoizedIds(ids);

   // Fetch function
   const fetchBatchSuperContestEffects = useCallback(
      async (effectIds: number[]) => {
         updateBatchSuperContestEffectsState(setState, {
            loading: true,
            error: null,
         });

         try {
            const effects = await contestService.batchGetSuperContestEffects(
               effectIds
            );
            updateBatchSuperContestEffectsState(setState, {
               data: effects,
               loading: false,
            });
         } catch (error) {
            updateBatchSuperContestEffectsState(setState, {
               data: [],
               loading: false,
               error: handleError(error),
            });
         }
      },
      []
   );

   // Refetch function
   const refetch = useCallback(() => {
      if (normalizedIds && normalizedIds.length > 0) {
         fetchBatchSuperContestEffects(normalizedIds);
      }
   }, [normalizedIds, fetchBatchSuperContestEffects]);

   // Effect for initial fetch
   useEffect(() => {
      if (normalizedIds && normalizedIds.length > 0) {
         fetchBatchSuperContestEffects(normalizedIds);
      }
   }, [normalizedIds, fetchBatchSuperContestEffects]);

   // Memoized return
   return useMemo(() => ({ ...state, refetch }), [state, refetch]);
};
