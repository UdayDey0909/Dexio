// src/Services/Hooks/Utility/useAllPages.ts
import { useState, useCallback, useMemo } from "react";
import { utilityService } from "../../API";
import {
   UseAllPagesState,
   UseAllPagesReturn,
   handleError,
} from "./Shared/Types";

export const useAllPages = <T = unknown>(): UseAllPagesReturn<T> => {
   const [state, setState] = useState<UseAllPagesState<T>>({
      data: null,
      loading: false,
      error: null,
   });

   const fetchAllPages = useCallback(
      async (initialUrl: string, maxPages: number = 20) => {
         const trimmedUrl = initialUrl?.trim();

         if (!trimmedUrl) {
            setState({
               data: null,
               loading: false,
               error: "Initial URL is required",
            });
            return;
         }

         const validatedMaxPages = Math.min(Math.max(1, maxPages), 50);
         setState((prev) => ({ ...prev, loading: true, error: null }));

         try {
            const allResults = await utilityService.getAllPages<T>(
               trimmedUrl,
               validatedMaxPages
            );
            setState({
               data: allResults,
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
      },
      []
   );

   return useMemo(
      () => ({
         ...state,
         fetchAllPages,
      }),
      [state, fetchAllPages]
   );
};
