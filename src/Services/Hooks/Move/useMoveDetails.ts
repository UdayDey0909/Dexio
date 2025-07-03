// src/Services/Hooks/Move/useMoveDetails.ts
import { useState, useEffect, useCallback, useMemo } from "react";
import { moveService } from "../../API";
import type { UseMoveDetailsState, UseMoveDetailsReturn } from "./Shared/Types";
import {
   handleError,
   updateMoveDetailsState,
   useMemoizedIdentifier,
   createInitialMoveDetailsState,
} from "./Shared/Types";

export const useMoveDetails = (moveName?: string): UseMoveDetailsReturn => {
   const [state, setState] = useState<UseMoveDetailsState>(
      createInitialMoveDetailsState()
   );

   // Memoize normalized identifier (only accept string for details)
   const normalizedMoveName = useMemoizedIdentifier(moveName);

   // Fetch function
   const fetchMoveDetails = useCallback(async (name: string) => {
      updateMoveDetailsState(setState, { loading: true, error: null });

      try {
         const moveDetails = await moveService.getMoveDetails(name);
         updateMoveDetailsState(setState, {
            data: moveDetails,
            loading: false,
         });
      } catch (error) {
         updateMoveDetailsState(setState, {
            data: null,
            loading: false,
            error: handleError(error),
         });
      }
   }, []);

   // Refetch function
   const refetch = useCallback(() => {
      if (normalizedMoveName && typeof normalizedMoveName === "string") {
         fetchMoveDetails(normalizedMoveName);
      }
   }, [normalizedMoveName, fetchMoveDetails]);

   // Effect for initial fetch
   useEffect(() => {
      if (normalizedMoveName && typeof normalizedMoveName === "string") {
         fetchMoveDetails(normalizedMoveName);
      }
   }, [normalizedMoveName, fetchMoveDetails]);

   // Memoized return
   return useMemo(() => ({ ...state, refetch }), [state, refetch]);
};
