import { useState, useEffect, useCallback, useMemo } from "react";
import { berryService } from "../../API";
import { handleError, useMemoizedIdentifier } from "./Shared/Types";
import type { UseBerryFlavorState, UseBerryFlavorReturn } from "./Shared/Types";

/**
 * Custom hook for fetching a single Pokemon berry flavor
 *
 * @param identifier - The berry flavor name (string) or ID (number) to fetch
 * @returns {UseBerryFlavorReturn} Object containing berry flavor data, loading state, error, and refetch function
 *
 * @example
 * ```tsx
 * const { data: flavor, loading, error, refetch } = useBerryFlavor("spicy");
 * const { data: flavor2, loading, error, refetch } = useBerryFlavor(1);
 * ```
 */
export const useBerryFlavor = (
   identifier?: string | number
): UseBerryFlavorReturn => {
   const [state, setState] = useState<UseBerryFlavorState>({
      data: null,
      loading: false,
      error: null,
   });

   const normalizedIdentifier = useMemoizedIdentifier(identifier);

   /**
    * Fetches berry flavor data from the API
    * @param id - The berry flavor identifier (name or ID)
    */
   const fetchBerryFlavor = useCallback(async (id: string | number) => {
      setState((prev) => ({ ...prev, loading: true, error: null }));

      try {
         const flavor = await berryService.getBerryFlavor(id);
         setState((prev) => ({ ...prev, data: flavor, loading: false }));
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
    * Refetches the current berry flavor data
    */
   const refetch = useCallback(() => {
      if (normalizedIdentifier) {
         fetchBerryFlavor(normalizedIdentifier);
      }
   }, [normalizedIdentifier, fetchBerryFlavor]);

   useEffect(() => {
      if (normalizedIdentifier) {
         fetchBerryFlavor(normalizedIdentifier);
      }
   }, [normalizedIdentifier, fetchBerryFlavor]);

   return useMemo(
      () => ({
         ...state,
         refetch,
      }),
      [state, refetch]
   );
};
