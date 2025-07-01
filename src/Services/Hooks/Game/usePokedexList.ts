import { useState, useEffect, useCallback, useMemo } from "react";
import { gameService } from "../../API";
import type { UsePokedexListState, UsePokedexListReturn } from "./Shared/Types";
import {
   updatePokedexListState,
   handleError,
   useMemoizedPagination,
} from "./Shared/Types";

export const usePokedexList = (
   offset: number = 0,
   limit: number = 20
): UsePokedexListReturn => {
   const [state, setState] = useState<UsePokedexListState>({
      data: [],
      loading: false,
      error: null,
   });

   // Memoize pagination params
   const paginationParams = useMemoizedPagination(offset, limit);

   // Fetch function
   const fetchPokedexList = useCallback(async () => {
      updatePokedexListState(setState, { loading: true, error: null });

      try {
         const list = await gameService.getPokedexList(
            paginationParams.offset,
            paginationParams.limit
         );
         updatePokedexListState(setState, {
            data: list.results || [],
            loading: false,
         });
      } catch (error) {
         updatePokedexListState(setState, {
            data: [],
            loading: false,
            error: handleError(error),
         });
      }
   }, [paginationParams.offset, paginationParams.limit]);

   // Refetch function
   const refetch = useCallback(() => {
      fetchPokedexList();
   }, [fetchPokedexList]);

   // Effect for initial fetch
   useEffect(() => {
      fetchPokedexList();
   }, [fetchPokedexList]);

   // Memoized return
   return useMemo(() => ({ ...state, refetch }), [state, refetch]);
};
