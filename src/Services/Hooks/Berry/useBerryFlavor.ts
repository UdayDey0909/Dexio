import { berryService } from "../../API";
import type { BerryFlavor } from "pokenode-ts";
import { useResource } from "./Shared/useResource";
import type { UseResourceReturn } from "./Shared/Types";

// Berry flavor service adapter
const berryFlavorResourceService = {
   get: (identifier: string | number) =>
      berryService.getBerryFlavor(identifier),
   getList: (offset?: number, limit?: number) =>
      berryService.getBerryFlavorList(offset, limit),
};

/**
 * Hook for fetching berry flavor by ID or name
 * @param identifier - Berry flavor ID (number) or name (string)
 * @returns Berry flavor data with loading, error states and refetch function
 *
 * @example
 * ```typescript
 * const { data: flavor, loading, error, refetch } = useBerryFlavor(1);
 * // or
 * const { data: flavor, loading, error, refetch } = useBerryFlavor('spicy');
 * ```
 */
export const useBerryFlavor = (
   identifier?: string | number
): UseResourceReturn<BerryFlavor> => {
   return useResource(
      berryFlavorResourceService,
      identifier,
      `Failed to fetch berry flavor: ${identifier}`
   );
};
