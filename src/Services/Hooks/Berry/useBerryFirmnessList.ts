import { useState, useEffect, useCallback, useMemo } from "react";
import { berryService } from "../../API";
import type {
   UseBerryFirmnessListState,
   UseBerryFirmnessListReturn,
} from "./Shared/Types";
import { handleError, useMemoizedPagination } from "./Shared/Types";

/**
 * Custom hook for fetching a paginated list of Pokemon berry firmnesses
 *
 * @param offset - The number of berry firmnesses to skip (for pagination). Default: 0
 * @param limit - The maximum number of berry firmnesses to fetch. Default: 20, Max: 1000
 * @returns {UseBerryFirmnessListReturn} Object containing berry firmness list data, loading state, error, and refetch function
 *
 * @example
 * ```tsx
 * // Get first 20 berry firmnesses
 * const { data: firmnesses, loading, error, refetch } = useBerryFirmnessList();
 *
 * // Get berry firmnesses 20-39 (second page)
 * const { data: firmnesses, loading, error, refetch } = useBerryFirmnessList(20, 20);
 *
 * // Get first 50 berry firmnesses
 * const { data: firmnesses, loading, error, refetch } = useBerryFirmnessList(0, 50);
 * ```
 */
export const useBerryFirmnessList = (
   offset: number = 0,
   limit: number = 20
): UseBerryFirmnessListReturn => {
   const [state, setState] = useState<UseBerryFirmnessListState>({
      data: [],
      loading: false,
      error: null,
   });

   const paginationParams = useMemoizedPagination(offset, limit);

   /**
    * Fetches berry firmness list data from the API
    */
   const fetchBerryFirmnessList = useCallback(async () => {
      setState((prev) => ({ ...prev, loading: true, error: null }));

      try {
         const list = await berryService.getBerryFirmnessList(
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
    * Refetches the current berry firmness list with same pagination parameters
    */
   const refetch = useCallback(() => {
      fetchBerryFirmnessList();
   }, [fetchBerryFirmnessList]);

   useEffect(() => {
      fetchBerryFirmnessList();
   }, [fetchBerryFirmnessList]);

   return useMemo(
      () => ({
         ...state,
         refetch,
      }),
      [state, refetch]
   );
};
