import { useState, useCallback } from "react";
import { utilityService } from "../../API";

interface UseResourceState<T> {
   data: T | null;
   loading: boolean;
   error: string | null;
}

interface UseBatchResourceState<T> {
   data: T[] | null;
   loading: boolean;
   error: string | null;
}

// Hook for fetching any resource by URL
export const useResourceByUrl = <T = any>() => {
   const [state, setState] = useState<UseResourceState<T>>({
      data: null,
      loading: false,
      error: null,
   });

   const fetchResource = useCallback(async (url: string) => {
      setState((prev) => ({ ...prev, loading: true, error: null }));

      try {
         const resource = await utilityService.getResourceByUrl<T>(url);
         setState({ data: resource, loading: false, error: null });
      } catch (error) {
         setState({
            data: null,
            loading: false,
            error:
               error instanceof Error
                  ? error.message
                  : "Failed to fetch resource",
         });
      }
   }, []);

   return {
      ...state,
      fetch: fetchResource,
   };
};

// Hook for batch fetching resources
export const useBatchResources = <T = any>() => {
   const [state, setState] = useState<UseBatchResourceState<T>>({
      data: null,
      loading: false,
      error: null,
   });

   const fetchBatch = useCallback(async (urls: string[]) => {
      setState((prev) => ({ ...prev, loading: true, error: null }));

      try {
         const resources = await utilityService.batchGetResources<T>(urls);
         // Filter out null results
         const validResources = resources.filter(
            (item): item is T => item !== null
         );
         setState({ data: validResources, loading: false, error: null });
      } catch (error) {
         setState({
            data: null,
            loading: false,
            error:
               error instanceof Error
                  ? error.message
                  : "Failed to fetch batch resources",
         });
      }
   }, []);

   return {
      ...state,
      fetchBatch,
   };
};

// Hook for getting all pages from paginated endpoint
export const useAllPages = <T = any>() => {
   const [state, setState] = useState<UseBatchResourceState<T>>({
      data: null,
      loading: false,
      error: null,
   });

   const fetchAllPages = useCallback(
      async (initialUrl: string, maxPages: number = 20) => {
         setState((prev) => ({ ...prev, loading: true, error: null }));

         try {
            const allResults = await utilityService.getAllPages<T>(
               initialUrl,
               maxPages
            );
            setState({ data: allResults, loading: false, error: null });
         } catch (error) {
            setState({
               data: null,
               loading: false,
               error:
                  error instanceof Error
                     ? error.message
                     : "Failed to fetch all pages",
            });
         }
      },
      []
   );

   return {
      ...state,
      fetchAllPages,
   };
};

// Hook for getting random resource from endpoint
export const useRandomResource = <T = any>() => {
   const [state, setState] = useState<UseResourceState<T>>({
      data: null,
      loading: false,
      error: null,
   });

   const fetchRandom = useCallback(async (endpoint: string) => {
      setState((prev) => ({ ...prev, loading: true, error: null }));

      try {
         const resource = await utilityService.getRandomResource<T>(endpoint);
         setState({ data: resource, loading: false, error: null });
      } catch (error) {
         setState({
            data: null,
            loading: false,
            error:
               error instanceof Error
                  ? error.message
                  : "Failed to fetch random resource",
         });
      }
   }, []);

   return {
      ...state,
      fetchRandom,
   };
};

// Utility functions hook (for URL parsing, validation, etc.)
export const useUtilityHelpers = () => {
   return {
      // URL utilities
      extractIdFromUrl: utilityService.extractIdFromUrl.bind(utilityService),
      extractNameFromUrl:
         utilityService.extractNameFromUrl.bind(utilityService),
      buildUrl: utilityService.buildUrl.bind(utilityService),
      isValidUrl: utilityService.isValidUrl.bind(utilityService),

      // Resource info
      getResourceInfo: utilityService.getResourceInfo.bind(utilityService),
      getEndpointFromUrl:
         utilityService.getEndpointFromUrl.bind(utilityService),

      // Pagination helpers
      getNextUrl: utilityService.getNextUrl.bind(utilityService),
      getPreviousUrl: utilityService.getPreviousUrl.bind(utilityService),
      getPaginationInfo: utilityService.getPaginationInfo.bind(utilityService),

      // Endpoint validation
      getEndpoints: utilityService.getEndpoints.bind(utilityService),
      isValidEndpoint: utilityService.isValidEndpoint.bind(utilityService),
   };
};
