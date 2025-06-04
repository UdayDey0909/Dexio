import { useMemo, useCallback } from "react";
import type { Pokemon, PokemonSpecies, NamedAPIResource } from "pokenode-ts";

// Base hook state interface
export interface BaseHookState<T> {
   data: T | null;
   loading: boolean;
   error: string | null;
}

// Enhanced details interface extending base Pokemon type
export interface PokemonDetails extends Pokemon {
   formattedStats: {
      name: string;
      baseStat: number;
      effort: number;
   }[];
   totalStats: number;
   formattedAbilities: {
      name: string;
      isHidden: boolean;
      slot: number;
   }[];
   formattedTypes: {
      name: string;
      slot: number;
   }[];
   generationInfo?: {
      generation: string;
      generationId?: number;
      isLegendary: boolean;
      isMythical: boolean;
      captureRate: number;
      baseHappiness: number;
      growthRate: string;
   };
}

// Pokemon search result interface
export interface PokemonSearchResult extends NamedAPIResource {
   // Add any additional search-specific properties if needed
}

// Pokemon stats interface for dedicated stats hook
export interface PokemonStatsData {
   baseStats: {
      name: string;
      baseStat: number;
      effort: number;
   }[];
   totalStats: number;
   abilities: {
      name: string;
      isHidden: boolean;
      slot: number;
   }[];
   types: {
      name: string;
      slot: number;
   }[];
   height: number;
   weight: number;
   baseExperience: number | null;
}

// Specific hook state interfaces
export interface UsePokemonState extends BaseHookState<Pokemon> {}
export interface UsePokemonDetailsState extends BaseHookState<PokemonDetails> {}
export interface UsePokemonListState extends BaseHookState<Pokemon[]> {}
export interface UsePokemonSpeciesState extends BaseHookState<PokemonSpecies> {}
export interface UsePokemonStatsState extends BaseHookState<PokemonStatsData> {}
export interface UsePokemonSearchState
   extends BaseHookState<PokemonSearchResult[]> {}

// Hook return types
export interface UsePokemonReturn extends UsePokemonState {
   refetch: () => void;
}

export interface UsePokemonDetailsReturn extends UsePokemonDetailsState {
   refetch: () => void;
}

export interface UsePokemonListReturn extends UsePokemonListState {
   refetch: () => void;
}

export interface UsePokemonSpeciesReturn extends UsePokemonSpeciesState {
   refetch: () => void;
}

export interface UsePokemonStatsReturn extends UsePokemonStatsState {
   refetch: () => void;
}

export interface UsePokemonSearchReturn extends UsePokemonSearchState {
   search: (query: string, limit?: number) => void;
   clearSearch: () => void;
}

export interface UseRandomPokemonReturn extends UsePokemonState {
   refetch: () => void;
   generateNew: () => void;
}

// Error handling utility
export const handleError = (error: unknown): string => {
   if (error instanceof Error) {
      return error.message;
   }
   if (typeof error === "string") {
      return error;
   }
   return "An unexpected error occurred";
};

// State updater functions for type safety
export const updatePokemonState = (
   setState: React.Dispatch<React.SetStateAction<UsePokemonState>>,
   updates: Partial<UsePokemonState>
) => {
   setState((prev) => ({ ...prev, ...updates }));
};

export const updatePokemonDetailsState = (
   setState: React.Dispatch<React.SetStateAction<UsePokemonDetailsState>>,
   updates: Partial<UsePokemonDetailsState>
) => {
   setState((prev) => ({ ...prev, ...updates }));
};

export const updatePokemonListState = (
   setState: React.Dispatch<React.SetStateAction<UsePokemonListState>>,
   updates: Partial<UsePokemonListState>
) => {
   setState((prev) => ({ ...prev, ...updates }));
};

export const updatePokemonSpeciesState = (
   setState: React.Dispatch<React.SetStateAction<UsePokemonSpeciesState>>,
   updates: Partial<UsePokemonSpeciesState>
) => {
   setState((prev) => ({ ...prev, ...updates }));
};

export const updatePokemonStatsState = (
   setState: React.Dispatch<React.SetStateAction<UsePokemonStatsState>>,
   updates: Partial<UsePokemonStatsState>
) => {
   setState((prev) => ({ ...prev, ...updates }));
};

export const updatePokemonSearchState = (
   setState: React.Dispatch<React.SetStateAction<UsePokemonSearchState>>,
   updates: Partial<UsePokemonSearchState>
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

export const useMemoizedSearchQuery = (query?: string) => {
   return useMemo(() => {
      if (!query || typeof query !== "string") return null;
      const trimmed = query.trim();
      return trimmed.length >= 2 ? trimmed.toLowerCase() : null;
   }, [query]);
};

// Abort controller hook for request cancellation
export const useAbortController = () => {
   return useMemo(() => {
      let controller: AbortController | null = null;

      const getController = () => {
         if (controller) {
            controller.abort();
         }
         controller = new AbortController();
         return controller;
      };

      const abort = () => {
         if (controller) {
            controller.abort();
            controller = null;
         }
      };

      return { getController, abort };
   }, []);
};
