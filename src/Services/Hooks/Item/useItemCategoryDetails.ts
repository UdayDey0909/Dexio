import { useState, useEffect, useCallback, useMemo } from "react";
import { itemService } from "../../API";
import type {
   UseItemCategoryDetailsState,
   UseItemCategoryDetailsReturn,
} from "./Shared/Types";
import {
   handleError,
   updateItemCategoryDetailsState,
   useMemoizedIdentifier,
} from "./Shared/Types";

export const useItemCategoryDetails = (
   name?: string
): UseItemCategoryDetailsReturn => {
   const [state, setState] = useState<UseItemCategoryDetailsState>({
      data: null,
      loading: false,
      error: null,
   });

   // Memoize normalized identifier (only string for details)
   const normalizedName = useMemo(() => {
      if (!name || typeof name !== "string") return null;
      return name.toLowerCase().trim();
   }, [name]);

   // Fetch function
   const fetchItemCategoryDetails = useCallback(
      async (categoryName: string) => {
         updateItemCategoryDetailsState(setState, {
            loading: true,
            error: null,
         });

         try {
            const categoryDetails = await itemService.getItemCategoryDetails(
               categoryName
            );
            updateItemCategoryDetailsState(setState, {
               data: categoryDetails,
               loading: false,
            });
         } catch (error) {
            updateItemCategoryDetailsState(setState, {
               data: null,
               loading: false,
               error: handleError(error),
            });
         }
      },
      []
   );

   // Refetch function
   const refetch = useCallback(() => {
      if (normalizedName) {
         fetchItemCategoryDetails(normalizedName);
      }
   }, [normalizedName, fetchItemCategoryDetails]);

   // Effect for initial fetch
   useEffect(() => {
      if (normalizedName) {
         fetchItemCategoryDetails(normalizedName);
      }
   }, [normalizedName, fetchItemCategoryDetails]);

   // Memoized return
   return useMemo(() => ({ ...state, refetch }), [state, refetch]);
};
