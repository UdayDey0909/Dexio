import { useState, useEffect, useCallback, useMemo } from "react";
import { locationService } from "../../API";
import {
   type UseLocationAreaListState,
   type UseLocationAreaListReturn,
   updateLocationAreaListState,
   handleError,
   useMemoizedPagination,
} from "./Shared/Types";

export const useLocationAreaList = (
   offset: number = 0,
   limit: number = 20
): UseLocationAreaListReturn => {
   const [state, setState] = useState<UseLocationAreaListState>({
      data: [],
      loading: false,
      error: null,
   });

   // Memoize pagination params
   const paginationParams = useMemoizedPagination(offset, limit);

   // Fetch function
   const fetchLocationAreaList = useCallback(async () => {
      updateLocationAreaListState(setState, { loading: true, error: null });

      try {
         const list = await locationService.getLocationAreaList(
            paginationParams.offset,
            paginationParams.limit
         );
         updateLocationAreaListState(setState, {
            data: list.results || [],
            loading: false,
         });
      } catch (error) {
         updateLocationAreaListState(setState, {
            data: [],
            loading: false,
            error: handleError(error),
         });
      }
   }, [paginationParams.offset, paginationParams.limit]);

   // Refetch function
   const refetch = useCallback(() => {
      fetchLocationAreaList();
   }, [fetchLocationAreaList]);

   // Effect for initial fetch
   useEffect(() => {
      fetchLocationAreaList();
   }, [fetchLocationAreaList]);

   // Memoized return
   return useMemo(() => ({ ...state, refetch }), [state, refetch]);
};
