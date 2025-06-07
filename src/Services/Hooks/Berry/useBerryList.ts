import { useState, useEffect, useCallback, useMemo } from "react";
import { berryService } from "../../API";
import type { UseBerryListState, UseBerryListReturn } from "./Shared/Types";
import { handleError, updateBerryListState } from "./Shared/Types";

/**
 * Custom hook for fetching a paginated list of Pokemon berries
 *
 * @param offset - The number of berries to skip (for pagination). Default: 0
 * @param limit - The maximum number of berries to fetch. Default: 20, Max: 1000
 * @returns {UseBerryListReturn} Object containing berry list data, loading state, error, and refetch function
 *
 * @example
 * ```tsx
 * // Get first 20 berries
 * const { data: berries, loading, error, refetch } = useBerryList();
 *
 * // Get berries 20-39 (second page)
 * const { data: berries, loading, error, refetch } = useBerryList(20, 20);
 *
 * // Get first 50 berries
 * const { data: berries, loading, error, refetch } = useBerryList(0, 50);
 * ```
 */
export const useBerryList = (
   offset: number = 0,
   limit: number = 20
): UseBerryListReturn => {
   const [state, setState] = useState<UseBerryListState>({
      data: [],
      loading: false,
      error: null,
   });

   // Memoize pagination params to prevent unnecessary API calls
   // Ensures offset is non-negative and limit is within reasonable bounds
   const paginationParams = useMemo(
      () => ({
         offset: Math.max(0, offset),
         limit: Math.min(Math.max(1, limit), 1000), // Min: 1, Max: 1000
      }),
      [offset, limit]
   );

   /**
    * Fetches berry list data from the API
    */
   const fetchBerryList = useCallback(async () => {
      updateBerryListState(setState, { loading: true, error: null });

      try {
         const list = await berryService.getBerryList(
            paginationParams.offset,
            paginationParams.limit
         );
         updateBerryListState(setState, {
            data: list.results || [],
            loading: false,
         });
      } catch (error) {
         updateBerryListState(setState, {
            data: [],
            loading: false,
            error: handleError(error),
         });
      }
   }, [paginationParams.offset, paginationParams.limit]);

   /**
    * Refetches the current berry list with same pagination parameters
    */
   const refetch = useCallback(() => {
      fetchBerryList();
   }, [fetchBerryList]);

   useEffect(() => {
      fetchBerryList();
   }, [fetchBerryList]);

   // Memoize the return object to prevent unnecessary re-renders of consuming components
   return useMemo(
      () => ({
         ...state,
         refetch,
      }),
      [state, refetch]
   );
};
