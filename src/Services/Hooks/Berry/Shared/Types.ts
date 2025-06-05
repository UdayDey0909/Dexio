import type { NamedAPIResourceList } from "pokenode-ts";

export interface UseResourceState<T> {
   data: T | null;
   loading: boolean;
   error: string | null;
}

export interface UseResourceListState<T> {
   data: T[];
   loading: boolean;
   error: string | null;
   hasMore: boolean;
}

export interface UseResourceListOptions {
   initialOffset?: number;
   limit?: number;
   autoFetch?: boolean;
}

export interface UseResourceListReturn<T> extends UseResourceListState<T> {
   loadMore: () => void;
   refresh: () => void;
}

export interface UseResourceReturn<T> extends UseResourceState<T> {
   refetch?: () => void;
}

// Generic service interface for consistent API
export interface ResourceService<T> {
   get: (identifier: string | number) => Promise<T>;
   getList: (offset?: number, limit?: number) => Promise<NamedAPIResourceList>;
}

// Error handling utility
export const createErrorMessage = (
   error: unknown,
   fallback: string
): string => {
   return error instanceof Error ? error.message : fallback;
};

// State update helpers
export const createLoadingState = <T>(
   prevState: UseResourceState<T>
): UseResourceState<T> => ({
   ...prevState,
   loading: true,
   error: null,
});

export const createSuccessState = <T>(data: T): UseResourceState<T> => ({
   data,
   loading: false,
   error: null,
});

export const createErrorState = <T>(error: string): UseResourceState<T> => ({
   data: null,
   loading: false,
   error,
});

export const createListLoadingState = <T>(
   prevState: UseResourceListState<T>
): UseResourceListState<T> => ({
   ...prevState,
   loading: true,
   error: null,
});

export const createListSuccessState = <T>(
   data: T[],
   hasMore: boolean,
   reset: boolean = false,
   prevData: T[] = []
): UseResourceListState<T> => ({
   data: reset ? data : [...prevData, ...data],
   loading: false,
   error: null,
   hasMore,
});

export const createListErrorState = <T>(
   error: string,
   prevData: T[] = []
): UseResourceListState<T> => ({
   data: prevData,
   loading: false,
   error,
   hasMore: false,
});
