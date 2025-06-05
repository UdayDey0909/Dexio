// src/Services/Hooks/shared/useResource.ts
import { useState, useEffect, useCallback } from "react";
import type { NamedAPIResourceList } from "pokenode-ts";
import type {
   UseResourceState,
   UseResourceListState,
   UseResourceListOptions,
   UseResourceReturn,
   UseResourceListReturn,
   ResourceService,
} from "./Types";
import {
   createErrorMessage,
   createLoadingState,
   createSuccessState,
   createErrorState,
   createListLoadingState,
   createListSuccessState,
   createListErrorState,
} from "./Types";

/**
 * Generic hook for fetching a single resource
 */
export const useResource = <T>(
   service: ResourceService<T>,
   identifier?: string | number,
   errorMessage: string = "Failed to fetch resource"
): UseResourceReturn<T> => {
   const [state, setState] = useState<UseResourceState<T>>({
      data: null,
      loading: false,
      error: null,
   });

   const fetchResource = useCallback(
      async (id: string | number) => {
         setState((prev) => createLoadingState(prev));

         try {
            const data = await service.get(id);
            setState(createSuccessState(data));
         } catch (err) {
            setState(createErrorState(createErrorMessage(err, errorMessage)));
         }
      },
      [service, errorMessage]
   );

   useEffect(() => {
      if (identifier) {
         fetchResource(identifier);
      }
   }, [identifier, fetchResource]);

   return {
      ...state,
      refetch: identifier ? () => fetchResource(identifier) : undefined,
   };
};

/**
 * Generic hook for fetching a list of resources with pagination
 */
export const useResourceList = <T>(
   service: ResourceService<T>,
   options: UseResourceListOptions = {},
   errorMessage: string = "Failed to fetch resource list"
): UseResourceListReturn<T> => {
   const { initialOffset = 0, limit = 20, autoFetch = true } = options;

   const [state, setState] = useState<UseResourceListState<T>>({
      data: [],
      loading: false,
      error: null,
      hasMore: true,
   });
   const [offset, setOffset] = useState(initialOffset);

   const fetchResources = useCallback(
      async (currentOffset: number, reset: boolean = false) => {
         setState((prev) => createListLoadingState(prev));

         try {
            const response: NamedAPIResourceList = await service.getList(
               currentOffset,
               limit
            );

            setState((prev) =>
               createListSuccessState(
                  response.results,
                  !!response.next,
                  reset,
                  prev.data
               )
            );
         } catch (err) {
            setState((prev) =>
               createListErrorState(
                  createErrorMessage(err, errorMessage),
                  prev.data
               )
            );
         }
      },
      [service, limit, errorMessage]
   );

   const loadMore = useCallback(() => {
      if (!state.loading && state.hasMore) {
         const nextOffset = offset + limit;
         setOffset(nextOffset);
         fetchResources(nextOffset, false);
      }
   }, [offset, limit, state.loading, state.hasMore, fetchResources]);

   const refresh = useCallback(() => {
      setOffset(initialOffset);
      fetchResources(initialOffset, true);
   }, [fetchResources, initialOffset]);

   useEffect(() => {
      if (autoFetch) {
         fetchResources(offset, true);
      }
   }, []); // Only run on mount when autoFetch is true

   return {
      ...state,
      loadMore,
      refresh,
   };
};

/**
 * Generic hook for fetching resources with custom fetch function
 */
export const useCustomResource = <T>(
   fetchFn: () => Promise<T>,
   dependencies: React.DependencyList,
   errorMessage: string = "Failed to fetch resource"
): UseResourceReturn<T> => {
   const [state, setState] = useState<UseResourceState<T>>({
      data: null,
      loading: false,
      error: null,
   });

   const executeCustomFetch = useCallback(async () => {
      setState((prev) => createLoadingState(prev));

      try {
         const data = await fetchFn();
         setState(createSuccessState(data));
      } catch (err) {
         setState(createErrorState(createErrorMessage(err, errorMessage)));
      }
   }, [fetchFn, errorMessage]);

   useEffect(() => {
      executeCustomFetch();
   }, dependencies);

   return {
      ...state,
      refetch: executeCustomFetch,
   };
};
