import { useMemo } from "react";
import type {
   Generation,
   Pokedex,
   Version,
   VersionGroup,
   NamedAPIResourceList,
   PokemonSpecies,
   PokemonEntry,
   NamedAPIResource,
} from "pokenode-ts";

// Base hook state interface
export interface BaseHookState<T> {
   data: T | null;
   loading: boolean;
   error: string | null;
}

// Enhanced details interfaces
export interface GenerationDetails extends Generation {
   pokemonCount: number;
   mainRegion: string | null;
   gameVersions: string[];
}

export interface PokedexDetails extends Pokedex {
   entryCount: number;
   regionName: string | null;
   pokemonNames: string[];
}

export interface VersionDetails extends Version {
   generationName: string | null;
   versionGroupName: string | null;
}

export interface VersionGroupDetails extends VersionGroup {
   generationName: string | null;
   versionNames: string[];
   regionNames: string[];
}

// Specific hook state interfaces
export interface UseGenerationState extends BaseHookState<Generation> {}
export interface UseGenerationDetailsState
   extends BaseHookState<GenerationDetails> {}
export interface UseGenerationListState
   extends BaseHookState<NamedAPIResource[]> {}

export interface UsePokedexState extends BaseHookState<Pokedex> {}
export interface UsePokedexDetailsState extends BaseHookState<PokedexDetails> {}
export interface UsePokedexListState
   extends BaseHookState<NamedAPIResource[]> {}

export interface UseVersionState extends BaseHookState<Version> {}
export interface UseVersionDetailsState extends BaseHookState<VersionDetails> {}
export interface UseVersionListState
   extends BaseHookState<NamedAPIResource[]> {}

export interface UseVersionGroupState extends BaseHookState<VersionGroup> {}
export interface UseVersionGroupDetailsState
   extends BaseHookState<VersionGroupDetails> {}
export interface UseVersionGroupListState
   extends BaseHookState<NamedAPIResource[]> {}

// Special data states - Fixed types
export interface UsePokemonByGenerationState
   extends BaseHookState<NamedAPIResource[]> {}
export interface UsePokedexEntriesState extends BaseHookState<PokemonEntry[]> {}

// Hook return types
export interface UseGenerationReturn extends UseGenerationState {
   refetch: () => void;
}

export interface UseGenerationDetailsReturn extends UseGenerationDetailsState {
   refetch: () => void;
}

export interface UseGenerationListReturn extends UseGenerationListState {
   refetch: () => void;
}

export interface UsePokedexReturn extends UsePokedexState {
   refetch: () => void;
}

export interface UsePokedexDetailsReturn extends UsePokedexDetailsState {
   refetch: () => void;
}

export interface UsePokedexListReturn extends UsePokedexListState {
   refetch: () => void;
}

export interface UseVersionReturn extends UseVersionState {
   refetch: () => void;
}

export interface UseVersionDetailsReturn extends UseVersionDetailsState {
   refetch: () => void;
}

export interface UseVersionListReturn extends UseVersionListState {
   refetch: () => void;
}

export interface UseVersionGroupReturn extends UseVersionGroupState {
   refetch: () => void;
}

export interface UseVersionGroupDetailsReturn
   extends UseVersionGroupDetailsState {
   refetch: () => void;
}

export interface UseVersionGroupListReturn extends UseVersionGroupListState {
   refetch: () => void;
}

export interface UsePokemonByGenerationReturn
   extends UsePokemonByGenerationState {
   refetch: () => void;
}

export interface UsePokedexEntriesReturn extends UsePokedexEntriesState {
   refetch: () => void;
}

// Error handling utility
export const handleError = (error: unknown): string => {
   if (error instanceof Error) return error.message;
   if (typeof error === "string") return error;
   return "An unexpected error occurred";
};

// State updater functions
export const updateGenerationState = (
   setState: React.Dispatch<React.SetStateAction<UseGenerationState>>,
   updates: Partial<UseGenerationState>
) => {
   setState((prev) => ({ ...prev, ...updates }));
};

export const updateGenerationDetailsState = (
   setState: React.Dispatch<React.SetStateAction<UseGenerationDetailsState>>,
   updates: Partial<UseGenerationDetailsState>
) => {
   setState((prev) => ({ ...prev, ...updates }));
};

export const updateGenerationListState = (
   setState: React.Dispatch<React.SetStateAction<UseGenerationListState>>,
   updates: Partial<UseGenerationListState>
) => {
   setState((prev) => ({ ...prev, ...updates }));
};

export const updatePokedexState = (
   setState: React.Dispatch<React.SetStateAction<UsePokedexState>>,
   updates: Partial<UsePokedexState>
) => {
   setState((prev) => ({ ...prev, ...updates }));
};

export const updatePokedexDetailsState = (
   setState: React.Dispatch<React.SetStateAction<UsePokedexDetailsState>>,
   updates: Partial<UsePokedexDetailsState>
) => {
   setState((prev) => ({ ...prev, ...updates }));
};

export const updatePokedexListState = (
   setState: React.Dispatch<React.SetStateAction<UsePokedexListState>>,
   updates: Partial<UsePokedexListState>
) => {
   setState((prev) => ({ ...prev, ...updates }));
};

export const updateVersionState = (
   setState: React.Dispatch<React.SetStateAction<UseVersionState>>,
   updates: Partial<UseVersionState>
) => {
   setState((prev) => ({ ...prev, ...updates }));
};

export const updateVersionDetailsState = (
   setState: React.Dispatch<React.SetStateAction<UseVersionDetailsState>>,
   updates: Partial<UseVersionDetailsState>
) => {
   setState((prev) => ({ ...prev, ...updates }));
};

export const updateVersionListState = (
   setState: React.Dispatch<React.SetStateAction<UseVersionListState>>,
   updates: Partial<UseVersionListState>
) => {
   setState((prev) => ({ ...prev, ...updates }));
};

export const updateVersionGroupState = (
   setState: React.Dispatch<React.SetStateAction<UseVersionGroupState>>,
   updates: Partial<UseVersionGroupState>
) => {
   setState((prev) => ({ ...prev, ...updates }));
};

export const updateVersionGroupDetailsState = (
   setState: React.Dispatch<React.SetStateAction<UseVersionGroupDetailsState>>,
   updates: Partial<UseVersionGroupDetailsState>
) => {
   setState((prev) => ({ ...prev, ...updates }));
};

export const updateVersionGroupListState = (
   setState: React.Dispatch<React.SetStateAction<UseVersionGroupListState>>,
   updates: Partial<UseVersionGroupListState>
) => {
   setState((prev) => ({ ...prev, ...updates }));
};

export const updatePokemonByGenerationState = (
   setState: React.Dispatch<React.SetStateAction<UsePokemonByGenerationState>>,
   updates: Partial<UsePokemonByGenerationState>
) => {
   setState((prev) => ({ ...prev, ...updates }));
};

export const updatePokedexEntriesState = (
   setState: React.Dispatch<React.SetStateAction<UsePokedexEntriesState>>,
   updates: Partial<UsePokedexEntriesState>
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
