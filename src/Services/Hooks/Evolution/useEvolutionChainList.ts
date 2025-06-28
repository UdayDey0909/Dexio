import { useState, useEffect, useCallback, useMemo } from "react";
import { evolutionService } from "../../API";
import {
   UseEvolutionChainListState,
   UseEvolutionChainListReturn,
   updateEvolutionChainListState,
   handleError,
   useMemoizedPagination,
} from "./Shared/Types";

export const useEvolutionChainList = (
   offset: number = 0,
   limit: number = 20
): UseEvolutionChainListReturn => {
   const [state, setState] = useState<UseEvolutionChainListState>({
      data: [],
      loading: false,
      error: null,
   });

   // Memoize pagination params
   const paginationParams = useMemoizedPagination(offset, limit);

   // Fetch function
   const fetchEvolutionChainList = useCallback(async () => {
      updateEvolutionChainListState(setState, { loading: true, error: null });

      try {
         const list = await evolutionService.getEvolutionChainList(
            paginationParams.offset,
            paginationParams.limit
         );
         updateEvolutionChainListState(setState, {
            data: list.results || [],
            loading: false,
         });
      } catch (error) {
         updateEvolutionChainListState(setState, {
            data: [],
            loading: false,
            error: handleError(error),
         });
      }
   }, [paginationParams.offset, paginationParams.limit]);

   // Refetch function
   const refetch = useCallback(() => {
      fetchEvolutionChainList();
   }, [fetchEvolutionChainList]);

   // Effect for initial fetch
   useEffect(() => {
      fetchEvolutionChainList();
   }, [fetchEvolutionChainList]);

   // Memoized return
   return useMemo(() => ({ ...state, refetch }), [state, refetch]);
};
