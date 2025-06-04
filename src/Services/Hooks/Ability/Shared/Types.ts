import { useMemo, useCallback } from "react";
import type {
   Ability,
   VerboseEffect,
   AbilityFlavorText,
   AbilityPokemon,
   NamedAPIResourceList,
} from "pokenode-ts";

// Base hook state interface
export interface BaseHookState<T> {
   data: T | null;
   loading: boolean;
   error: string | null;
}

// Enhanced ability details interface
export interface AbilityDetails extends Ability {
   pokemonWithAbility: AbilityPokemon[];
   effectEntries: VerboseEffect[];
   flavorTextEntries: AbilityFlavorText[];
}

// Specific hook state interfaces
export interface UseAbilityState extends BaseHookState<Ability> {}

export interface UseAbilityDetailsState extends BaseHookState<AbilityDetails> {}

export interface UseAbilityListState
   extends BaseHookState<NamedAPIResourceList["results"]> {}

// Hook return types
export interface UseAbilityReturn extends UseAbilityState {
   refetch: () => void;
}

export interface UseAbilityDetailsReturn extends UseAbilityDetailsState {
   refetch: () => void;
}

export interface UseAbilityListReturn extends UseAbilityListState {
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
export const updateAbilityState = (
   setState: React.Dispatch<React.SetStateAction<UseAbilityState>>,
   updates: Partial<UseAbilityState>
) => {
   setState((prev) => ({ ...prev, ...updates }));
};

export const updateAbilityDetailsState = (
   setState: React.Dispatch<React.SetStateAction<UseAbilityDetailsState>>,
   updates: Partial<UseAbilityDetailsState>
) => {
   setState((prev) => ({ ...prev, ...updates }));
};

export const updateAbilityListState = (
   setState: React.Dispatch<React.SetStateAction<UseAbilityListState>>,
   updates: Partial<UseAbilityListState>
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
