import { useMemo, useCallback } from "react";
import type { Type, NamedAPIResource, NamedAPIResourceList } from "pokenode-ts";

// Base hook state interface
export interface BaseHookState<T> {
   data: T | null;
   loading: boolean;
   error: string | null;
}

// Enhanced details interface
export interface TypeDetails extends Type {
   formattedName: string;
   effectivenessChart: {
      superEffectiveAgainst: NamedAPIResource[];
      notVeryEffectiveAgainst: NamedAPIResource[];
      noEffectAgainst: NamedAPIResource[];
      weakTo: NamedAPIResource[];
      resistantTo: NamedAPIResource[];
      immuneTo: NamedAPIResource[];
   };
   pokemonCount: number;
   movesCount: number;
}

// Type effectiveness interface
export interface TypeEffectiveness {
   doubleDamageTo: NamedAPIResource[];
   doubleDamageFrom: NamedAPIResource[];
   halfDamageTo: NamedAPIResource[];
   halfDamageFrom: NamedAPIResource[];
   noDamageTo: NamedAPIResource[];
   noDamageFrom: NamedAPIResource[];
}

// Type matchup interface
export interface TypeMatchup {
   attackingType: string;
   defendingType: string;
   multiplier: number;
   effectiveness:
      | "super_effective"
      | "not_very_effective"
      | "no_effect"
      | "normal";
}

// Hook state interfaces
export interface UseTypeState extends BaseHookState<Type> {}
export interface UseTypeDetailsState extends BaseHookState<TypeDetails> {}
export interface UseTypeListState extends BaseHookState<NamedAPIResource[]> {}
export interface UseAllTypesState extends BaseHookState<Type[]> {}
export interface UseTypeEffectivenessState
   extends BaseHookState<TypeEffectiveness> {}
export interface UseTypeMatchupState extends BaseHookState<TypeMatchup> {}
export interface UsePokemonByTypeState
   extends BaseHookState<NamedAPIResource[]> {}
export interface UseMovesByTypeState
   extends BaseHookState<NamedAPIResource[]> {}

// Hook return types
export interface UseTypeReturn extends UseTypeState {
   refetch: () => void;
}

export interface UseTypeDetailsReturn extends UseTypeDetailsState {
   refetch: () => void;
}

export interface UseTypeListReturn extends UseTypeListState {
   refetch: () => void;
}

export interface UseAllTypesReturn extends UseAllTypesState {
   refetch: () => void;
}

export interface UseTypeEffectivenessReturn extends UseTypeEffectivenessState {
   refetch: () => void;
}

export interface UseTypeMatchupReturn extends UseTypeMatchupState {
   refetch: () => void;
}

export interface UsePokemonByTypeReturn extends UsePokemonByTypeState {
   refetch: () => void;
}

export interface UseMovesByTypeReturn extends UseMovesByTypeState {
   refetch: () => void;
}

// Error handling utility
export const handleError = (error: unknown): string => {
   if (error instanceof Error) return error.message;
   return "An unexpected error occurred";
};

// State updater functions
export const updateTypeState = (
   setState: React.Dispatch<React.SetStateAction<UseTypeState>>,
   updates: Partial<UseTypeState>
) => {
   setState((prev) => ({ ...prev, ...updates }));
};

export const updateTypeDetailsState = (
   setState: React.Dispatch<React.SetStateAction<UseTypeDetailsState>>,
   updates: Partial<UseTypeDetailsState>
) => {
   setState((prev) => ({ ...prev, ...updates }));
};

export const updateTypeListState = (
   setState: React.Dispatch<React.SetStateAction<UseTypeListState>>,
   updates: Partial<UseTypeListState>
) => {
   setState((prev) => ({ ...prev, ...updates }));
};

export const updateAllTypesState = (
   setState: React.Dispatch<React.SetStateAction<UseAllTypesState>>,
   updates: Partial<UseAllTypesState>
) => {
   setState((prev) => ({ ...prev, ...updates }));
};

export const updateTypeEffectivenessState = (
   setState: React.Dispatch<React.SetStateAction<UseTypeEffectivenessState>>,
   updates: Partial<UseTypeEffectivenessState>
) => {
   setState((prev) => ({ ...prev, ...updates }));
};

export const updateTypeMatchupState = (
   setState: React.Dispatch<React.SetStateAction<UseTypeMatchupState>>,
   updates: Partial<UseTypeMatchupState>
) => {
   setState((prev) => ({ ...prev, ...updates }));
};

export const updatePokemonByTypeState = (
   setState: React.Dispatch<React.SetStateAction<UsePokemonByTypeState>>,
   updates: Partial<UsePokemonByTypeState>
) => {
   setState((prev) => ({ ...prev, ...updates }));
};

export const updateMovesByTypeState = (
   setState: React.Dispatch<React.SetStateAction<UseMovesByTypeState>>,
   updates: Partial<UseMovesByTypeState>
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

export const useMemoizedTypeMatchup = (
   attackingType?: string,
   defendingType?: string
) => {
   return useMemo(() => {
      if (!attackingType || !defendingType) return null;
      return {
         attacking: attackingType.toLowerCase().trim(),
         defending: defendingType.toLowerCase().trim(),
      };
   }, [attackingType, defendingType]);
};

// Helper function to transform Type to TypeDetails
export const transformTypeToDetails = (type: Type): TypeDetails => {
   const formattedName = type.name.charAt(0).toUpperCase() + type.name.slice(1);

   return {
      ...type,
      formattedName,
      effectivenessChart: {
         superEffectiveAgainst: type.damage_relations.double_damage_to,
         notVeryEffectiveAgainst: type.damage_relations.half_damage_to,
         noEffectAgainst: type.damage_relations.no_damage_to,
         weakTo: type.damage_relations.double_damage_from,
         resistantTo: type.damage_relations.half_damage_from,
         immuneTo: type.damage_relations.no_damage_from,
      },
      pokemonCount: type.pokemon.length,
      movesCount: type.moves.length,
   };
};
