import { useState, useEffect, useCallback } from "react";
import { evolutionService } from "../../API";
import type { EvolutionChain, EvolutionTrigger } from "pokenode-ts";

interface UseEvolutionChainState {
   evolutionChain: EvolutionChain | null;
   loading: boolean;
   error: string | null;
}

interface UseEvolutionTriggerState {
   evolutionTrigger: EvolutionTrigger | null;
   loading: boolean;
   error: string | null;
}

interface UseEvolutionListState {
   evolutionChains: Array<{ name: string; url: string }>;
   loading: boolean;
   error: string | null;
   hasMore: boolean;
}

interface UseEvolutionTriggerListState {
   triggers: Array<{ name: string; url: string }>;
   loading: boolean;
   error: string | null;
   hasMore: boolean;
}

// Hook for getting a single evolution chain by ID
export const useEvolutionChain = (id?: number) => {
   const [state, setState] = useState<UseEvolutionChainState>({
      evolutionChain: null,
      loading: false,
      error: null,
   });

   const fetchEvolutionChain = useCallback(async (chainId: number) => {
      setState((prev) => ({ ...prev, loading: true, error: null }));

      try {
         const evolutionChain = await evolutionService.getEvolutionChain(
            chainId
         );
         setState({ evolutionChain, loading: false, error: null });
      } catch (error) {
         setState({
            evolutionChain: null,
            loading: false,
            error:
               error instanceof Error
                  ? error.message
                  : "Failed to fetch evolution chain",
         });
      }
   }, []);

   useEffect(() => {
      if (id) {
         fetchEvolutionChain(id);
      }
   }, [id, fetchEvolutionChain]);

   const refetch = useCallback(() => {
      if (id) {
         fetchEvolutionChain(id);
      }
   }, [id, fetchEvolutionChain]);

   return {
      ...state,
      refetch,
   };
};

// Hook for getting evolution chain list with pagination
export const useEvolutionChainList = (
   initialOffset: number = 0,
   limit: number = 20
) => {
   const [state, setState] = useState<UseEvolutionListState>({
      evolutionChains: [],
      loading: false,
      error: null,
      hasMore: true,
   });
   const [offset, setOffset] = useState(initialOffset);

   const fetchEvolutionChains = useCallback(
      async (currentOffset: number, isLoadMore: boolean = false) => {
         setState((prev) => ({ ...prev, loading: true, error: null }));

         try {
            const response = await evolutionService.getEvolutionChainList(
               currentOffset,
               limit
            );
            const newChains = response.results;

            setState((prev) => ({
               evolutionChains: isLoadMore
                  ? [...prev.evolutionChains, ...newChains]
                  : newChains,
               loading: false,
               error: null,
               hasMore: response.next !== null,
            }));
         } catch (error) {
            setState((prev) => ({
               ...prev,
               loading: false,
               error:
                  error instanceof Error
                     ? error.message
                     : "Failed to fetch evolution chains",
            }));
         }
      },
      [limit]
   );

   useEffect(() => {
      fetchEvolutionChains(offset);
   }, [offset, fetchEvolutionChains]);

   const loadMore = useCallback(() => {
      if (state.hasMore && !state.loading) {
         const newOffset = offset + limit;
         setOffset(newOffset);
         fetchEvolutionChains(newOffset, true);
      }
   }, [state.hasMore, state.loading, offset, limit, fetchEvolutionChains]);

   const refetch = useCallback(() => {
      setOffset(initialOffset);
      fetchEvolutionChains(initialOffset);
   }, [initialOffset, fetchEvolutionChains]);

   return {
      ...state,
      loadMore,
      refetch,
   };
};

// Hook for getting evolution trigger
export const useEvolutionTrigger = (identifier?: string | number) => {
   const [state, setState] = useState<UseEvolutionTriggerState>({
      evolutionTrigger: null,
      loading: false,
      error: null,
   });

   const fetchEvolutionTrigger = useCallback(async (id: string | number) => {
      setState((prev) => ({ ...prev, loading: true, error: null }));

      try {
         const evolutionTrigger = await evolutionService.getEvolutionTrigger(
            id
         );
         setState({ evolutionTrigger, loading: false, error: null });
      } catch (error) {
         setState({
            evolutionTrigger: null,
            loading: false,
            error:
               error instanceof Error
                  ? error.message
                  : "Failed to fetch evolution trigger",
         });
      }
   }, []);

   useEffect(() => {
      if (identifier) {
         fetchEvolutionTrigger(identifier);
      }
   }, [identifier, fetchEvolutionTrigger]);

   const refetch = useCallback(() => {
      if (identifier) {
         fetchEvolutionTrigger(identifier);
      }
   }, [identifier, fetchEvolutionTrigger]);

   return {
      ...state,
      refetch,
   };
};

// Hook for getting evolution trigger list with pagination
export const useEvolutionTriggerList = (
   initialOffset: number = 0,
   limit: number = 20
) => {
   const [state, setState] = useState<UseEvolutionTriggerListState>({
      triggers: [],
      loading: false,
      error: null,
      hasMore: true,
   });
   const [offset, setOffset] = useState(initialOffset);

   const fetchTriggers = useCallback(
      async (currentOffset: number, isLoadMore: boolean = false) => {
         setState((prev) => ({ ...prev, loading: true, error: null }));

         try {
            const response = await evolutionService.getEvolutionTriggerList(
               currentOffset,
               limit
            );
            const newTriggers = response.results;

            setState((prev) => ({
               triggers: isLoadMore
                  ? [...prev.triggers, ...newTriggers]
                  : newTriggers,
               loading: false,
               error: null,
               hasMore: response.next !== null,
            }));
         } catch (error) {
            setState((prev) => ({
               ...prev,
               loading: false,
               error:
                  error instanceof Error
                     ? error.message
                     : "Failed to fetch evolution triggers",
            }));
         }
      },
      [limit]
   );

   useEffect(() => {
      fetchTriggers(offset);
   }, [offset, fetchTriggers]);

   const loadMore = useCallback(() => {
      if (state.hasMore && !state.loading) {
         const newOffset = offset + limit;
         setOffset(newOffset);
         fetchTriggers(newOffset, true);
      }
   }, [state.hasMore, state.loading, offset, limit, fetchTriggers]);

   const refetch = useCallback(() => {
      setOffset(initialOffset);
      fetchTriggers(initialOffset);
   }, [initialOffset, fetchTriggers]);

   return {
      ...state,
      loadMore,
      refetch,
   };
};

// Hook for getting full evolution chain for a Pokemon
export const useFullEvolutionChain = (pokemonName?: string) => {
   const [state, setState] = useState<UseEvolutionChainState>({
      evolutionChain: null,
      loading: false,
      error: null,
   });

   const fetchFullEvolutionChain = useCallback(async (name: string) => {
      setState((prev) => ({ ...prev, loading: true, error: null }));

      try {
         const evolutionChain = await evolutionService.getFullEvolutionChain(
            name
         );
         setState({ evolutionChain, loading: false, error: null });
      } catch (error) {
         setState({
            evolutionChain: null,
            loading: false,
            error:
               error instanceof Error
                  ? error.message
                  : "Failed to fetch full evolution chain",
         });
      }
   }, []);

   useEffect(() => {
      if (pokemonName) {
         fetchFullEvolutionChain(pokemonName);
      }
   }, [pokemonName, fetchFullEvolutionChain]);

   const refetch = useCallback(() => {
      if (pokemonName) {
         fetchFullEvolutionChain(pokemonName);
      }
   }, [pokemonName, fetchFullEvolutionChain]);

   return {
      ...state,
      refetch,
   };
};
