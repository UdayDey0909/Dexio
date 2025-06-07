import { useState, useEffect, useCallback, useMemo } from "react";
import { contestService } from "../../API";
import {
   UseSuperContestEffectListState,
   UseSuperContestEffectListReturn,
   updateSuperContestEffectListState,
   handleError,
   useMemoizedPagination,
} from "./Shared/Types";

export const useSuperContestEffectList = (
   offset: number = 0,
   limit: number = 20
): UseSuperContestEffectListReturn => {
   const [state, setState] = useState<UseSuperContestEffectListState>({
      data: [],
      loading: false,
      error: null,
   });

   // Memoize pagination params
   const paginationParams = useMemoizedPagination(offset, limit);

   // Fetch function
   const fetchSuperContestEffectList = useCallback(async () => {
      updateSuperContestEffectListState(setState, {
         loading: true,
         error: null,
      });

      try {
         const list = await contestService.getSuperContestEffectList(
            paginationParams.offset,
            paginationParams.limit
         );
         updateSuperContestEffectListState(setState, {
            data: list.results || [],
            loading: false,
         });
      } catch (error) {
         updateSuperContestEffectListState(setState, {
            data: [],
            loading: false,
            error: handleError(error),
         });
      }
   }, [paginationParams.offset, paginationParams.limit]);

   // Refetch function
   const refetch = useCallback(() => {
      fetchSuperContestEffectList();
   }, [fetchSuperContestEffectList]);

   // Effect for initial fetch
   useEffect(() => {
      fetchSuperContestEffectList();
   }, [fetchSuperContestEffectList]);

   // Memoized return
   return useMemo(() => ({ ...state, refetch }), [state, refetch]);
};
