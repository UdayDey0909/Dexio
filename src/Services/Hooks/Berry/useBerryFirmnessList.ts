import { berryService } from "../../API";
import type { NamedAPIResource } from "pokenode-ts";
import { useResourceList } from "./Shared/useResource";
import type {
   UseResourceListReturn,
   UseResourceListOptions,
} from "./Shared/Types";

// Berry firmness service adapter for list operations
const berryFirmnessResourceService = {
   get: (identifier: string | number) =>
      berryService.getBerryFirmness(identifier),
   getList: (offset?: number, limit?: number) =>
      berryService.getBerryFirmnessList(offset, limit),
};

/**
 * Hook for fetching a paginated list of berry firmnesses
 * @param initialOffset - Starting offset for pagination (default: 0)
 * @param limit - Number of items per page (default: 20)
 * @returns Paginated berry firmness list with loading, error states, loadMore and refresh functions
 *
 * @example
 * ```typescript
 * const {
 *    data: firmnesses,
 *    loading,
 *    error,
 *    hasMore,
 *    loadMore,
 *    refresh
 * } = useBerryFirmnessList(0, 10);
 * ```
 */
export const useBerryFirmnessList = (
   initialOffset: number = 0,
   limit: number = 20
): UseResourceListReturn<NamedAPIResource> => {
   const options: UseResourceListOptions = {
      initialOffset,
      limit,
      autoFetch: true,
   };

   return useResourceList(
      berryFirmnessResourceService,
      options,
      "Failed to fetch berry firmness list"
   );
};
