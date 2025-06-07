import { useMemo } from "react";
import type {
   ContestType,
   ContestEffect,
   SuperContestEffect,
   NamedAPIResourceList,
} from "pokenode-ts";

// Base hook state interface
export interface BaseHookState<T> {
   data: T | null;
   loading: boolean;
   error: string | null;
}

// List hook state interface
export interface BaseListHookState<T> {
   data: T[];
   loading: boolean;
   error: string | null;
}

// Contest Type interfaces
export interface UseContestTypeState extends BaseHookState<ContestType> {}
export interface UseContestTypeListState
   extends BaseListHookState<NamedAPIResourceList["results"][0]> {}

// Contest Effect interfaces
export interface UseContestEffectState extends BaseHookState<ContestEffect> {}
export interface UseContestEffectListState
   extends BaseListHookState<NamedAPIResourceList["results"][0]> {}

// Super Contest Effect interfaces
export interface UseSuperContestEffectState
   extends BaseHookState<SuperContestEffect> {}
export interface UseSuperContestEffectListState
   extends BaseListHookState<NamedAPIResourceList["results"][0]> {}

// Batch operation interfaces
export interface UseBatchContestEffectsState
   extends BaseListHookState<ContestEffect> {}
export interface UseBatchSuperContestEffectsState
   extends BaseListHookState<SuperContestEffect> {}
export interface UseAllContestTypesState
   extends BaseListHookState<ContestType> {}

// Hook return types
export interface UseContestTypeReturn extends UseContestTypeState {
   refetch: () => void;
}

export interface UseContestTypeListReturn extends UseContestTypeListState {
   refetch: () => void;
}

export interface UseContestEffectReturn extends UseContestEffectState {
   refetch: () => void;
}

export interface UseContestEffectListReturn extends UseContestEffectListState {
   refetch: () => void;
}

export interface UseSuperContestEffectReturn
   extends UseSuperContestEffectState {
   refetch: () => void;
}

export interface UseSuperContestEffectListReturn
   extends UseSuperContestEffectListState {
   refetch: () => void;
}

export interface UseBatchContestEffectsReturn
   extends UseBatchContestEffectsState {
   refetch: () => void;
}

export interface UseBatchSuperContestEffectsReturn
   extends UseBatchSuperContestEffectsState {
   refetch: () => void;
}

export interface UseAllContestTypesReturn extends UseAllContestTypesState {
   refetch: () => void;
}

// Error handling utility
export const handleError = (error: unknown): string => {
   if (error instanceof Error) return error.message;
   return "An unexpected error occurred";
};

// State updater functions for type safety
export const updateContestTypeState = (
   setState: React.Dispatch<React.SetStateAction<UseContestTypeState>>,
   updates: Partial<UseContestTypeState>
) => {
   setState((prev) => ({ ...prev, ...updates }));
};

export const updateContestTypeListState = (
   setState: React.Dispatch<React.SetStateAction<UseContestTypeListState>>,
   updates: Partial<UseContestTypeListState>
) => {
   setState((prev) => ({ ...prev, ...updates }));
};

export const updateContestEffectState = (
   setState: React.Dispatch<React.SetStateAction<UseContestEffectState>>,
   updates: Partial<UseContestEffectState>
) => {
   setState((prev) => ({ ...prev, ...updates }));
};

export const updateContestEffectListState = (
   setState: React.Dispatch<React.SetStateAction<UseContestEffectListState>>,
   updates: Partial<UseContestEffectListState>
) => {
   setState((prev) => ({ ...prev, ...updates }));
};

export const updateSuperContestEffectState = (
   setState: React.Dispatch<React.SetStateAction<UseSuperContestEffectState>>,
   updates: Partial<UseSuperContestEffectState>
) => {
   setState((prev) => ({ ...prev, ...updates }));
};

export const updateSuperContestEffectListState = (
   setState: React.Dispatch<
      React.SetStateAction<UseSuperContestEffectListState>
   >,
   updates: Partial<UseSuperContestEffectListState>
) => {
   setState((prev) => ({ ...prev, ...updates }));
};

export const updateBatchContestEffectsState = (
   setState: React.Dispatch<React.SetStateAction<UseBatchContestEffectsState>>,
   updates: Partial<UseBatchContestEffectsState>
) => {
   setState((prev) => ({ ...prev, ...updates }));
};

export const updateBatchSuperContestEffectsState = (
   setState: React.Dispatch<
      React.SetStateAction<UseBatchSuperContestEffectsState>
   >,
   updates: Partial<UseBatchSuperContestEffectsState>
) => {
   setState((prev) => ({ ...prev, ...updates }));
};

export const updateAllContestTypesState = (
   setState: React.Dispatch<React.SetStateAction<UseAllContestTypesState>>,
   updates: Partial<UseAllContestTypesState>
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

export const useMemoizedIds = (ids?: number[]) => {
   return useMemo(() => {
      if (!ids || !Array.isArray(ids) || ids.length === 0) return null;
      return [...new Set(ids.filter((id) => typeof id === "number" && id > 0))];
   }, [ids]);
};
