import { useState, useEffect, useCallback, useMemo } from "react";
import { gameService } from "../../API";
import type {
   UseGenerationListState,
   UseGenerationListReturn,
} from "./Shared/Types";
import {
   updateGenerationListState,
   handleError,
   useMemoizedPagination,
} from "./Shared/Types";

export const useGenerationList = (
   offset: number = 0,
   limit: number = 20
): UseGenerationListReturn => {
   const [state, setState] = useState<UseGenerationListState>({
      data: [],
      loading: false,
      error: null,
   });

   // Memoize pagination params
   const paginationParams = useMemoizedPagination(offset, limit);

   // Fetch function
   const fetchGenerationList = useCallback(async () => {
      updateGenerationListState(setState, { loading: true, error: null });

      try {
         const list = await gameService.getGenerationList(
            paginationParams.offset,
            paginationParams.limit
         );
         updateGenerationListState(setState, {
            data: list.results || [],
            loading: false,
         });
      } catch (error) {
         updateGenerationListState(setState, {
            data: [],
            loading: false,
            error: handleError(error),
         });
      }
   }, [paginationParams.offset, paginationParams.limit]);

   // Refetch function
   const refetch = useCallback(() => {
      fetchGenerationList();
   }, [fetchGenerationList]);

   // Effect for initial fetch
   useEffect(() => {
      fetchGenerationList();
   }, [fetchGenerationList]);

   // Memoized return
   return useMemo(() => ({ ...state, refetch }), [state, refetch]);
};
