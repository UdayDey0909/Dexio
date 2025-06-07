import { useState, useEffect, useCallback, useMemo } from "react";
import { berryService } from "../../API";
import type {
   UseBerriesByFlavorState,
   UseBerriesByFlavorReturn,
} from "./Shared/Types";
import { handleError, updateBerriesByFlavorState } from "./Shared/Types";

/**
 * Custom hook for fetching berries by flavor name
 *
 * @param flavorName - The name of the berry flavor to search for
 * @returns {UseBerriesByFlavorReturn} Object containing berries data, loading state, error, and refetch function
 *
 * @example
 * ```tsx
 * const { data: sweetBerries, loading, error, refetch } = useBerriesByFlavor("sweet");
 * const { data: spicyBerries, loading, error, refetch } = useBerriesByFlavor("spicy");
 * ```
 */
export const useBerriesByFlavor = (
   flavorName?: string
): UseBerriesByFlavorReturn => {
   const [state, setState] = useState<UseBerriesByFlavorState>({
      data: null,
      loading: false,
      error: null,
   });

   // Memoize normalized flavor name to prevent unnecessary re-renders
   const normalizedFlavorName = useMemo(() => {
      return flavorName?.toLowerCase().trim() || null;
   }, [flavorName]);

   /**
    * Fetches berries by flavor data from the API
    * @param name - The flavor name to fetch berries for
    */
   const fetchBerriesByFlavor = useCallback(async (name: string) => {
      updateBerriesByFlavorState(setState, { loading: true, error: null });

      try {
         const berries = await berryService.getBerriesByFlavor(name);
         const namedBerries = berries.map((berry) => ({
            name: berry.berry.name,
            url: berry.berry.url,
         }));
         updateBerriesByFlavorState(setState, {
            data: namedBerries,
            loading: false,
         });
      } catch (error) {
         updateBerriesByFlavorState(setState, {
            data: null,
            loading: false,
            error: handleError(error),
         });
      }
   }, []); // No dependencies as berryService is stable

   /**
    * Refetches the current berries by flavor data
    */
   const refetch = useCallback(() => {
      if (normalizedFlavorName) {
         fetchBerriesByFlavor(normalizedFlavorName);
      }
   }, [normalizedFlavorName, fetchBerriesByFlavor]);

   useEffect(() => {
      if (normalizedFlavorName) {
         fetchBerriesByFlavor(normalizedFlavorName);
      }
   }, [normalizedFlavorName, fetchBerriesByFlavor]);

   // Memoize the return object to prevent unnecessary re-renders of consuming components
   return useMemo(
      () => ({
         ...state,
         refetch,
      }),
      [state, refetch]
   );
};
