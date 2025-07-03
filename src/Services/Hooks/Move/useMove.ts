// src/Services/Hooks/Move/useMove.ts
import { useState, useEffect, useCallback, useMemo } from "react";
import { moveService } from "../../API";
import type { UseMoveState, UseMoveReturn } from "./Shared/Types";
import {
   handleError,
   updateMoveState,
   useMemoizedIdentifier,
   createInitialMoveState,
} from "./Shared/Types";

export const useMove = (identifier?: string | number): UseMoveReturn => {
   const [state, setState] = useState<UseMoveState>(createInitialMoveState());

   // Memoize normalized identifier
   const normalizedIdentifier = useMemoizedIdentifier(identifier);

   // Fetch function
   const fetchMove = useCallback(async (id: string | number) => {
      updateMoveState(setState, { loading: true, error: null });

      try {
         const move = await moveService.getMove(id);
         updateMoveState(setState, { data: move, loading: false });
      } catch (error) {
         updateMoveState(setState, {
            data: null,
            loading: false,
            error: handleError(error),
         });
      }
   }, []);

   // Refetch function
   const refetch = useCallback(() => {
      if (normalizedIdentifier) {
         fetchMove(normalizedIdentifier);
      }
   }, [normalizedIdentifier, fetchMove]);

   // Effect for initial fetch
   useEffect(() => {
      if (normalizedIdentifier) {
         fetchMove(normalizedIdentifier);
      }
   }, [normalizedIdentifier, fetchMove]);

   // Memoized return
   return useMemo(() => ({ ...state, refetch }), [state, refetch]);
};
