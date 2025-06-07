import { useState, useEffect, useCallback, useMemo } from "react";
import { berryService } from "../../API";
import { handleError, updateBerryFirmnessState } from "./Shared/Types";
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

   // Memoize the normalized identifier to prevent unnecessary re-renders
   const normalizedIdentifier = useMemo(() => {
      if (!identifier) return null;
      return typeof identifier === "string"
         ? identifier.toLowerCase().trim()
         : identifier;
   }, [identifier]);

   /**
    * Fetches berry firmness data from the API
    * @param id - The berry firmness identifier (name or ID)
    */
   const fetchBerryFirmness = useCallback(async (id: string | number) => {
      updateBerryFirmnessState(setState, { loading: true, error: null });

      try {
         const firmness = await berryService.getBerryFirmness(id);
         updateBerryFirmnessState(setState, { data: firmness, loading: false });
      } catch (error) {
         updateBerryFirmnessState(setState, {
            data: null,
            loading: false,
            error: handleError(error),
         });
      }
   }, []); // No dependencies as berryService is stable

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

   // Memoize the return object to prevent unnecessary re-renders of consuming components
   return useMemo(
      () => ({
         ...state,
         refetch,
      }),
      [state, refetch]
   );
};
