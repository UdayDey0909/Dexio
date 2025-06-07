import { useState, useEffect, useCallback, useMemo } from "react";
import { berryService } from "../../API";
import type {
   UseBerryFlavorListState,
   UseBerryFlavorListReturn,
} from "./Shared/Types";
import { handleError, updateBerryFlavorListState } from "./Shared/Types";

/**
 * Custom hook for fetching a paginated list of Pokemon berry flavors
 *
 * @param offset - The number of berry flavors to skip (for pagination). Default: 0
 * @param limit - The maximum number of berry flavors to fetch. Default: 20, Max: 1000
 * @returns {UseBerryFlavorListReturn} Object containing berry flavor list data, loading state, error, and refetch function
 *
 * @example
 * ```tsx
 * // Get first 20 berry flavors
 * const { data: flavors, loading, error, refetch } = useBerryFlavorList();
 *
 * // Get berry flavors 20-39 (second page)
 * const { data: flavors, loading, error, refetch } = useBerryFlavorList(20, 20);
 *
 * // Get first 50 berry flavors
 * const { data: flavors, loading, error, refetch } = useBerryFlavorList(0, 50);
 * ```
 */
export const useBerryFlavorList = (
   offset: number = 0,
   limit: number = 20
): UseBerryFlavorListReturn => {
   const [state, setState] = useState<UseBerryFlavorListState>({
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
    * Fetches berry flavor list data from the API
    */
   const fetchBerryFlavorList = useCallback(async () => {
      updateBerryFlavorListState(setState, { loading: true, error: null });

      try {
         const list = await berryService.getBerryFlavorList(
            paginationParams.offset,
            paginationParams.limit
         );
         updateBerryFlavorListState(setState, {
            data: list.results || [],
            loading: false,
         });
      } catch (error) {
         updateBerryFlavorListState(setState, {
            data: [],
            loading: false,
            error: handleError(error),
         });
      }
   }, [paginationParams.offset, paginationParams.limit]);

   /**
    * Refetches the current berry flavor list with same pagination parameters
    */
   const refetch = useCallback(() => {
      fetchBerryFlavorList();
   }, [fetchBerryFlavorList]);

   useEffect(() => {
      fetchBerryFlavorList();
   }, [fetchBerryFlavorList]);

   // Memoize the return object to prevent unnecessary re-renders of consuming components
   return useMemo(
      () => ({
         ...state,
         refetch,
      }),
      [state, refetch]
   );
};
