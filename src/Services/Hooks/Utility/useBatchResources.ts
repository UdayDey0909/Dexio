// src/Services/Hooks/Utility/useBatchResources.ts
import { useState, useCallback, useMemo } from "react";
import { utilityService } from "../../API";
import {
   UseBatchResourceState,
   UseBatchResourceReturn,
   updateBatchResourceState,
   handleError,
   useMemoizedUrls,
} from "./Shared/Types";

export const useBatchResources = <T = unknown>(): UseBatchResourceReturn<T> => {
   const [state, setState] = useState<UseBatchResourceState<T>>({
      data: null,
      loading: false,
      error: null,
   });

   const fetchBatch = useCallback(async (urls: string[]) => {
      if (!Array.isArray(urls) || urls.length === 0) {
         updateBatchResourceState(setState, {
            data: [],
            loading: false,
            error: "URLs array cannot be empty",
         });
         return;
      }

      if (urls.length > 20) {
         updateBatchResourceState(setState, {
            data: null,
            loading: false,
            error: "Maximum 20 URLs allowed per batch",
         });
         return;
      }

      updateBatchResourceState(setState, { loading: true, error: null });

      try {
         const resources = await utilityService.batchGetResources<T>(urls);
         // Filter out null results and ensure type safety
         const validResources = resources.filter(
            (item): item is T => item !== null
         );
         updateBatchResourceState(setState, {
            data: validResources,
            loading: false,
         });
      } catch (error) {
         updateBatchResourceState(setState, {
            data: null,
            loading: false,
            error: handleError(error),
         });
      }
   }, []);

   return useMemo(
      () => ({
         ...state,
         fetchBatch,
      }),
      [state, fetchBatch]
   );
};
