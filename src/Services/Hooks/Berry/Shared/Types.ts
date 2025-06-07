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

// Memoized utility function for error handling
export const useErrorHandler = () => {
   return useCallback((error: unknown): string => {
      if (error instanceof Error) {
         return error.message;
      }
      return "An unexpected error occurred";
   }, []);
};

// Regular error handler (for non-hook contexts)
export const handleError = (error: unknown): string => {
   if (error instanceof Error) {
      return error.message;
   }
   return "An unexpected error occurred";
};

// Specific state updaters for each hook type
export const updateBerryState = (
   setState: React.Dispatch<React.SetStateAction<UseBerryState>>,
   updates: Partial<UseBerryState>
) => {
   setState((prev) => ({ ...prev, ...updates }));
};

export const updateBerryFlavorState = (
   setState: React.Dispatch<React.SetStateAction<UseBerryFlavorState>>,
   updates: Partial<UseBerryFlavorState>
) => {
   setState((prev) => ({ ...prev, ...updates }));
};

export const updateBerryFirmnessState = (
   setState: React.Dispatch<React.SetStateAction<UseBerryFirmnessState>>,
   updates: Partial<UseBerryFirmnessState>
) => {
   setState((prev) => ({ ...prev, ...updates }));
};

export const updateBerryListState = (
   setState: React.Dispatch<React.SetStateAction<UseBerryListState>>,
   updates: Partial<UseBerryListState>
) => {
   setState((prev) => ({ ...prev, ...updates }));
};

export const updateBerryFlavorListState = (
   setState: React.Dispatch<React.SetStateAction<UseBerryFlavorListState>>,
   updates: Partial<UseBerryFlavorListState>
) => {
   setState((prev) => ({ ...prev, ...updates }));
};

export const updateBerryFirmnessListState = (
   setState: React.Dispatch<React.SetStateAction<UseBerryFirmnessListState>>,
   updates: Partial<UseBerryFirmnessListState>
) => {
   setState((prev) => ({ ...prev, ...updates }));
};

export const updateBerriesByFlavorState = (
   setState: React.Dispatch<React.SetStateAction<UseBerriesByFlavorState>>,
   updates: Partial<UseBerriesByFlavorState>
) => {
   setState((prev) => ({ ...prev, ...updates }));
};

// Generic state updater with proper typing
export const updateHookState = <T extends BaseHookState<any>>(
   setState: React.Dispatch<React.SetStateAction<T>>,
   updates: Partial<T>
) => {
   setState((prev) => ({ ...prev, ...updates }));
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

// Performance monitoring utilities (optional)
export const useRenderCounter = (name: string) => {
   const renderCount = useMemo(() => {
      let count = 0;
      return () => {
         count++;
         if (__DEV__) {
            console.log(`${name} rendered ${count} times`);
         }
         return count;
      };
   }, [name]);

   renderCount();
};
