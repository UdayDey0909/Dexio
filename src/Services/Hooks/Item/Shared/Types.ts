import { useMemo } from "react";
import type { Item, ItemCategory, NamedAPIResourceList } from "pokenode-ts";

// Base hook state interface
export interface BaseHookState<T> {
   data: T | null;
   loading: boolean;
   error: string | null;
}

// Enhanced details interfaces
export interface ItemDetails extends Item {
   categoryName: string | null;
   effectShort: string | null;
   costFormatted: string;
   isConsumable: boolean;
   generationName: string | null;
}

export interface ItemCategoryDetails extends ItemCategory {
   itemCount: number;
   itemNames: string[];
   generationName: string | null;
}

// Specific hook state interfaces
export interface UseItemState extends BaseHookState<Item> {}
export interface UseItemDetailsState extends BaseHookState<ItemDetails> {}
export interface UseItemListState
   extends BaseHookState<NamedAPIResourceList["results"]> {}
export interface UseItemCategoryState extends BaseHookState<ItemCategory> {}
export interface UseItemCategoryDetailsState
   extends BaseHookState<ItemCategoryDetails> {}
export interface UseItemCategoryListState
   extends BaseHookState<NamedAPIResourceList["results"]> {}

// Hook return types
export interface UseItemReturn extends UseItemState {
   refetch: () => void;
}

export interface UseItemDetailsReturn extends UseItemDetailsState {
   refetch: () => void;
}

export interface UseItemListReturn extends UseItemListState {
   refetch: () => void;
}

export interface UseItemCategoryReturn extends UseItemCategoryState {
   refetch: () => void;
}

export interface UseItemCategoryDetailsReturn
   extends UseItemCategoryDetailsState {
   refetch: () => void;
}

export interface UseItemCategoryListReturn extends UseItemCategoryListState {
   refetch: () => void;
}

// Error handling utility
export const handleError = (error: unknown): string => {
   if (error instanceof Error) return error.message;
   return "An unexpected error occurred";
};

// State updater functions for type safety
export const updateItemState = (
   setState: React.Dispatch<React.SetStateAction<UseItemState>>,
   updates: Partial<UseItemState>
) => {
   setState((prev) => ({ ...prev, ...updates }));
};

export const updateItemDetailsState = (
   setState: React.Dispatch<React.SetStateAction<UseItemDetailsState>>,
   updates: Partial<UseItemDetailsState>
) => {
   setState((prev) => ({ ...prev, ...updates }));
};

export const updateItemListState = (
   setState: React.Dispatch<React.SetStateAction<UseItemListState>>,
   updates: Partial<UseItemListState>
) => {
   setState((prev) => ({ ...prev, ...updates }));
};

export const updateItemCategoryState = (
   setState: React.Dispatch<React.SetStateAction<UseItemCategoryState>>,
   updates: Partial<UseItemCategoryState>
) => {
   setState((prev) => ({ ...prev, ...updates }));
};

export const updateItemCategoryDetailsState = (
   setState: React.Dispatch<React.SetStateAction<UseItemCategoryDetailsState>>,
   updates: Partial<UseItemCategoryDetailsState>
) => {
   setState((prev) => ({ ...prev, ...updates }));
};

export const updateItemCategoryListState = (
   setState: React.Dispatch<React.SetStateAction<UseItemCategoryListState>>,
   updates: Partial<UseItemCategoryListState>
) => {
   setState((prev) => ({ ...prev, ...updates }));
};

// Memoization utilities
export const useMemoizedIdentifier = (identifier?: string | number) => {
   return useMemo(() => {
      if (!identifier) return null;
      return typeof identifier === "string"
         ? identifier.toLowerCase().trim()
         : identifier;
   }, [identifier]);
};

export const useMemoizedPagination = (
   offset: number = 0,
   limit: number = 20
) => {
   return useMemo(
      () => ({
         offset: Math.max(0, offset),
         limit: Math.min(Math.max(1, limit), 1000),
      }),
      [offset, limit]
   );
};
