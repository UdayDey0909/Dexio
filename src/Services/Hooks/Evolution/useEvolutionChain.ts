import { useState, useEffect, useCallback, useMemo } from "react";
import { evolutionService } from "../../API";
import {
   UseEvolutionChainState,
   UseEvolutionChainReturn,
   updateEvolutionChainState,
   handleError,
} from "./Shared/Types";

export const useEvolutionChain = (id?: number): UseEvolutionChainReturn => {
   const [state, setState] = useState<UseEvolutionChainState>({
      data: null,
      loading: false,
      error: null,
   });

   // Memoize normalized identifier
   const normalizedId = useMemo(() => {
      return id && id > 0 ? id : null;
   }, [id]);

   // Fetch function
   const fetchEvolutionChain = useCallback(async (chainId: number) => {
      updateEvolutionChainState(setState, { loading: true, error: null });

      try {
         const evolutionChain = await evolutionService.getEvolutionChain(
            chainId
         );
         updateEvolutionChainState(setState, {
            data: evolutionChain,
            loading: false,
         });
      } catch (error) {
         updateEvolutionChainState(setState, {
            data: null,
            loading: false,
            error: handleError(error),
         });
      }
   }, []);

   // Refetch function
   const refetch = useCallback(() => {
      if (normalizedId) {
         fetchEvolutionChain(normalizedId);
      }
   }, [normalizedId, fetchEvolutionChain]);

   // Effect for initial fetch
   useEffect(() => {
      if (normalizedId) {
         fetchEvolutionChain(normalizedId);
      }
   }, [normalizedId, fetchEvolutionChain]);

   // Memoized return
   return useMemo(() => ({ ...state, refetch }), [state, refetch]);
};
