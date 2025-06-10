import { useState, useEffect, useCallback, useMemo } from "react";
import { encounterService } from "../../API";
import type {
   UseEncounterListState,
   UseEncounterListReturn,
} from "./Shared/Types";
import {
   handleError,
   updateEncounterListState,
   useMemoizedPagination,
} from "./Shared/Types";

export const useEncounterConditionList = (
   offset: number = 0,
   limit: number = 20
): UseEncounterListReturn => {
   const [state, setState] = useState<UseEncounterListState>({
      data: [],
      loading: false,
      error: null,
   });

   // Memoize pagination params
   const paginationParams = useMemoizedPagination(offset, limit);

   // Fetch function
   const fetchEncounterConditionList = useCallback(async () => {
      updateEncounterListState(setState, { loading: true, error: null });

      try {
         const list = await encounterService.getEncounterConditionList(
            paginationParams.offset,
            paginationParams.limit
         );
         updateEncounterListState(setState, {
            data: list.results || [],
            loading: false,
         });
      } catch (error) {
         updateEncounterListState(setState, {
            data: [],
            loading: false,
            error: handleError(error),
         });
      }
   }, [paginationParams.offset, paginationParams.limit]);

   // Refetch function
   const refetch = useCallback(() => {
      fetchEncounterConditionList();
   }, [fetchEncounterConditionList]);

   // Effect for initial fetch
   useEffect(() => {
      fetchEncounterConditionList();
   }, [fetchEncounterConditionList]);

   // Memoized return
   return useMemo(() => ({ ...state, refetch }), [state, refetch]);
};
