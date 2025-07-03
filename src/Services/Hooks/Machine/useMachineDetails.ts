import { useState, useEffect, useCallback, useMemo } from "react";
import { machineService } from "../../API";
import {
   type UseMachineDetailsState,
   type UseMachineDetailsReturn,
   updateMachineDetailsState,
   handleError,
   useMemoizedId,
} from "./Shared/Types";

export const useMachineDetails = (id?: number): UseMachineDetailsReturn => {
   const [state, setState] = useState<UseMachineDetailsState>({
      data: null,
      loading: false,
      error: null,
   });

   // Memoize normalized identifier
   const normalizedId = useMemoizedId(id);

   // Fetch function
   const fetchMachineDetails = useCallback(async (machineId: number) => {
      updateMachineDetailsState(setState, { loading: true, error: null });

      try {
         const machineDetails = await machineService.getMachineDetails(
            machineId
         );
         updateMachineDetailsState(setState, {
            data: machineDetails,
            loading: false,
         });
      } catch (error) {
         updateMachineDetailsState(setState, {
            data: null,
            loading: false,
            error: handleError(error),
         });
      }
   }, []);

   // Refetch function
   const refetch = useCallback(() => {
      if (normalizedId) {
         fetchMachineDetails(normalizedId);
      }
   }, [normalizedId, fetchMachineDetails]);

   // Effect for initial fetch
   useEffect(() => {
      if (normalizedId) {
         fetchMachineDetails(normalizedId);
      }
   }, [normalizedId, fetchMachineDetails]);

   // Memoized return
   return useMemo(() => ({ ...state, refetch }), [state, refetch]);
};
