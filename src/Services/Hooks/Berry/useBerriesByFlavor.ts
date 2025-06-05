
import { berryService } from "../../API";
import type { NamedAPIResource } from "pokenode-ts";
import { useCustomResource } from "./Shared/useResource";
import type { UseResourceReturn } from "./Shared/Types";

/**
 * Hook for fetching berries by flavor name
 * @param flavorName - The name of the berry flavor to search for
 * @returns Array of berries with the specified flavor, along with loading, error states and refetch function
 * 
 * @example
 * ```typescript
 * const { data: sweetBerries, loading, error, refetch } = useBerriesByFlavor('sweet');
 * ```
 */
export const useBerriesByFlavor = (flavorName?: string): UseResourceReturn<NamedAPIResource[]> => {
   const fetchBerriesByFlavor = async () => {
      if (!flavorName) {
         throw new Error("Flavor name is required");
      }
      return berryService.getBerriesByFlavor(flavorName);
   };

   return useCustomResource(
      fetchBerriesByFlavor,
      [flavorName],
      `Failed to fetch berries by flavor: ${flavorName}`
   );
};