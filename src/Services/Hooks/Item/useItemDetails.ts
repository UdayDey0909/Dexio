import { useState, useEffect, useCallback, useMemo } from "react";
import { itemService } from "../../API";
import type { UseItemDetailsState, UseItemDetailsReturn } from "./Shared/Types";
import {
   handleError,
   updateItemDetailsState,
   useMemoizedIdentifier,
} from "./Shared/Types";

export const useItemDetails = (name?: string): UseItemDetailsReturn => {
   const [state, setState] = useState<UseItemDetailsState>({
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
   const fetchItemDetails = useCallback(async (itemName: string) => {
      updateItemDetailsState(setState, { loading: true, error: null });

      try {
         const itemDetails = await itemService.getItemDetails(itemName);
         updateItemDetailsState(setState, {
            data: itemDetails,
            loading: false,
         });
      } catch (error) {
         updateItemDetailsState(setState, {
            data: null,
            loading: false,
            error: handleError(error),
         });
      }
   }, []);

   // Refetch function
   const refetch = useCallback(() => {
      if (normalizedName) {
         fetchItemDetails(normalizedName);
      }
   }, [normalizedName, fetchItemDetails]);

   // Effect for initial fetch
   useEffect(() => {
      if (normalizedName) {
         fetchItemDetails(normalizedName);
      }
   }, [normalizedName, fetchItemDetails]);

   // Memoized return
   return useMemo(() => ({ ...state, refetch }), [state, refetch]);
};
