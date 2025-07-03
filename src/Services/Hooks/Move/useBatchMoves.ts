// src/Services/Hooks/Move/useBatchMoves.ts
import { useState, useCallback, useMemo } from "react";
import { moveService } from "../../API";
import type { UseMoveFilterState, UseBatchMovesReturn } from "./Shared/Types";
import {
   handleError,
   updateMoveFilterState,
   createInitialMoveFilterState,
} from "./Shared/Types";

export const useBatchMoves = (): UseBatchMovesReturn => {
   const [state, setState] = useState<UseMoveFilterState>(
      createInitialMoveFilterState()
   );

   // Batch fetch function
   const fetchBatchMoves = useCallback(
      async (identifiers: (string | number)[]) => {
         if (!identifiers.length) return;

         updateMoveFilterState(setState, { loading: true, error: null });

         try {
            const moves = await moveService.batchGetMoves(identifiers);
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
         fetchBatchMoves,
      }),
      [state, fetchBatchMoves]
   );
};
