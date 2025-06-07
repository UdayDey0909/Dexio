import { useMemo, useCallback } from "react";
import type {
   Berry,
   BerryFlavor,
   BerryFirmness,
   NamedAPIResource,
   NamedAPIResourceList,
} from "pokenode-ts";

// Base hook state interface
export interface BaseHookState<T> {
   data: T | null;
   loading: boolean;
   error: string | null;
}

// Specific hook state interfaces
export interface UseBerryState extends BaseHookState<Berry> {}
export interface UseBerryFlavorState extends BaseHookState<BerryFlavor> {}
export interface UseBerryFirmnessState extends BaseHookState<BerryFirmness> {}
export interface UseBerryListState
   extends BaseHookState<NamedAPIResourceList["results"]> {}
export interface UseBerryFlavorListState
   extends BaseHookState<NamedAPIResourceList["results"]> {}
export interface UseBerryFirmnessListState
   extends BaseHookState<NamedAPIResourceList["results"]> {}
export interface UseBerriesByFlavorState
   extends BaseHookState<NamedAPIResource[]> {}

// Hook return types
export interface UseBerryReturn extends UseBerryState {
   refetch: () => void;
}

export interface UseBerryFlavorReturn extends UseBerryFlavorState {
   refetch: () => void;
}

export interface UseBerryFirmnessReturn extends UseBerryFirmnessState {
   refetch: () => void;
}

export interface UseBerryListReturn extends UseBerryListState {
   refetch: () => void;
}

export interface UseBerryFlavorListReturn extends UseBerryFlavorListState {
   refetch: () => void;
}

export interface UseBerryFirmnessListReturn extends UseBerryFirmnessListState {
   refetch: () => void;
}

export interface UseBerriesByFlavorReturn extends UseBerriesByFlavorState {
   refetch: () => void;
}

// Error handler
export const handleError = (error: unknown): string => {
   if (error instanceof Error) {
      return error.message;
   }
   return "An unexpected error occurred";
};

// Custom hook for memoizing API identifiers
export const useMemoizedIdentifier = (identifier?: string | number) => {
   return useMemo(() => {
      if (!identifier) return null;
      return typeof identifier === "string"
         ? identifier.toLowerCase().trim()
         : identifier;
   }, [identifier]);
};

// Custom hook for memoizing pagination parameters
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
