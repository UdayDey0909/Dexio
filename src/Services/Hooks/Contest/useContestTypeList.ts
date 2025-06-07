import { useState, useEffect, useCallback, useMemo } from "react";
import { contestService } from "../../API";
import {
   UseContestTypeListState,
   UseContestTypeListReturn,
   updateContestTypeListState,
   handleError,
   useMemoizedPagination,
} from "./Shared/Types";

export const useContestTypeList = (
   offset: number = 0,
   limit: number = 20
): UseContestTypeListReturn => {
   const [state, setState] = useState<UseContestTypeListState>({
      data: [],
      loading: false,
      error: null,
   });

   // Memoize pagination params
   const paginationParams = useMemoizedPagination(offset, limit);

   // Fetch function
   const fetchContestTypeList = useCallback(async () => {
      updateContestTypeListState(setState, { loading: true, error: null });

      try {
         const list = await contestService.getContestTypeList(
            paginationParams.offset,
            paginationParams.limit
         );
         updateContestTypeListState(setState, {
            data: list.results || [],
            loading: false,
         });
      } catch (error) {
         updateContestTypeListState(setState, {
            data: [],
            loading: false,
            error: handleError(error),
         });
      }
   }, [paginationParams.offset, paginationParams.limit]);

   // Refetch function
   const refetch = useCallback(() => {
      fetchContestTypeList();
   }, [fetchContestTypeList]);

   // Effect for initial fetch
   useEffect(() => {
      fetchContestTypeList();
   }, [fetchContestTypeList]);

   // Memoized return
   return useMemo(() => ({ ...state, refetch }), [state, refetch]);
};
