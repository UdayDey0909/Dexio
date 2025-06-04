import { useState, useEffect, useCallback, useMemo } from "react";
import { abilityService } from "../../API";
import type { UseAbilityListState, UseAbilityListReturn } from "./Shared/Types";
import { handleError, updateAbilityListState } from "./Shared/Types";

/**
 * Custom hook for fetching a paginated list of Pokemon abilities
 *
 * @param offset - The number of abilities to skip (for pagination). Default: 0
 * @param limit - The maximum number of abilities to fetch. Default: 20, Max: 1000
 * @returns {UseAbilityListReturn} Object containing ability list data, loading state, error, and refetch function
 *
 * @example
 * ```tsx
 * Get first 20 abilities
 * const { data: abilities, loading, error, refetch } = useAbilityList();
 *
 * Get abilities 20-39 (second page)
 * const { data: abilities, loading, error, refetch } = useAbilityList(20, 20);
 *
 * Get first 50 abilities
 * const { data: abilities, loading, error, refetch } = useAbilityList(0, 50);
 * ```
 */
export const useAbilityList = (
   offset: number = 0,
   limit: number = 20
): UseAbilityListReturn => {
   const [state, setState] = useState<UseAbilityListState>({
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
    * Fetches ability list data from the API
    */
   const fetchAbilityList = useCallback(async () => {
      updateAbilityListState(setState, { loading: true, error: null });

      try {
         const list = await abilityService.getAbilityList(
            paginationParams.offset,
            paginationParams.limit
         );
         updateAbilityListState(setState, {
            data: list.results || [],
            loading: false,
         });
      } catch (error) {
         updateAbilityListState(setState, {
            data: [],
            loading: false,
            error: handleError(error),
         });
      }
   }, [paginationParams.offset, paginationParams.limit]);

   /**
    * Refetches the current ability list with same pagination parameters
    */
   const refetch = useCallback(() => {
      fetchAbilityList();
   }, [fetchAbilityList]);

   useEffect(() => {
      fetchAbilityList();
   }, [fetchAbilityList]);

   // Memoize the return object to prevent unnecessary re-renders of consuming components
   return useMemo(
      () => ({
         ...state,
         refetch,
      }),
      [state, refetch]
   );
};
