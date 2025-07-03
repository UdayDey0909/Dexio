import { useState, useEffect, useCallback, useMemo } from "react";
import { machineService } from "../../API";
import {
   type UseMachineState,
   type UseMachineReturn,
   updateMachineState,
   handleError,
   useMemoizedId,
} from "./Shared/Types";

export const useMachine = (id?: number): UseMachineReturn => {
   const [state, setState] = useState<UseMachineState>({
      data: null,
      loading: false,
      error: null,
   });

   // Memoize normalized identifier
   const normalizedId = useMemoizedId(id);

   // Fetch function
   const fetchMachine = useCallback(async (machineId: number) => {
      updateMachineState(setState, { loading: true, error: null });

      try {
         const machine = await machineService.getMachine(machineId);
         updateMachineState(setState, { data: machine, loading: false });
      } catch (error) {
         updateMachineState(setState, {
            data: null,
            loading: false,
            error: handleError(error),
         });
      }
   }, []);

   // Refetch function
   const refetch = useCallback(() => {
      if (normalizedId) {
         fetchMachine(normalizedId);
      }
   }, [normalizedId, fetchMachine]);

   // Effect for initial fetch
   useEffect(() => {
      if (normalizedId) {
         fetchMachine(normalizedId);
      }
   }, [normalizedId, fetchMachine]);

   // Memoized return
   return useMemo(() => ({ ...state, refetch }), [state, refetch]);
};
