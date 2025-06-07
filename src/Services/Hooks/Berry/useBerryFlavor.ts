import { useState, useEffect, useCallback, useMemo } from "react";
import { berryService } from "../../API";
import { handleError, updateBerryFlavorState } from "./Shared/Types";
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

   // Memoize the normalized identifier to prevent unnecessary re-renders
   const normalizedIdentifier = useMemo(() => {
      if (!identifier) return null;
      return typeof identifier === "string"
         ? identifier.toLowerCase().trim()
         : identifier;
   }, [identifier]);

   /**
    * Fetches berry flavor data from the API
    * @param id - The berry flavor identifier (name or ID)
    */
   const fetchBerryFlavor = useCallback(async (id: string | number) => {
      updateBerryFlavorState(setState, { loading: true, error: null });

      try {
         const flavor = await berryService.getBerryFlavor(id);
         updateBerryFlavorState(setState, { data: flavor, loading: false });
      } catch (error) {
         updateBerryFlavorState(setState, {
            data: null,
            loading: false,
            error: handleError(error),
         });
      }
   }, []); // No dependencies as berryService is stable

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

   // Memoize the return object to prevent unnecessary re-renders of consuming components
   return useMemo(
      () => ({
         ...state,
         refetch,
      }),
      [state, refetch]
   );
};
