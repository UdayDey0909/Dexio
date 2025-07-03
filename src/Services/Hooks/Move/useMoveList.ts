// src/Services/Hooks/Move/useMoveList.ts
import { useState, useEffect, useCallback, useMemo } from "react";
import { moveService } from "../../API";
import type { UseMoveListState, UseMoveListReturn } from "./Shared/Types";
import {
   handleError,
   updateMoveListState,
   useMemoizedPagination,
   createInitialMoveListState,
} from "./Shared/Types";

export const useMoveList = (
   offset: number = 0,
   limit: number = 20
): UseMoveListReturn => {
   const [state, setState] = useState<UseMoveListState>(
      createInitialMoveListState()
   );
   const [currentOffset, setCurrentOffset] = useState(offset);

   // Memoize pagination params
   const paginationParams = useMemoizedPagination(currentOffset, limit);

   // Fetch function
   const fetchMoveList = useCallback(
      async (isLoadMore: boolean = false) => {
         updateMoveListState(setState, { loading: true, error: null });

         try {
            const moveList = await moveService.getMoveList(
               paginationParams.offset,
               paginationParams.limit
            );

            if (isLoadMore) {
               // For load more, we need to use the functional update pattern
               setState((prev) => ({
                  ...prev,
                  data: [...(prev.data || []), ...(moveList.results || [])],
                  loading: false,
                  hasMore: moveList.next !== null,
               }));
            } else {
               // For initial load, use the direct update
               updateMoveListState(setState, {
                  data: moveList.results || [],
                  loading: false,
                  hasMore: moveList.next !== null,
               });
            }
         } catch (error) {
            updateMoveListState(setState, {
               data: isLoadMore ? undefined : [],
               loading: false,
               error: handleError(error),
            });
         }
      },
      [paginationParams.offset, paginationParams.limit]
   );

   // Load more function
   const loadMore = useCallback(() => {
      if (state.hasMore && !state.loading) {
         const newOffset = currentOffset + paginationParams.limit;
         setCurrentOffset(newOffset);
      }
   }, [state.hasMore, state.loading, currentOffset, paginationParams.limit]);

   // Refetch function
   const refetch = useCallback(() => {
      setCurrentOffset(offset);
      fetchMoveList(false);
   }, [offset, fetchMoveList]);

   // Effect for initial fetch
   useEffect(() => {
      fetchMoveList(false);
   }, [fetchMoveList]);

   // Effect for load more
   useEffect(() => {
      if (currentOffset > offset) {
         fetchMoveList(true);
      }
   }, [currentOffset, offset, fetchMoveList]);

   // Memoized return
   return useMemo(
      () => ({
         ...state,
         refetch,
         loadMore,
      }),
      [state, refetch, loadMore]
   );
};
