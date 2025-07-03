import { useState, useEffect, useCallback, useMemo } from "react";
import { typeService } from "../../API";
import {
   UseMovesByTypeState,
   UseMovesByTypeReturn,
   handleError,
   updateMovesByTypeState,
   useMemoizedIdentifier,
} from "./Shared/Types";

export const useMovesByType = (typeName?: string): UseMovesByTypeReturn => {
   const [state, setState] = useState<UseMovesByTypeState>({
      data: [],
      loading: false,
      error: null,
   });

   // Memoize normalized identifier
   const normalizedName = useMemoizedIdentifier(typeName);

   // Fetch function
   const fetchMovesByType = useCallback(async (name: string) => {
      updateMovesByTypeState(setState, { loading: true, error: null });

      try {
         const moves = await typeService.getMovesByType(name);
         updateMovesByTypeState(setState, { data: moves, loading: false });
      } catch (error) {
         updateMovesByTypeState(setState, {
            data: [],
            loading: false,
            error: handleError(error),
         });
      }
   }, []);

   // Refetch function
   const refetch = useCallback(() => {
      if (normalizedName && typeof normalizedName === "string") {
         fetchMovesByType(normalizedName);
      }
   }, [normalizedName, fetchMovesByType]);

   // Effect for initial fetch
   useEffect(() => {
      if (normalizedName && typeof normalizedName === "string") {
         fetchMovesByType(normalizedName);
      }
   }, [normalizedName, fetchMovesByType]);

   // Memoized return
   return useMemo(() => ({ ...state, refetch }), [state, refetch]);
};
