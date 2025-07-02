import { useState, useEffect, useCallback, useMemo } from "react";
import { locationService } from "../../API";
import {
   type UseRegionListState,
   type UseRegionListReturn,
   updateRegionListState,
   handleError,
   useMemoizedPagination,
} from "./Shared/Types";

export const useRegionList = (
   offset: number = 0,
   limit: number = 20
): UseRegionListReturn => {
   const [state, setState] = useState<UseRegionListState>({
      data: [],
      loading: false,
      error: null,
   });

   // Memoize pagination params
   const paginationParams = useMemoizedPagination(offset, limit);

   // Fetch function
   const fetchRegionList = useCallback(async () => {
      updateRegionListState(setState, { loading: true, error: null });

      try {
         const list = await locationService.getRegionList(
            paginationParams.offset,
            paginationParams.limit
         );
         updateRegionListState(setState, {
            data: list.results || [],
            loading: false,
         });
      } catch (error) {
         updateRegionListState(setState, {
            data: [],
            loading: false,
            error: handleError(error),
         });
      }
   }, [paginationParams.offset, paginationParams.limit]);

   // Refetch function
   const refetch = useCallback(() => {
      fetchRegionList();
   }, [fetchRegionList]);

   // Effect for initial fetch
   useEffect(() => {
      fetchRegionList();
   }, [fetchRegionList]);

   // Memoized return
   return useMemo(() => ({ ...state, refetch }), [state, refetch]);
};
