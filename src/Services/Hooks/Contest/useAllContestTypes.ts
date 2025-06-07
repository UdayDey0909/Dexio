import { useState, useEffect, useCallback, useMemo } from "react";
import { contestService } from "../../API";
import {
   UseAllContestTypesState,
   UseAllContestTypesReturn,
   updateAllContestTypesState,
   handleError,
} from "./Shared/Types";

export const useAllContestTypes = (): UseAllContestTypesReturn => {
   const [state, setState] = useState<UseAllContestTypesState>({
      data: [],
      loading: false,
      error: null,
   });

   // Fetch function
   const fetchAllContestTypes = useCallback(async () => {
      updateAllContestTypesState(setState, { loading: true, error: null });

      try {
         const contestTypes = await contestService.getAllContestTypes();
         updateAllContestTypesState(setState, {
            data: contestTypes,
            loading: false,
         });
      } catch (error) {
         updateAllContestTypesState(setState, {
            data: [],
            loading: false,
            error: handleError(error),
         });
      }
   }, []);

   // Refetch function is the same as fetch function
   const refetch = fetchAllContestTypes;

   // Effect for initial fetch
   useEffect(() => {
      fetchAllContestTypes();
   }, [fetchAllContestTypes]);

   // Memoized return
   return useMemo(() => ({ ...state, refetch }), [state, refetch]);
};
