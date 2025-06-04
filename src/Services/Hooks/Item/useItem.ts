import { useState, useEffect, useCallback } from "react";
import { Item, ItemCategory } from "pokenode-ts";
import { itemService } from "../../API";

interface UseItemState {
   data: Item | null;
   loading: boolean;
   error: string | null;
}

interface UseItemListState {
   data: Item[] | null;
   loading: boolean;
   error: string | null;
}

interface UseItemCategoryState {
   data: ItemCategory | null;
   loading: boolean;
   error: string | null;
}

// Hook for getting a single item
export const useItem = (identifier?: string | number) => {
   const [state, setState] = useState<UseItemState>({
      data: null,
      loading: false,
      error: null,
   });

   const fetchItem = useCallback(async (id: string | number) => {
      setState((prev) => ({ ...prev, loading: true, error: null }));

      try {
         const item = await itemService.getItem(id);
         setState({ data: item, loading: false, error: null });
      } catch (error) {
         setState({
            data: null,
            loading: false,
            error:
               error instanceof Error ? error.message : "Failed to fetch item",
         });
      }
   }, []);

   useEffect(() => {
      if (identifier) {
         fetchItem(identifier);
      }
   }, [identifier, fetchItem]);

   return {
      ...state,
      refetch: identifier ? () => fetchItem(identifier) : undefined,
   };
};

// Hook for getting item list
export const useItemList = (offset: number = 0, limit: number = 20) => {
   const [state, setState] = useState<UseItemListState>({
      data: null,
      loading: false,
      error: null,
   });

   const fetchItemList = useCallback(async () => {
      setState((prev) => ({ ...prev, loading: true, error: null }));

      try {
         const response = await itemService.getItemList(offset, limit);
         // Extract items from the paginated response
         const items = await Promise.all(
            response.results.map(async (itemRef) => {
               const itemId = itemRef.url.split("/").slice(-2, -1)[0];
               return await itemService.getItem(parseInt(itemId));
            })
         );
         setState({ data: items, loading: false, error: null });
      } catch (error) {
         setState({
            data: null,
            loading: false,
            error:
               error instanceof Error
                  ? error.message
                  : "Failed to fetch item list",
         });
      }
   }, [offset, limit]);

   useEffect(() => {
      fetchItemList();
   }, [fetchItemList]);

   return {
      ...state,
      refetch: fetchItemList,
   };
};

// Hook for getting item category
export const useItemCategory = (identifier?: string | number) => {
   const [state, setState] = useState<UseItemCategoryState>({
      data: null,
      loading: false,
      error: null,
   });

   const fetchItemCategory = useCallback(async (id: string | number) => {
      setState((prev) => ({ ...prev, loading: true, error: null }));

      try {
         const category = await itemService.getItemCategory(id);
         setState({ data: category, loading: false, error: null });
      } catch (error) {
         setState({
            data: null,
            loading: false,
            error:
               error instanceof Error
                  ? error.message
                  : "Failed to fetch item category",
         });
      }
   }, []);

   useEffect(() => {
      if (identifier) {
         fetchItemCategory(identifier);
      }
   }, [identifier, fetchItemCategory]);

   return {
      ...state,
      refetch: identifier ? () => fetchItemCategory(identifier) : undefined,
   };
};

// Hook for getting items by category
export const useItemsByCategory = (categoryName?: string) => {
   const [state, setState] = useState<UseItemListState>({
      data: null,
      loading: false,
      error: null,
   });

   const fetchItemsByCategory = useCallback(async (category: string) => {
      setState((prev) => ({ ...prev, loading: true, error: null }));

      try {
         const items = await itemService.getItemsByCategory(category);
         // Get full item data for each item reference
         const fullItems = await Promise.all(
            items.map(async (itemRef) => {
               const itemId = itemRef.url.split("/").slice(-2, -1)[0];
               return await itemService.getItem(parseInt(itemId));
            })
         );
         setState({ data: fullItems, loading: false, error: null });
      } catch (error) {
         setState({
            data: null,
            loading: false,
            error:
               error instanceof Error
                  ? error.message
                  : "Failed to fetch items by category",
         });
      }
   }, []);

   useEffect(() => {
      if (categoryName) {
         fetchItemsByCategory(categoryName);
      }
   }, [categoryName, fetchItemsByCategory]);

   return {
      ...state,
      refetch: categoryName
         ? () => fetchItemsByCategory(categoryName)
         : undefined,
   };
};
