import { useState, useEffect, useCallback, useMemo } from "react";
import { berryService } from "../../API";
import { handleError, useMemoizedIdentifier } from "./Shared/Types";
import type {
   UseBerryFirmnessState,
   UseBerryFirmnessReturn,
} from "./Shared/Types";

/**
 * Custom hook for fetching a single Pokemon berry firmness
 *
 * @param identifier - The berry firmness name (string) or ID (number) to fetch
 * @returns {UseBerryFirmnessReturn} Object containing berry firmness data, loading state, error, and refetch function
 *
 * @example
 * ```tsx
 * const { data: firmness, loading, error, refetch } = useBerryFirmness("very-soft");
 * const { data: firmness2, loading, error, refetch } = useBerryFirmness(1);
 * ```
 */
export const useBerryFirmness = (
   identifier?: string | number
): UseBerryFirmnessReturn => {
   const [state, setState] = useState<UseBerryFirmnessState>({
      data: null,
      loading: false,
      error: null,
   });

   const normalizedIdentifier = useMemoizedIdentifier(identifier);

   /**
    * Fetches berry firmness data from the API
    * @param id - The berry firmness identifier (name or ID)
    */
   const fetchBerryFirmness = useCallback(async (id: string | number) => {
      setState((prev) => ({ ...prev, loading: true, error: null }));

      try {
         const firmness = await berryService.getBerryFirmness(id);
         setState((prev) => ({ ...prev, data: firmness, loading: false }));
      } catch (error) {
         setState((prev) => ({
            ...prev,
            data: null,
            loading: false,
            error: handleError(error),
         }));
      }
   }, []);

   /**
    * Refetches the current berry firmness data
    */
   const refetch = useCallback(() => {
      if (normalizedIdentifier) {
         fetchBerryFirmness(normalizedIdentifier);
      }
   }, [normalizedIdentifier, fetchBerryFirmness]);

   useEffect(() => {
      if (normalizedIdentifier) {
         fetchBerryFirmness(normalizedIdentifier);
      }
   }, [normalizedIdentifier, fetchBerryFirmness]);

   return useMemo(
      () => ({
         ...state,
         refetch,
      }),
      [state, refetch]
   );
};
