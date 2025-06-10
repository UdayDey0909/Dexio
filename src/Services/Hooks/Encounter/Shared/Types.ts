import { useMemo } from "react";
import type {
   EncounterMethod,
   EncounterCondition,
   EncounterConditionValue,
   NamedAPIResourceList,
} from "pokenode-ts";

// Base hook state interface
export interface BaseHookState<T> {
   data: T | null;
   loading: boolean;
   error: string | null;
}

// Specific hook state interfaces
export interface UseEncounterMethodState
   extends BaseHookState<EncounterMethod> {}
export interface UseEncounterConditionState
   extends BaseHookState<EncounterCondition> {}
export interface UseEncounterConditionValueState
   extends BaseHookState<EncounterConditionValue> {}
export interface UseEncounterListState
   extends BaseHookState<NamedAPIResourceList["results"]> {}

// Hook return types
export interface UseEncounterMethodReturn extends UseEncounterMethodState {
   refetch: () => void;
}

export interface UseEncounterConditionReturn
   extends UseEncounterConditionState {
   refetch: () => void;
}

export interface UseEncounterConditionValueReturn
   extends UseEncounterConditionValueState {
   refetch: () => void;
}

export interface UseEncounterListReturn extends UseEncounterListState {
   refetch: () => void;
}

// Error handling utility
export const handleError = (error: unknown): string => {
   if (error instanceof Error) return error.message;
   return "An unexpected error occurred";
};

// State updater functions for type safety
export const updateEncounterMethodState = (
   setState: React.Dispatch<React.SetStateAction<UseEncounterMethodState>>,
   updates: Partial<UseEncounterMethodState>
) => {
   setState((prev) => ({ ...prev, ...updates }));
};

export const updateEncounterConditionState = (
   setState: React.Dispatch<React.SetStateAction<UseEncounterConditionState>>,
   updates: Partial<UseEncounterConditionState>
) => {
   setState((prev) => ({ ...prev, ...updates }));
};

export const updateEncounterConditionValueState = (
   setState: React.Dispatch<
      React.SetStateAction<UseEncounterConditionValueState>
   >,
   updates: Partial<UseEncounterConditionValueState>
) => {
   setState((prev) => ({ ...prev, ...updates }));
};

export const updateEncounterListState = (
   setState: React.Dispatch<React.SetStateAction<UseEncounterListState>>,
   updates: Partial<UseEncounterListState>
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
