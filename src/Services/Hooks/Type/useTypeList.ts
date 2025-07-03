import { useState, useEffect, useCallback, useMemo } from "react";
import { typeService } from "../../API";
import {
   UseAllTypesState,
   UseAllTypesReturn,
   handleError,
   updateAllTypesState,
} from "./Shared/Types";

export const useAllTypes = (): UseAllTypesReturn => {
   const [state, setState] = useState<UseAllTypesState>({
      data: [],
      loading: false,
      error: null,
   });

   // Fetch function
   const fetchAllTypes = useCallback(async () => {
      updateAllTypesState(setState, { loading: true, error: null });

      try {
         const types = await typeService.getAllTypes();
         updateAllTypesState(setState, { data: types, loading: false });
      } catch (error) {
         updateAllTypesState(setState, {
            data: [],
            loading: false,
            error: handleError(error),
         });
      }
   }, []);

   // Refetch function
   const refetch = useCallback(() => {
      fetchAllTypes();
   }, [fetchAllTypes]);

   // Effect for initial fetch
   useEffect(() => {
      fetchAllTypes();
   }, [fetchAllTypes]);

   // Memoized return
   return useMemo(() => ({ ...state, refetch }), [state, refetch]);
};
