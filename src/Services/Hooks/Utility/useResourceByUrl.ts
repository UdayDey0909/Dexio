// src/Services/Hooks/Utility/useResourceByUrl.ts
import { useState, useCallback, useMemo } from "react";
import { utilityService } from "../../API";
import {
   UseResourceState,
   UseResourceReturn,
   handleError,
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
         setState({
            data: null,
            loading: false,
            error: "URL is required",
         });
         return;
      }

      setState((prev) => ({ ...prev, loading: true, error: null }));

      try {
         const resource = await utilityService.getResourceByUrl<T>(trimmedUrl);
         setState({ data: resource, loading: false, error: null });
      } catch (error) {
         setState({
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
