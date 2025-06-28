import { useMemo, useCallback } from "react";
import type {
   EvolutionChain,
   EvolutionTrigger,
   NamedAPIResourceList,
} from "pokenode-ts";

// Base hook state interface
export interface BaseHookState<T> {
   data: T | null;
   loading: boolean;
   error: string | null;
}

// Enhanced details interface
export interface EvolutionChainDetails extends EvolutionChain {
   // Add computed/enhanced properties here if needed
   totalEvolutions?: number;
   maxEvolutionStage?: number;
}

// Specific hook state interfaces
export interface UseEvolutionChainState extends BaseHookState<EvolutionChain> {}
export interface UseEvolutionChainDetailsState
   extends BaseHookState<EvolutionChainDetails> {}
export interface UseEvolutionChainListState
   extends BaseHookState<NamedAPIResourceList["results"]> {}
export interface UseEvolutionTriggerState
   extends BaseHookState<EvolutionTrigger> {}
export interface UseEvolutionTriggerListState
   extends BaseHookState<NamedAPIResourceList["results"]> {}

// Hook return types
export interface UseEvolutionChainReturn extends UseEvolutionChainState {
   refetch: () => void;
}

export interface UseEvolutionChainDetailsReturn
   extends UseEvolutionChainDetailsState {
   refetch: () => void;
}

export interface UseEvolutionChainListReturn
   extends UseEvolutionChainListState {
   refetch: () => void;
}

export interface UseEvolutionTriggerReturn extends UseEvolutionTriggerState {
   refetch: () => void;
}

export interface UseEvolutionTriggerListReturn
   extends UseEvolutionTriggerListState {
   refetch: () => void;
}

// Error handling utility
export const handleError = (error: unknown): string => {
   if (error instanceof Error) return error.message;
   return "An unexpected error occurred";
};

// State updaters for each hook type
export const updateEvolutionChainState = (
   setState: React.Dispatch<React.SetStateAction<UseEvolutionChainState>>,
   updates: Partial<UseEvolutionChainState>
) => {
   setState((prev) => ({ ...prev, ...updates }));
};

export const updateEvolutionChainDetailsState = (
   setState: React.Dispatch<
      React.SetStateAction<UseEvolutionChainDetailsState>
   >,
   updates: Partial<UseEvolutionChainDetailsState>
) => {
   setState((prev) => ({ ...prev, ...updates }));
};

export const updateEvolutionChainListState = (
   setState: React.Dispatch<React.SetStateAction<UseEvolutionChainListState>>,
   updates: Partial<UseEvolutionChainListState>
) => {
   setState((prev) => ({ ...prev, ...updates }));
};

export const updateEvolutionTriggerState = (
   setState: React.Dispatch<React.SetStateAction<UseEvolutionTriggerState>>,
   updates: Partial<UseEvolutionTriggerState>
) => {
   setState((prev) => ({ ...prev, ...updates }));
};

export const updateEvolutionTriggerListState = (
   setState: React.Dispatch<React.SetStateAction<UseEvolutionTriggerListState>>,
   updates: Partial<UseEvolutionTriggerListState>
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

export const useMemoizedStringIdentifier = (identifier?: string) => {
   return useMemo(() => {
      if (!identifier || typeof identifier !== "string") return null;
      return identifier.toLowerCase().trim();
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

// Common fetch function factory
export const createFetchFunction = <T>(
   fetchFn: () => Promise<T>,
   setState: React.Dispatch<React.SetStateAction<BaseHookState<T>>>,
   updateStateFn: (
      setState: React.Dispatch<React.SetStateAction<BaseHookState<T>>>,
      updates: Partial<BaseHookState<T>>
   ) => void
) => {
   return useCallback(async () => {
      updateStateFn(setState, { loading: true, error: null });

      try {
         const data = await fetchFn();
         updateStateFn(setState, { data, loading: false });
      } catch (error) {
         updateStateFn(setState, {
            data: null,
            loading: false,
            error: handleError(error),
         });
      }
   }, [fetchFn, setState, updateStateFn]);
};
