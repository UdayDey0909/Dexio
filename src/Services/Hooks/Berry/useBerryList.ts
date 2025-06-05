// src/Services/Hooks/Berry/useBerryList.ts
import { berryService } from "../../API";
import type { NamedAPIResource } from "pokenode-ts";
import { useResourceList } from "./Shared/useResource";
import type {
   UseResourceListReturn,
   UseResourceListOptions,
} from "./Shared/Types";

// Berry service adapter for list operations
const berryResourceService = {
   get: (identifier: string | number) => berryService.getBerry(identifier),
   getList: (offset?: number, limit?: number) =>
      berryService.getBerryList(offset, limit),
};

/**
 * Hook for fetching a paginated list of berries
 * @param initialOffset - Starting offset for pagination (default: 0)
 * @param limit - Number of items per page (default: 20)
 * @returns Paginated berry list with loading, error states, loadMore and refresh functions
 *
 * @example
 * ```typescript
 * const {
 *    data: berries,
 *    loading,
 *    error,
 *    hasMore,
 *    loadMore,
 *    refresh
 * } = useBerryList(0, 10);
 * ```
 */
export const useBerryList = (
   initialOffset: number = 0,
   limit: number = 20
): UseResourceListReturn<NamedAPIResource> => {
   const options: UseResourceListOptions = {
      initialOffset,
      limit,
      autoFetch: true,
   };

   return useResourceList(
      berryResourceService,
      options,
      "Failed to fetch berry list"
   );
};
