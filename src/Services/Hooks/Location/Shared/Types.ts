import { useMemo } from "react";
import type {
   Location,
   LocationArea,
   Region,
   NamedAPIResourceList,
} from "pokenode-ts";

// Base hook state interface
export interface BaseHookState<T> {
   data: T | null;
   loading: boolean;
   error: string | null;
}

// Enhanced details interfaces (extend base API types)
export interface LocationDetails extends Location {
   // Add computed/enhanced properties if needed in the future
   formattedName: string;
   areaCount: number;
}

export interface LocationAreaDetails extends LocationArea {
   formattedName: string;
   encounterCount: number;
}

export interface RegionDetails extends Region {
   formattedName: string;
   locationCount: number;
}

// Specific hook state interfaces
export interface UseLocationState extends BaseHookState<Location> {}
export interface UseLocationDetailsState
   extends BaseHookState<LocationDetails> {}
export interface UseLocationListState
   extends BaseHookState<NamedAPIResourceList["results"]> {}

export interface UseLocationAreaState extends BaseHookState<LocationArea> {}
export interface UseLocationAreaDetailsState
   extends BaseHookState<LocationAreaDetails> {}
export interface UseLocationAreaListState
   extends BaseHookState<NamedAPIResourceList["results"]> {}

export interface UseRegionState extends BaseHookState<Region> {}
export interface UseRegionDetailsState extends BaseHookState<RegionDetails> {}
export interface UseRegionListState
   extends BaseHookState<NamedAPIResourceList["results"]> {}

export interface UseLocationsByRegionState
   extends BaseHookState<NamedAPIResourceList["results"]> {}

// Hook return types
export interface UseLocationReturn extends UseLocationState {
   refetch: () => void;
}

export interface UseLocationDetailsReturn extends UseLocationDetailsState {
   refetch: () => void;
}

export interface UseLocationListReturn extends UseLocationListState {
   refetch: () => void;
}

export interface UseLocationAreaReturn extends UseLocationAreaState {
   refetch: () => void;
}

export interface UseLocationAreaDetailsReturn
   extends UseLocationAreaDetailsState {
   refetch: () => void;
}

export interface UseLocationAreaListReturn extends UseLocationAreaListState {
   refetch: () => void;
}

export interface UseRegionReturn extends UseRegionState {
   refetch: () => void;
}

export interface UseRegionDetailsReturn extends UseRegionDetailsState {
   refetch: () => void;
}

export interface UseRegionListReturn extends UseRegionListState {
   refetch: () => void;
}

export interface UseLocationsByRegionReturn extends UseLocationsByRegionState {
   refetch: () => void;
}

// Error handling utility
export const handleError = (error: unknown): string => {
   if (error instanceof Error) return error.message;
   return "An unexpected error occurred";
};

// State updater functions for type safety
export const updateLocationState = (
   setState: React.Dispatch<React.SetStateAction<UseLocationState>>,
   updates: Partial<UseLocationState>
) => {
   setState((prev) => ({ ...prev, ...updates }));
};

export const updateLocationDetailsState = (
   setState: React.Dispatch<React.SetStateAction<UseLocationDetailsState>>,
   updates: Partial<UseLocationDetailsState>
) => {
   setState((prev) => ({ ...prev, ...updates }));
};

export const updateLocationListState = (
   setState: React.Dispatch<React.SetStateAction<UseLocationListState>>,
   updates: Partial<UseLocationListState>
) => {
   setState((prev) => ({ ...prev, ...updates }));
};

export const updateLocationAreaState = (
   setState: React.Dispatch<React.SetStateAction<UseLocationAreaState>>,
   updates: Partial<UseLocationAreaState>
) => {
   setState((prev) => ({ ...prev, ...updates }));
};

export const updateLocationAreaDetailsState = (
   setState: React.Dispatch<React.SetStateAction<UseLocationAreaDetailsState>>,
   updates: Partial<UseLocationAreaDetailsState>
) => {
   setState((prev) => ({ ...prev, ...updates }));
};

export const updateLocationAreaListState = (
   setState: React.Dispatch<React.SetStateAction<UseLocationAreaListState>>,
   updates: Partial<UseLocationAreaListState>
) => {
   setState((prev) => ({ ...prev, ...updates }));
};

export const updateRegionState = (
   setState: React.Dispatch<React.SetStateAction<UseRegionState>>,
   updates: Partial<UseRegionState>
) => {
   setState((prev) => ({ ...prev, ...updates }));
};

export const updateRegionDetailsState = (
   setState: React.Dispatch<React.SetStateAction<UseRegionDetailsState>>,
   updates: Partial<UseRegionDetailsState>
) => {
   setState((prev) => ({ ...prev, ...updates }));
};

export const updateRegionListState = (
   setState: React.Dispatch<React.SetStateAction<UseRegionListState>>,
   updates: Partial<UseRegionListState>
) => {
   setState((prev) => ({ ...prev, ...updates }));
};

export const updateLocationsByRegionState = (
   setState: React.Dispatch<React.SetStateAction<UseLocationsByRegionState>>,
   updates: Partial<UseLocationsByRegionState>
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

export const useMemoizedRegionName = (regionName?: string) => {
   return useMemo(() => {
      if (!regionName) return null;
      return regionName.toLowerCase().trim();
   }, [regionName]);
};
