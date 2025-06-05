import { berryService } from "../../API";
import type { NamedAPIResource } from "pokenode-ts";
import { useResourceList } from "./Shared/useResource";
import type {
   UseResourceListReturn,
   UseResourceListOptions,
} from "./Shared/Types";

// Berry flavor service adapter for list operations
const berryFlavorResourceService = {
   get: (identifier: string | number) =>
      berryService.getBerryFlavor(identifier),
   getList: (offset?: number, limit?: number) =>
      berryService.getBerryFlavorList(offset, limit),
};

/**
 * Hook for fetching a paginated list of berry flavors
 * @param initialOffset - Starting offset for pagination (default: 0)
 * @param limit - Number of items per page (default: 20)
 * @returns Paginated berry flavor list with loading, error states, loadMore and refresh functions
 *
 * @example
 * ```typescript
 * const {
 *    data: flavors,
 *    loading,
 *    error,
 *    hasMore,
 *    loadMore,
 *    refresh
 * } = useBerryFlavorList(0, 10);
 * ```
 */
export const useBerryFlavorList = (
   initialOffset: number = 0,
   limit: number = 20
): UseResourceListReturn<NamedAPIResource> => {
   const options: UseResourceListOptions = {
      initialOffset,
      limit,
      autoFetch: true,
   };

   return useResourceList(
      berryFlavorResourceService,
      options,
      "Failed to fetch berry flavor list"
   );
};
