import { useState, useEffect, useCallback } from "react";
import { machineService } from "../../API";
import type { Machine } from "pokenode-ts";

interface UseMachineState {
   machine: Machine | null;
   loading: boolean;
   error: string | null;
}

interface UseMachineListState {
   machines: any[] | null;
   loading: boolean;
   error: string | null;
   hasMore: boolean;
}

interface UseMachinesByVersionGroupState {
   machines: Machine[] | null;
   loading: boolean;
   error: string | null;
}

interface UseTMsByMoveState {
   tms: Machine[] | null;
   loading: boolean;
   error: string | null;
}

// Hook for getting a single machine by ID
export const useMachine = (id?: number) => {
   const [state, setState] = useState<UseMachineState>({
      machine: null,
      loading: false,
      error: null,
   });

   const fetchMachine = useCallback(async (machineId: number) => {
      setState((prev) => ({ ...prev, loading: true, error: null }));

      try {
         const machine = await machineService.getMachine(machineId);
         setState({ machine, loading: false, error: null });
      } catch (error) {
         setState({
            machine: null,
            loading: false,
            error:
               error instanceof Error
                  ? error.message
                  : "Failed to fetch machine",
         });
      }
   }, []);

   useEffect(() => {
      if (id) {
         fetchMachine(id);
      }
   }, [id, fetchMachine]);

   const refetch = useCallback(() => {
      if (id) {
         fetchMachine(id);
      }
   }, [id, fetchMachine]);

   return {
      ...state,
      refetch,
   };
};

// Hook for getting machine list with pagination
export const useMachineList = (offset = 0, limit = 20) => {
   const [state, setState] = useState<UseMachineListState>({
      machines: null,
      loading: false,
      error: null,
      hasMore: true,
   });

   const fetchMachines = useCallback(async () => {
      setState((prev) => ({ ...prev, loading: true, error: null }));

      try {
         const response = await machineService.getMachineList(offset, limit);
         setState({
            machines: response.results,
            loading: false,
            error: null,
            hasMore: !!response.next,
         });
      } catch (error) {
         setState({
            machines: null,
            loading: false,
            error:
               error instanceof Error
                  ? error.message
                  : "Failed to fetch machines",
            hasMore: false,
         });
      }
   }, [offset, limit]);

   useEffect(() => {
      fetchMachines();
   }, [fetchMachines]);

   return {
      ...state,
      refetch: fetchMachines,
   };
};

// Hook for getting machines by version group
export const useMachinesByVersionGroup = (versionGroupName?: string) => {
   const [state, setState] = useState<UseMachinesByVersionGroupState>({
      machines: null,
      loading: false,
      error: null,
   });

   const fetchMachinesByVersionGroup = useCallback(
      async (groupName: string) => {
         setState((prev) => ({ ...prev, loading: true, error: null }));

         try {
            const machines = await machineService.getMachinesByVersionGroup(
               groupName
            );
            setState({ machines, loading: false, error: null });
         } catch (error) {
            setState({
               machines: null,
               loading: false,
               error:
                  error instanceof Error
                     ? error.message
                     : "Failed to fetch machines by version group",
            });
         }
      },
      []
   );

   useEffect(() => {
      if (versionGroupName) {
         fetchMachinesByVersionGroup(versionGroupName);
      }
   }, [versionGroupName, fetchMachinesByVersionGroup]);

   const refetch = useCallback(() => {
      if (versionGroupName) {
         fetchMachinesByVersionGroup(versionGroupName);
      }
   }, [versionGroupName, fetchMachinesByVersionGroup]);

   return {
      ...state,
      refetch,
   };
};

// Hook for getting TMs by move name
export const useTMsByMove = (moveName?: string) => {
   const [state, setState] = useState<UseTMsByMoveState>({
      tms: null,
      loading: false,
      error: null,
   });

   const fetchTMsByMove = useCallback(async (move: string) => {
      setState((prev) => ({ ...prev, loading: true, error: null }));

      try {
         const tms = await machineService.getTMsByMove(move);
         setState({ tms, loading: false, error: null });
      } catch (error) {
         setState({
            tms: null,
            loading: false,
            error:
               error instanceof Error
                  ? error.message
                  : "Failed to fetch TMs by move",
         });
      }
   }, []);

   useEffect(() => {
      if (moveName) {
         fetchTMsByMove(moveName);
      }
   }, [moveName, fetchTMsByMove]);

   const refetch = useCallback(() => {
      if (moveName) {
         fetchTMsByMove(moveName);
      }
   }, [moveName, fetchTMsByMove]);

   return {
      ...state,
      refetch,
   };
};
