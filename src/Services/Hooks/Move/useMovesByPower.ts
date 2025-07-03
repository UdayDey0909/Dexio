// src/Services/Hooks/Move/useMovesByPower.ts
import { useState, useCallback, useMemo } from "react";
import { moveService } from "../../API";
import type { UseMoveFilterState, UseMoveFilterReturn } from "./Shared/Types";
import {
   handleError,
   updateMoveFilterState,
   createInitialMoveFilterState,
} from "./Shared/Types";

export const useMovesByPower = (): UseMoveFilterReturn => {
   const [state, setState] = useState<UseMoveFilterState>(
      createInitialMoveFilterState()
   );

   // Filter by power function
   const filterByPower = useCallback(
      async (minPower: number, maxPower?: number) => {
         updateMoveFilterState(setState, { loading: true, error: null });

         try {
            const moves = await moveService.filterMovesByPower(
               minPower,
               maxPower
            );
            updateMoveFilterState(setState, { data: moves, loading: false });
         } catch (error) {
            updateMoveFilterState(setState, {
               data: [],
               loading: false,
               error: handleError(error),
            });
         }
      },
      []
   );

   // Memoized return
   return useMemo(
      () => ({
         ...state,
         filterByPower,
      }),
      [state, filterByPower]
   );
};
