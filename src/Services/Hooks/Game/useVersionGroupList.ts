import { useState, useEffect, useCallback, useMemo } from "react";
import { gameService } from "../../API";
import type {
   UseVersionGroupListState,
   UseVersionGroupListReturn,
} from "./Shared/Types";
import {
   updateVersionGroupListState,
   handleError,
   useMemoizedPagination,
} from "./Shared/Types";

export const useVersionGroupList = (
   offset: number = 0,
   limit: number = 20
): UseVersionGroupListReturn => {
   const [state, setState] = useState<UseVersionGroupListState>({
      data: [],
      loading: false,
      error: null,
   });

   // Memoize pagination params
   const paginationParams = useMemoizedPagination(offset, limit);

   // Fetch function
   const fetchVersionGroupList = useCallback(async () => {
      updateVersionGroupListState(setState, { loading: true, error: null });

      try {
         const list = await gameService.getVersionGroupList(
            paginationParams.offset,
            paginationParams.limit
         );
         updateVersionGroupListState(setState, {
            data: list.results || [],
            loading: false,
         });
      } catch (error) {
         updateVersionGroupListState(setState, {
            data: [],
            loading: false,
            error: handleError(error),
         });
      }
   }, [paginationParams.offset, paginationParams.limit]);

   // Refetch function
   const refetch = useCallback(() => {
      fetchVersionGroupList();
   }, [fetchVersionGroupList]);

   // Effect for initial fetch
   useEffect(() => {
      fetchVersionGroupList();
   }, [fetchVersionGroupList]);

   // Memoized return
   return useMemo(() => ({ ...state, refetch }), [state, refetch]);
};
