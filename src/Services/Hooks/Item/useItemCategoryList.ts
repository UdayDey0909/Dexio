import { useState, useEffect, useCallback, useMemo } from "react";
import { itemService } from "../../API";
import type {
   UseItemCategoryListState,
   UseItemCategoryListReturn,
} from "./Shared/Types";
import {
   handleError,
   updateItemCategoryListState,
   useMemoizedPagination,
} from "./Shared/Types";

export const useItemCategoryList = (
   offset: number = 0,
   limit: number = 20
): UseItemCategoryListReturn => {
   const [state, setState] = useState<UseItemCategoryListState>({
      data: [],
      loading: false,
      error: null,
   });

   // Memoize pagination params
   const paginationParams = useMemoizedPagination(offset, limit);

   // Fetch function
   const fetchItemCategoryList = useCallback(async () => {
      updateItemCategoryListState(setState, { loading: true, error: null });

      try {
         const list = await itemService.getItemCategoryList(
            paginationParams.offset,
            paginationParams.limit
         );
         updateItemCategoryListState(setState, {
            data: list.results || [],
            loading: false,
         });
      } catch (error) {
         updateItemCategoryListState(setState, {
            data: [],
            loading: false,
            error: handleError(error),
         });
      }
   }, [paginationParams.offset, paginationParams.limit]);

   // Refetch function
   const refetch = useCallback(() => {
      fetchItemCategoryList();
   }, [fetchItemCategoryList]);

   // Effect for initial fetch
   useEffect(() => {
      fetchItemCategoryList();
   }, [fetchItemCategoryList]);

   // Memoized return
   return useMemo(() => ({ ...state, refetch }), [state, refetch]);
};
