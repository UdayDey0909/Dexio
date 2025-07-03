import { useState, useEffect, useCallback, useMemo } from "react";
import { machineService } from "../../API";
import {
   type UseMachineListState,
   type UseMachineListReturn,
   updateMachineListState,
   handleError,
   useMemoizedPagination,
} from "./Shared/Types";

export const useMachineList = (
   offset: number = 0,
   limit: number = 20
): UseMachineListReturn => {
   const [state, setState] = useState<UseMachineListState>({
      data: [],
      loading: false,
      error: null,
      hasMore: true,
   });

   // Memoize pagination params
   const paginationParams = useMemoizedPagination(offset, limit);

   // Fetch function
   const fetchMachineList = useCallback(async () => {
      updateMachineListState(setState, { loading: true, error: null });

      try {
         const list = await machineService.getMachineList(
            paginationParams.offset,
            paginationParams.limit
         );
         updateMachineListState(setState, {
            data: list.results || [],
            loading: false,
            hasMore: !!list.next,
         });
      } catch (error) {
         updateMachineListState(setState, {
            data: [],
            loading: false,
            error: handleError(error),
            hasMore: false,
         });
      }
   }, [paginationParams.offset, paginationParams.limit]);

   // Refetch function
   const refetch = useCallback(() => {
      fetchMachineList();
   }, [fetchMachineList]);

   // Effect for initial fetch
   useEffect(() => {
      fetchMachineList();
   }, [fetchMachineList]);

   // Memoized return
   return useMemo(() => ({ ...state, refetch }), [state, refetch]);
};
