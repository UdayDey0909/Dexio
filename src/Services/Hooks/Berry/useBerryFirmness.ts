import { berryService } from "../../API";
import type { BerryFirmness } from "pokenode-ts";
import { useResource } from "./Shared/useResource";
import type { UseResourceReturn } from "./Shared/Types";

// Berry firmness service adapter
const berryFirmnessResourceService = {
   get: (identifier: string | number) =>
      berryService.getBerryFirmness(identifier),
   getList: (offset?: number, limit?: number) =>
      berryService.getBerryFirmnessList(offset, limit),
};

/**
 * Hook for fetching berry firmness by ID or name
 * @param identifier - Berry firmness ID (number) or name (string)
 * @returns Berry firmness data with loading, error states and refetch function
 *
 * @example
 * ```typescript
 * const { data: firmness, loading, error, refetch } = useBerryFirmness(1);
 * // or
 * const { data: firmness, loading, error, refetch } = useBerryFirmness('very-soft');
 * ```
 */
export const useBerryFirmness = (
   identifier?: string | number
): UseResourceReturn<BerryFirmness> => {
   return useResource(
      berryFirmnessResourceService,
      identifier,
      `Failed to fetch berry firmness: ${identifier}`
   );
};
