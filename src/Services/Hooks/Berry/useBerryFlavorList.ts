import { useState, useEffect, useCallback, useMemo } from "react";
import { berryService } from "../../API";
import type {
   UseBerryFlavorListState,
   UseBerryFlavorListReturn,
} from "./Shared/Types";
import { handleError, useMemoizedPagination } from "./Shared/Types";

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

   const paginationParams = useMemoizedPagination(offset, limit);

   /**
    * Fetches berry flavor list data from the API
    */
   const fetchBerryFlavorList = useCallback(async () => {
      setState((prev) => ({ ...prev, loading: true, error: null }));

      try {
         const list = await berryService.getBerryFlavorList(
            paginationParams.offset,
            paginationParams.limit
         );
         setState((prev) => ({
            ...prev,
            data: list.results || [],
            loading: false,
         }));
      } catch (error) {
         setState((prev) => ({
            ...prev,
            data: [],
            loading: false,
            error: handleError(error),
         }));
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

   return useMemo(
      () => ({
         ...state,
         refetch,
      }),
      [state, refetch]
   );
};
