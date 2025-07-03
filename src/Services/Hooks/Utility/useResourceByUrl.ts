// src/Services/Hooks/Utility/useResourceByUrl.ts
import { useState, useCallback, useMemo } from "react";
import { utilityService } from "../../API";
import {
   UseResourceState,
   UseResourceReturn,
   updateResourceState,
   handleError,
   useMemoizedUrl,
} from "./Shared/Types";

export const useResourceByUrl = <T = unknown>(): UseResourceReturn<T> => {
   const [state, setState] = useState<UseResourceState<T>>({
      data: null,
      loading: false,
      error: null,
   });

   const fetchResource = useCallback(async (url: string) => {
      const trimmedUrl = url?.trim();

      if (!trimmedUrl) {
         updateResourceState(setState, {
            data: null,
            loading: false,
            error: "URL is required",
         });
         return;
      }

      updateResourceState(setState, { loading: true, error: null });

      try {
         const resource = await utilityService.getResourceByUrl<T>(trimmedUrl);
         updateResourceState(setState, { data: resource, loading: false });
      } catch (error) {
         updateResourceState(setState, {
            data: null,
            loading: false,
            error: handleError(error),
         });
      }
   }, []);

   return useMemo(
      () => ({
         ...state,
         fetch: fetchResource,
      }),
      [state, fetchResource]
   );
};
