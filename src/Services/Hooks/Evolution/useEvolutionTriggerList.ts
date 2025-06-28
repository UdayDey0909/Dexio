import { useState, useEffect, useCallback, useMemo } from "react";
import { evolutionService } from "../../API";
import {
   UseEvolutionTriggerListState,
   UseEvolutionTriggerListReturn,
   updateEvolutionTriggerListState,
   handleError,
   useMemoizedPagination,
} from "./Shared/Types";

export const useEvolutionTriggerList = (
   offset: number = 0,
   limit: number = 20
): UseEvolutionTriggerListReturn => {
   const [state, setState] = useState<UseEvolutionTriggerListState>({
      data: [],
      loading: false,
      error: null,
   });

   // Memoize pagination params
   const paginationParams = useMemoizedPagination(offset, limit);

   // Fetch function
   const fetchEvolutionTriggerList = useCallback(async () => {
      updateEvolutionTriggerListState(setState, { loading: true, error: null });

      try {
         const list = await evolutionService.getEvolutionTriggerList(
            paginationParams.offset,
            paginationParams.limit
         );
         updateEvolutionTriggerListState(setState, {
            data: list.results || [],
            loading: false,
         });
      } catch (error) {
         updateEvolutionTriggerListState(setState, {
            data: [],
            loading: false,
            error: handleError(error),
         });
      }
   }, [paginationParams.offset, paginationParams.limit]);

   // Refetch function
   const refetch = useCallback(() => {
      fetchEvolutionTriggerList();
   }, [fetchEvolutionTriggerList]);

   // Effect for initial fetch
   useEffect(() => {
      fetchEvolutionTriggerList();
   }, [fetchEvolutionTriggerList]);

   // Memoized return
   return useMemo(() => ({ ...state, refetch }), [state, refetch]);
};
