import { useState, useEffect, useCallback, useMemo } from "react";
import { contestService } from "../../API";
import {
   UseContestEffectListState,
   UseContestEffectListReturn,
   updateContestEffectListState,
   handleError,
   useMemoizedPagination,
} from "./Shared/Types";

export const useContestEffectList = (
   offset: number = 0,
   limit: number = 20
): UseContestEffectListReturn => {
   const [state, setState] = useState<UseContestEffectListState>({
      data: [],
      loading: false,
      error: null,
   });

   // Memoize pagination params
   const paginationParams = useMemoizedPagination(offset, limit);

   // Fetch function
   const fetchContestEffectList = useCallback(async () => {
      updateContestEffectListState(setState, { loading: true, error: null });

      try {
         const list = await contestService.getContestEffectList(
            paginationParams.offset,
            paginationParams.limit
         );
         updateContestEffectListState(setState, {
            data: list.results || [],
            loading: false,
         });
      } catch (error) {
         updateContestEffectListState(setState, {
            data: [],
            loading: false,
            error: handleError(error),
         });
      }
   }, [paginationParams.offset, paginationParams.limit]);

   // Refetch function
   const refetch = useCallback(() => {
      fetchContestEffectList();
   }, [fetchContestEffectList]);

   // Effect for initial fetch
   useEffect(() => {
      fetchContestEffectList();
   }, [fetchContestEffectList]);

   // Memoized return
   return useMemo(() => ({ ...state, refetch }), [state, refetch]);
};
