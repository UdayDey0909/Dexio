import { useState, useEffect, useCallback, useMemo } from "react";
import { berryService } from "../../API";
import { handleError, updateBerryState } from "./Shared/Types";
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

   // Memoize the normalized identifier to prevent unnecessary re-renders
   const normalizedIdentifier = useMemo(() => {
      if (!identifier) return null;
      return typeof identifier === "string"
         ? identifier.toLowerCase().trim()
         : identifier;
   }, [identifier]);

   /**
    * Fetches berry data from the API
    * @param id - The berry identifier (name or ID)
    */
   const fetchBerry = useCallback(async (id: string | number) => {
      updateBerryState(setState, { loading: true, error: null });

      try {
         const berry = await berryService.getBerry(id);
         updateBerryState(setState, { data: berry, loading: false });
      } catch (error) {
         updateBerryState(setState, {
            data: null,
            loading: false,
            error: handleError(error),
         });
      }
   }, []); // No dependencies as berryService is stable

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

   // Memoize the return object to prevent unnecessary re-renders of consuming components
   return useMemo(
      () => ({
         ...state,
         refetch,
      }),
      [state, refetch]
   );
};
