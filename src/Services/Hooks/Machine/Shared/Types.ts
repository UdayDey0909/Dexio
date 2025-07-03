import { useMemo } from "react";
import type { Machine, NamedAPIResourceList } from "pokenode-ts";

// Base hook state interface
export interface BaseHookState<T> {
   data: T | null;
   loading: boolean;
   error: string | null;
}

// Enhanced details interface
export interface MachineDetails extends Machine {
   // Add any computed/enhanced properties here
   machineNumber?: string;
   formattedName?: string;
}

// Specific hook state interfaces
export interface UseMachineState extends BaseHookState<Machine> {}

export interface UseMachineDetailsState extends BaseHookState<MachineDetails> {}

export interface UseMachineListState
   extends BaseHookState<NamedAPIResourceList["results"]> {
   hasMore: boolean;
}

export interface UseMachinesByVersionGroupState
   extends BaseHookState<Machine[]> {}

export interface UseTMsByMoveState extends BaseHookState<Machine[]> {}

// Hook return types
export interface UseMachineReturn extends UseMachineState {
   refetch: () => void;
}

export interface UseMachineDetailsReturn extends UseMachineDetailsState {
   refetch: () => void;
}

export interface UseMachineListReturn extends UseMachineListState {
   refetch: () => void;
}

export interface UseMachinesByVersionGroupReturn
   extends UseMachinesByVersionGroupState {
   refetch: () => void;
}

export interface UseTMsByMoveReturn extends UseTMsByMoveState {
   refetch: () => void;
}

// Error handling utility
export const handleError = (error: unknown): string => {
   if (error instanceof Error) return error.message;
   return "An unexpected error occurred";
};

// State updater functions
export const updateMachineState = (
   setState: React.Dispatch<React.SetStateAction<UseMachineState>>,
   updates: Partial<UseMachineState>
) => {
   setState((prev) => ({ ...prev, ...updates }));
};

export const updateMachineDetailsState = (
   setState: React.Dispatch<React.SetStateAction<UseMachineDetailsState>>,
   updates: Partial<UseMachineDetailsState>
) => {
   setState((prev) => ({ ...prev, ...updates }));
};

export const updateMachineListState = (
   setState: React.Dispatch<React.SetStateAction<UseMachineListState>>,
   updates: Partial<UseMachineListState>
) => {
   setState((prev) => ({ ...prev, ...updates }));
};

export const updateMachinesByVersionGroupState = (
   setState: React.Dispatch<
      React.SetStateAction<UseMachinesByVersionGroupState>
   >,
   updates: Partial<UseMachinesByVersionGroupState>
) => {
   setState((prev) => ({ ...prev, ...updates }));
};

export const updateTMsByMoveState = (
   setState: React.Dispatch<React.SetStateAction<UseTMsByMoveState>>,
   updates: Partial<UseTMsByMoveState>
) => {
   setState((prev) => ({ ...prev, ...updates }));
};

// Memoization utilities
export const useMemoizedId = (id?: number) => {
   return useMemo(() => {
      if (!id || id <= 0) return null;
      return id;
   }, [id]);
};

export const useMemoizedName = (name?: string) => {
   return useMemo(() => {
      if (!name || typeof name !== "string") return null;
      return name.toLowerCase().trim();
   }, [name]);
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
