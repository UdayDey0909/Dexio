// src/Services/Hooks/Utility/useRandomResource.ts
import { useState, useCallback, useMemo } from "react";
import { utilityService } from "../../API";
import {
   UseRandomResourceState,
   UseRandomResourceReturn,
   handleError,
} from "./Shared/Types";

export const useRandomResource = <
   T = unknown
>(): UseRandomResourceReturn<T> => {
   const [state, setState] = useState<UseRandomResourceState<T>>({
      data: null,
      loading: false,
      error: null,
   });

   const fetchRandom = useCallback(async (endpoint: string) => {
      const trimmedEndpoint = endpoint?.trim().toLowerCase();

      if (!trimmedEndpoint) {
         setState({
            data: null,
            loading: false,
            error: "Endpoint is required",
         });
         return;
      }

      if (!utilityService.isValidEndpoint(trimmedEndpoint)) {
         setState({
            data: null,
            loading: false,
            error: `Invalid endpoint: ${trimmedEndpoint}`,
         });
         return;
      }

      setState((prev) => ({ ...prev, loading: true, error: null }));

      try {
         const resource = await utilityService.getRandomResource<T>(
            trimmedEndpoint
         );
         setState({
            data: resource,
            loading: false,
            error: null,
         });
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
         fetchRandom,
      }),
      [state, fetchRandom]
   );
};
