import { useState, useEffect, useCallback, useMemo } from "react";
import { machineService } from "../../API";
import {
   type UseTMsByMoveState,
   type UseTMsByMoveReturn,
   updateTMsByMoveState,
   handleError,
   useMemoizedName,
} from "./Shared/Types";

export const useTMsByMove = (moveName?: string): UseTMsByMoveReturn => {
   const [state, setState] = useState<UseTMsByMoveState>({
      data: null,
      loading: false,
      error: null,
   });

   // Memoize normalized name
   const normalizedName = useMemoizedName(moveName);

   // Fetch function
   const fetchTMsByMove = useCallback(async (move: string) => {
      updateTMsByMoveState(setState, { loading: true, error: null });

      try {
         const tms = await machineService.getTMsByMove(move);
         updateTMsByMoveState(setState, {
            data: tms,
            loading: false,
         });
      } catch (error) {
         updateTMsByMoveState(setState, {
            data: null,
            loading: false,
            error: handleError(error),
         });
      }
   }, []);

   // Refetch function
   const refetch = useCallback(() => {
      if (normalizedName) {
         fetchTMsByMove(normalizedName);
      }
   }, [normalizedName, fetchTMsByMove]);

   // Effect for initial fetch
   useEffect(() => {
      if (normalizedName) {
         fetchTMsByMove(normalizedName);
      }
   }, [normalizedName, fetchTMsByMove]);

   // Memoized return
   return useMemo(() => ({ ...state, refetch }), [state, refetch]);
};
