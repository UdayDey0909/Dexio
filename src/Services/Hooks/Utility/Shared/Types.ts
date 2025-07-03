// src/Services/Hooks/Utility/Shared/Types.ts
import { useMemo, useCallback } from "react";
import type { NamedAPIResourceList, APIResource } from "pokenode-ts";

// Base hook state interface
export interface BaseHookState<T> {
   data: T | null;
   loading: boolean;
   error: string | null;
}

// Resource-specific interfaces
export interface ResourceReference {
   name: string;
   url: string;
}

export interface PaginatedResponse<T> {
   count: number;
   next: string | null;
   previous: string | null;
   results: T[];
}

export interface PaginationInfo {
   total: number;
   hasNext: boolean;
   hasPrevious: boolean;
   currentResults: number;
   nextUrl: string | null;
   previousUrl: string | null;
}

export interface ResourceInfo {
   endpoint: string | null;
   id: number | null;
   name: string | null;
   isValid: boolean;
}

// Hook state interfaces
export interface UseResourceState<T> extends BaseHookState<T> {}

export interface UseBatchResourceState<T> extends BaseHookState<T[]> {}

export interface UseAllPagesState<T> extends BaseHookState<T[]> {}

export interface UseRandomResourceState<T> extends BaseHookState<T> {}

// Hook return types
export interface UseResourceReturn<T> extends UseResourceState<T> {
   fetch: (url: string) => Promise<void>;
}

export interface UseBatchResourceReturn<T> extends UseBatchResourceState<T> {
   fetchBatch: (urls: string[]) => Promise<void>;
}

export interface UseAllPagesReturn<T> extends UseAllPagesState<T> {
   fetchAllPages: (initialUrl: string, maxPages?: number) => Promise<void>;
}

export interface UseRandomResourceReturn<T> extends UseRandomResourceState<T> {
   fetchRandom: (endpoint: string) => Promise<void>;
}

export interface UseUtilityHelpersReturn {
   // URL utilities
   extractIdFromUrl: (url: string) => number | null;
   extractNameFromUrl: (url: string) => string | null;
   buildUrl: (endpoint: string, identifier?: string | number) => string;
   isValidUrl: (url: string) => boolean;

   // Resource info
   getResourceInfo: (url: string) => ResourceInfo;
   getEndpointFromUrl: (url: string) => string | null;

   // Pagination helpers
   getNextUrl: (response: { next: string | null }) => string | null;
   getPreviousUrl: (response: { previous: string | null }) => string | null;
   getPaginationInfo: <T>(response: PaginatedResponse<T>) => PaginationInfo;

   // Endpoint validation
   getEndpoints: () => string[];
   isValidEndpoint: (endpoint: string) => boolean;
}

// Error handling utility
export const handleError = (error: unknown): string => {
   if (error instanceof Error) return error.message;
   return "An unexpected error occurred";
};

// Memoization utilities
export const useMemoizedUrl = (url?: string) => {
   return useMemo(() => {
      return url?.trim() || null;
   }, [url]);
};

export const useMemoizedUrls = (urls?: string[]) => {
   return useMemo(() => {
      return urls?.filter((url) => url?.trim()) || [];
   }, [urls]);
};

export const useMemoizedEndpoint = (endpoint?: string) => {
   return useMemo(() => {
      return endpoint?.trim().toLowerCase() || null;
   }, [endpoint]);
};

export const useMemoizedMaxPages = (maxPages?: number) => {
   return useMemo(() => {
      return Math.min(Math.max(1, maxPages || 20), 50);
   }, [maxPages]);
};

// Common fetch wrapper - removed the problematic generic state updaters
export const createFetchWrapper = <T>(
   setState: React.Dispatch<React.SetStateAction<BaseHookState<T>>>,
   operation: () => Promise<T>
) => {
   return useCallback(async () => {
      setState((prev) => ({ ...prev, loading: true, error: null }));

      try {
         const result = await operation();
         setState({ data: result, loading: false, error: null });
      } catch (error) {
         setState({
            data: null,
            loading: false,
            error: handleError(error),
         });
      }
   }, [setState, operation]);
};
