import { useState, useEffect, useCallback, useMemo } from "react";
import { itemService } from "../../API";
import type {
   UseItemCategoryState,
   UseItemCategoryReturn,
} from "./Shared/Types";
import {
   handleError,
   updateItemCategoryState,
   useMemoizedIdentifier,
} from "./Shared/Types";

export const useItemCategory = (
   identifier?: string | number
): UseItemCategoryReturn => {
   const [state, setState] = useState<UseItemCategoryState>({
      data: null,
      loading: false,
      error: null,
   });

   // Memoize normalized identifier
   const normalizedIdentifier = useMemoizedIdentifier(identifier);

   // Fetch function
   const fetchItemCategory = useCallback(async (id: string | number) => {
      updateItemCategoryState(setState, { loading: true, error: null });

      try {
         const category = await itemService.getItemCategory(id);
         updateItemCategoryState(setState, { data: category, loading: false });
      } catch (error) {
         updateItemCategoryState(setState, {
            data: null,
            loading: false,
            error: handleError(error),
         });
      }
   }, []);

   // Refetch function
   const refetch = useCallback(() => {
      if (normalizedIdentifier) {
         fetchItemCategory(normalizedIdentifier);
      }
   }, [normalizedIdentifier, fetchItemCategory]);

   // Effect for initial fetch
   useEffect(() => {
      if (normalizedIdentifier) {
         fetchItemCategory(normalizedIdentifier);
      }
   }, [normalizedIdentifier, fetchItemCategory]);

   // Memoized return
   return useMemo(() => ({ ...state, refetch }), [state, refetch]);
};
