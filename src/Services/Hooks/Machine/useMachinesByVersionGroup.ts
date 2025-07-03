import { useState, useEffect, useCallback, useMemo } from "react";
import { machineService } from "../../API";
import {
   type UseMachinesByVersionGroupState,
   type UseMachinesByVersionGroupReturn,
   updateMachinesByVersionGroupState,
   handleError,
   useMemoizedName,
} from "./Shared/Types";

export const useMachinesByVersionGroup = (
   versionGroupName?: string
): UseMachinesByVersionGroupReturn => {
   const [state, setState] = useState<UseMachinesByVersionGroupState>({
      data: null,
      loading: false,
      error: null,
   });

   // Memoize normalized name
   const normalizedName = useMemoizedName(versionGroupName);

   // Fetch function
   const fetchMachinesByVersionGroup = useCallback(
      async (groupName: string) => {
         updateMachinesByVersionGroupState(setState, {
            loading: true,
            error: null,
         });

         try {
            const machines = await machineService.getMachinesByVersionGroup(
               groupName
            );
            updateMachinesByVersionGroupState(setState, {
               data: machines,
               loading: false,
            });
         } catch (error) {
            updateMachinesByVersionGroupState(setState, {
               data: null,
               loading: false,
               error: handleError(error),
            });
         }
      },
      []
   );

   // Refetch function
   const refetch = useCallback(() => {
      if (normalizedName) {
         fetchMachinesByVersionGroup(normalizedName);
      }
   }, [normalizedName, fetchMachinesByVersionGroup]);

   // Effect for initial fetch
   useEffect(() => {
      if (normalizedName) {
         fetchMachinesByVersionGroup(normalizedName);
      }
   }, [normalizedName, fetchMachinesByVersionGroup]);

   // Memoized return
   return useMemo(() => ({ ...state, refetch }), [state, refetch]);
};
