import { useState, useEffect, useCallback, useMemo } from "react";
import { itemService } from "../../API";
import type { UseItemListState, UseItemListReturn } from "./Shared/Types";
import {
   handleError,
   updateItemListState,
   useMemoizedPagination,
} from "./Shared/Types";

export const useItemList = (
   offset: number = 0,
   limit: number = 20
): UseItemListReturn => {
   const [state, setState] = useState<UseItemListState>({
      data: [],
      loading: false,
      error: null,
   });

   // Memoize pagination params
   const paginationParams = useMemoizedPagination(offset, limit);

   // Fetch function
   const fetchItemList = useCallback(async () => {
      updateItemListState(setState, { loading: true, error: null });

      try {
         const list = await itemService.getItemList(
            paginationParams.offset,
            paginationParams.limit
         );
         updateItemListState(setState, {
            data: list.results || [],
            loading: false,
         });
      } catch (error) {
         updateItemListState(setState, {
            data: [],
            loading: false,
            error: handleError(error),
         });
      }
   }, [paginationParams.offset, paginationParams.limit]);

   // Refetch function
   const refetch = useCallback(() => {
      fetchItemList();
   }, [fetchItemList]);

   // Effect for initial fetch
   useEffect(() => {
      fetchItemList();
   }, [fetchItemList]);

   // Memoized return
   return useMemo(() => ({ ...state, refetch }), [state, refetch]);
};
