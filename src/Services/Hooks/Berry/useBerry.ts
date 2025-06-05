import { berryService } from "../../API";
import type { Berry } from "pokenode-ts";
import { useResource } from "./Shared/useResource";
import type { UseResourceReturn } from "./Shared/Types";

// Berry service adapter
const berryResourceService = {
   get: (identifier: string | number) => berryService.getBerry(identifier),
   getList: (offset?: number, limit?: number) =>
      berryService.getBerryList(offset, limit),
};

/**
 * Hook for fetching a single berry by ID or name
 * @param identifier - Berry ID (number) or name (string)
 * @returns Berry data with loading, error states and refetch function
 *
 * @example
 * ```typescript
 * const { data: berry, loading, error, refetch } = useBerry(1);
 * // or
 * const { data: berry, loading, error, refetch } = useBerry('cheri');
 * ```
 */
export const useBerry = (
   identifier?: string | number
): UseResourceReturn<Berry> => {
   return useResource(
      berryResourceService,
      identifier,
      `Failed to fetch berry: ${identifier}`
   );
};
