import { useState, useEffect, useCallback, useMemo } from "react";
import { locationService } from "../../API";
import {
   type UseLocationListState,
   type UseLocationListReturn,
   updateLocationListState,
   handleError,
   useMemoizedPagination,
} from "./Shared/Types";

export const useLocationList = (
   offset: number = 0,
   limit: number = 20
): UseLocationListReturn => {
   const [state, setState] = useState<UseLocationListState>({
      data: [],
      loading: false,
      error: null,
   });

   // Memoize pagination params
   const paginationParams = useMemoizedPagination(offset, limit);

   // Fetch function
   const fetchLocationList = useCallback(async () => {
      updateLocationListState(setState, { loading: true, error: null });

      try {
         const list = await locationService.getLocationList(
            paginationParams.offset,
            paginationParams.limit
         );
         updateLocationListState(setState, {
            data: list.results || [],
            loading: false,
         });
      } catch (error) {
         updateLocationListState(setState, {
            data: [],
            loading: false,
            error: handleError(error),
         });
      }
   }, [paginationParams.offset, paginationParams.limit]);

   // Refetch function
   const refetch = useCallback(() => {
      fetchLocationList();
   }, [fetchLocationList]);

   // Effect for initial fetch
   useEffect(() => {
      fetchLocationList();
   }, [fetchLocationList]);

   // Memoized return
   return useMemo(() => ({ ...state, refetch }), [state, refetch]);
};
