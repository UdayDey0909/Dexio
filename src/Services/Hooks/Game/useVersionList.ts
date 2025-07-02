import { useState, useEffect, useCallback, useMemo } from "react";
import { gameService } from "../../API";
import type { UseVersionListState, UseVersionListReturn } from "./Shared/Types";
import {
   updateVersionListState,
   handleError,
   useMemoizedPagination,
} from "./Shared/Types";

export const useVersionList = (
   offset: number = 0,
   limit: number = 20
): UseVersionListReturn => {
   const [state, setState] = useState<UseVersionListState>({
      data: [],
      loading: false,
      error: null,
   });

   // Memoize pagination params
   const paginationParams = useMemoizedPagination(offset, limit);

   // Fetch function
   const fetchVersionList = useCallback(async () => {
      updateVersionListState(setState, { loading: true, error: null });

      try {
         const list = await gameService.getVersionList(
            paginationParams.offset,
            paginationParams.limit
         );
         updateVersionListState(setState, {
            data: list.results || [],
            loading: false,
         });
      } catch (error) {
         updateVersionListState(setState, {
            data: [],
            loading: false,
            error: handleError(error),
         });
      }
   }, [paginationParams.offset, paginationParams.limit]);

   // Refetch function
   const refetch = useCallback(() => {
      fetchVersionList();
   }, [fetchVersionList]);

   // Effect for initial fetch
   useEffect(() => {
      fetchVersionList();
   }, [fetchVersionList]);

   // Memoized return
   return useMemo(() => ({ ...state, refetch }), [state, refetch]);
};
