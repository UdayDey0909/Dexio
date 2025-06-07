import { useState, useEffect, useCallback, useMemo } from "react";
import { berryService } from "../../API";
import type {
   UseBerryFirmnessListState,
   UseBerryFirmnessListReturn,
} from "./Shared/Types";
import { handleError, updateBerryFirmnessListState } from "./Shared/Types";

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
    * Fetches berry firmness list data from the API
    */
   const fetchBerryFirmnessList = useCallback(async () => {
      updateBerryFirmnessListState(setState, { loading: true, error: null });

      try {
         const list = await berryService.getBerryFirmnessList(
            paginationParams.offset,
            paginationParams.limit
         );
         updateBerryFirmnessListState(setState, {
            data: list.results || [],
            loading: false,
         });
      } catch (error) {
         updateBerryFirmnessListState(setState, {
            data: [],
            loading: false,
            error: handleError(error),
         });
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

   // Memoize the return object to prevent unnecessary re-renders of consuming components
   return useMemo(
      () => ({
         ...state,
         refetch,
      }),
      [state, refetch]
   );
};
