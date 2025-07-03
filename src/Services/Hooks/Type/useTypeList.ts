import { useState, useEffect, useCallback, useMemo } from "react";
import { typeService } from "../../API";
import {
   UseTypeListState,
   UseTypeListReturn,
   handleError,
   updateTypeListState,
   useMemoizedPagination,
} from "./Shared/Types";

export const useTypeList = (
   offset: number = 0,
   limit: number = 20
): UseTypeListReturn => {
   const [state, setState] = useState<UseTypeListState>({
      data: [],
      loading: false,
      error: null,
   });

   // Memoize pagination parameters
   const { offset: normalizedOffset, limit: normalizedLimit } =
      useMemoizedPagination(offset, limit);

   // Fetch function
   const fetchTypeList = useCallback(async (off: number, lim: number) => {
      updateTypeListState(setState, { loading: true, error: null });

      try {
         const result = await typeService.getTypeList(off, lim);
         updateTypeListState(setState, {
            data: result.results,
            loading: false,
         });
      } catch (error) {
         updateTypeListState(setState, {
            data: [],
            loading: false,
            error: handleError(error),
         });
      }
   }, []);

   // Refetch function
   const refetch = useCallback(() => {
      fetchTypeList(normalizedOffset, normalizedLimit);
   }, [normalizedOffset, normalizedLimit, fetchTypeList]);

   // Effect for initial fetch
   useEffect(() => {
      fetchTypeList(normalizedOffset, normalizedLimit);
   }, [normalizedOffset, normalizedLimit, fetchTypeList]);

   // Memoized return
   return useMemo(() => ({ ...state, refetch }), [state, refetch]);
};
