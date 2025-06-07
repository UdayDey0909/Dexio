import { useState, useEffect, useCallback, useMemo } from "react";
import { berryService } from "../../API";
import type {
   UseBerriesByFlavorState,
   UseBerriesByFlavorReturn,
} from "./Shared/Types";
import { handleError, useMemoizedIdentifier } from "./Shared/Types";

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

   const normalizedFlavorName = useMemoizedIdentifier(flavorName);

   /**
    * Fetches berries by flavor data from the API
    * @param name - The flavor name to fetch berries for
    */
   const fetchBerriesByFlavor = useCallback(async (name: string | number) => {
      setState((prev) => ({ ...prev, loading: true, error: null }));

      try {
         const berries = await berryService.getBerriesByFlavor(String(name));
         const namedBerries = berries.map((berry) => ({
            name: berry.berry.name,
            url: berry.berry.url,
         }));
         setState((prev) => ({
            ...prev,
            data: namedBerries,
            loading: false,
         }));
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

   return useMemo(
      () => ({
         ...state,
         refetch,
      }),
      [state, refetch]
   );
};
