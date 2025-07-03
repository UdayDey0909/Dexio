// src/Services/Hooks/Utility/useAllPages.ts
import { useState, useCallback, useMemo } from "react";
import { utilityService } from "../../API";
import {
   UseAllPagesState,
   UseAllPagesReturn,
   updateAllPagesState,
   handleError,
   useMemoizedUrl,
   useMemoizedMaxPages,
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
            updateAllPagesState(setState, {
               data: null,
               loading: false,
               error: "Initial URL is required",
            });
            return;
         }

         const validatedMaxPages = Math.min(Math.max(1, maxPages), 50);
         updateAllPagesState(setState, { loading: true, error: null });

         try {
            const allResults = await utilityService.getAllPages<T>(
               trimmedUrl,
               validatedMaxPages
            );
            updateAllPagesState(setState, {
               data: allResults,
               loading: false,
            });
         } catch (error) {
            updateAllPagesState(setState, {
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
