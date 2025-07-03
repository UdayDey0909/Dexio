// src/Services/Hooks/Move/Shared/Types.ts
import { useMemo } from "react";
import type { Move, NamedAPIResourceList } from "pokenode-ts";

// Base hook state interface
export interface BaseHookState<T> {
   data: T | null;
   loading: boolean;
   error: string | null;
}

// Enhanced details interface (extend base API type)
export interface MoveDetails extends Move {
   effectChance: number | null;
   effectEntries: Move["effect_entries"];
   flavorTextEntries: Move["flavor_text_entries"];
}

// Specific hook state interfaces
export interface UseMoveState extends BaseHookState<Move> {}
export interface UseMoveDetailsState extends BaseHookState<MoveDetails> {}
export interface UseMoveListState
   extends BaseHookState<NamedAPIResourceList["results"]> {
   hasMore: boolean;
}
export interface UseMoveFilterState extends BaseHookState<Move[]> {}
export interface UseMoveLearnedByState
   extends BaseHookState<Move["learned_by_pokemon"]> {}

// Hook return types
export interface UseMoveReturn extends UseMoveState {
   refetch: () => void;
}

export interface UseMoveDetailsReturn extends UseMoveDetailsState {
   refetch: () => void;
}

export interface UseMoveListReturn extends UseMoveListState {
   refetch: () => void;
   loadMore: () => void;
}

export interface UseMoveFilterReturn extends UseMoveFilterState {
   filterByPower: (minPower: number, maxPower?: number) => void;
}

export interface UseMoveLearnedByReturn extends UseMoveLearnedByState {
   refetch: () => void;
}

export interface UseBatchMovesReturn extends UseMoveFilterState {
   fetchBatchMoves: (identifiers: (string | number)[]) => void;
}

// Error handling utility
export const handleError = (error: unknown): string => {
   if (error instanceof Error) return error.message;
   return "An unexpected error occurred";
};

// State updater functions for type safety
export const updateMoveState = (
   setState: React.Dispatch<React.SetStateAction<UseMoveState>>,
   updates: Partial<UseMoveState>
) => {
   setState((prev) => ({ ...prev, ...updates }));
};

export const updateMoveDetailsState = (
   setState: React.Dispatch<React.SetStateAction<UseMoveDetailsState>>,
   updates: Partial<UseMoveDetailsState>
) => {
   setState((prev) => ({ ...prev, ...updates }));
};

export const updateMoveListState = (
   setState: React.Dispatch<React.SetStateAction<UseMoveListState>>,
   updates: Partial<UseMoveListState>
) => {
   setState((prev) => ({ ...prev, ...updates }));
};

// Alternative updater for complex list operations
export const updateMoveListStateWithCallback = (
   setState: React.Dispatch<React.SetStateAction<UseMoveListState>>,
   updater: (prev: UseMoveListState) => Partial<UseMoveListState>
) => {
   setState((prev) => ({ ...prev, ...updater(prev) }));
};

export const updateMoveFilterState = (
   setState: React.Dispatch<React.SetStateAction<UseMoveFilterState>>,
   updates: Partial<UseMoveFilterState>
) => {
   setState((prev) => ({ ...prev, ...updates }));
};

export const updateMoveLearnedByState = (
   setState: React.Dispatch<React.SetStateAction<UseMoveLearnedByState>>,
   updates: Partial<UseMoveLearnedByState>
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

// Initial state factories
export const createInitialMoveState = (): UseMoveState => ({
   data: null,
   loading: false,
   error: null,
});

export const createInitialMoveDetailsState = (): UseMoveDetailsState => ({
   data: null,
   loading: false,
   error: null,
});

export const createInitialMoveListState = (): UseMoveListState => ({
   data: [],
   loading: false,
   error: null,
   hasMore: true,
});

export const createInitialMoveFilterState = (): UseMoveFilterState => ({
   data: [],
   loading: false,
   error: null,
});

export const createInitialMoveLearnedByState = (): UseMoveLearnedByState => ({
   data: [],
   loading: false,
   error: null,
});
