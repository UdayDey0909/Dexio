import { useState, useEffect, useCallback, useMemo } from "react";
import { typeService } from "../../API";
import {
   UseTypeMatchupState,
   UseTypeMatchupReturn,
   handleError,
   updateTypeMatchupState,
   useMemoizedTypeMatchup,
} from "./Shared/Types";

export const useTypeMatchup = (
   attackingType?: string,
   defendingType?: string
): UseTypeMatchupReturn => {
   const [state, setState] = useState<UseTypeMatchupState>({
      data: null,
      loading: false,
      error: null,
   });

   // Memoize normalized type names
   const normalizedTypes = useMemoizedTypeMatchup(attackingType, defendingType);

   // Fetch function
   const fetchMatchup = useCallback(
      async (attacking: string, defending: string) => {
         updateTypeMatchupState(setState, { loading: true, error: null });

         try {
            const matchup = await typeService.getTypeMatchups(
               attacking,
               defending
            );
            updateTypeMatchupState(setState, { data: matchup, loading: false });
         } catch (error) {
            updateTypeMatchupState(setState, {
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
      if (normalizedTypes) {
         fetchMatchup(normalizedTypes.attacking, normalizedTypes.defending);
      }
   }, [normalizedTypes, fetchMatchup]);

   // Effect for initial fetch
   useEffect(() => {
      if (normalizedTypes) {
         fetchMatchup(normalizedTypes.attacking, normalizedTypes.defending);
      }
   }, [normalizedTypes, fetchMatchup]);

   // Memoized return
   return useMemo(() => ({ ...state, refetch }), [state, refetch]);
};
