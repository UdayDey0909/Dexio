import { useState, useEffect, useCallback, useMemo } from "react";
import { berryService } from "../../API";
import { handleError, useMemoizedIdentifier } from "./Shared/Types";
import type { UseBerryState, UseBerryReturn } from "./Shared/Types";

/**
 * Custom hook for fetching a single Pokemon berry
 *
 * @param identifier - The berry name (string) or ID (number) to fetch
 * @returns {UseBerryReturn} Object containing berry data, loading state, error, and refetch function
 *
 * @example
 * ```tsx
 * const { data: berry, loading, error, refetch } = useBerry("cheri");
 * const { data: berry2, loading, error, refetch } = useBerry(1);
 * ```
 */
export const useBerry = (identifier?: string | number): UseBerryReturn => {
   const [state, setState] = useState<UseBerryState>({
      data: null,
      loading: false,
      error: null,
   });

   const normalizedIdentifier = useMemoizedIdentifier(identifier);

   /**
    * Fetches berry data from the API
    * @param id - The berry identifier (name or ID)
    */
   const fetchBerry = useCallback(async (id: string | number) => {
      setState((prev) => ({ ...prev, loading: true, error: null }));

      try {
         const berry = await berryService.getBerry(id);
         setState((prev) => ({ ...prev, data: berry, loading: false }));
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
    * Refetches the current berry data
    */
   const refetch = useCallback(() => {
      if (normalizedIdentifier) {
         fetchBerry(normalizedIdentifier);
      }
   }, [normalizedIdentifier, fetchBerry]);

   useEffect(() => {
      if (normalizedIdentifier) {
         fetchBerry(normalizedIdentifier);
      }
   }, [normalizedIdentifier, fetchBerry]);

   return useMemo(
      () => ({
         ...state,
         refetch,
      }),
      [state, refetch]
   );
};
