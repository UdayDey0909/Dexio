import { useState, useEffect, useCallback } from "react";
import { moveService } from "../../API";
import type { Move } from "pokenode-ts";

interface UseMoveState {
   move: Move | null;
   loading: boolean;
   error: string | null;
}

interface UseMoveListState {
   moves: Array<{ name: string; url: string }>;
   loading: boolean;
   error: string | null;
   hasMore: boolean;
}

interface UseMoveFilterState {
   moves: Move[];
   loading: boolean;
   error: string | null;
}

// Main hook for getting a single move
export const useMove = (identifier?: string | number) => {
   const [state, setState] = useState<UseMoveState>({
      move: null,
      loading: false,
      error: null,
   });

   const fetchMove = useCallback(async (id: string | number) => {
      setState((prev) => ({ ...prev, loading: true, error: null }));

      try {
         const move = await moveService.getMove(id);
         setState({ move, loading: false, error: null });
      } catch (error) {
         setState({
            move: null,
            loading: false,
            error:
               error instanceof Error ? error.message : "Failed to fetch move",
         });
      }
   }, []);

   useEffect(() => {
      if (identifier) {
         fetchMove(identifier);
      }
   }, [identifier, fetchMove]);

   const refetch = useCallback(() => {
      if (identifier) {
         fetchMove(identifier);
      }
   }, [identifier, fetchMove]);

   return {
      ...state,
      refetch,
   };
};

// Hook for getting move list with pagination
export const useMoveList = (initialOffset: number = 0, limit: number = 20) => {
   const [state, setState] = useState<UseMoveListState>({
      moves: [],
      loading: false,
      error: null,
      hasMore: true,
   });
   const [offset, setOffset] = useState(initialOffset);

   const fetchMoves = useCallback(
      async (currentOffset: number, isLoadMore: boolean = false) => {
         setState((prev) => ({ ...prev, loading: true, error: null }));

         try {
            const response = await moveService.getMoveList(
               currentOffset,
               limit
            );
            const newMoves = response.results;

            setState((prev) => ({
               moves: isLoadMore ? [...prev.moves, ...newMoves] : newMoves,
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
                     : "Failed to fetch moves",
            }));
         }
      },
      [limit]
   );

   useEffect(() => {
      fetchMoves(offset);
   }, [offset, fetchMoves]);

   const loadMore = useCallback(() => {
      if (state.hasMore && !state.loading) {
         const newOffset = offset + limit;
         setOffset(newOffset);
         fetchMoves(newOffset, true);
      }
   }, [state.hasMore, state.loading, offset, limit, fetchMoves]);

   const refetch = useCallback(() => {
      setOffset(initialOffset);
      fetchMoves(initialOffset);
   }, [initialOffset, fetchMoves]);

   return {
      ...state,
      loadMore,
      refetch,
   };
};

// Hook for getting move details (with formatted properties)
export const useMoveDetails = (moveName?: string) => {
   const [state, setState] = useState<UseMoveState>({
      move: null,
      loading: false,
      error: null,
   });

   const fetchMoveDetails = useCallback(async (name: string) => {
      setState((prev) => ({ ...prev, loading: true, error: null }));

      try {
         const move = await moveService.getMoveDetails(name);
         setState({ move, loading: false, error: null });
      } catch (error) {
         setState({
            move: null,
            loading: false,
            error:
               error instanceof Error
                  ? error.message
                  : "Failed to fetch move details",
         });
      }
   }, []);

   useEffect(() => {
      if (moveName) {
         fetchMoveDetails(moveName);
      }
   }, [moveName, fetchMoveDetails]);

   const refetch = useCallback(() => {
      if (moveName) {
         fetchMoveDetails(moveName);
      }
   }, [moveName, fetchMoveDetails]);

   return {
      ...state,
      refetch,
   };
};

// Hook for filtering moves by power
export const useMovesByPower = () => {
   const [state, setState] = useState<UseMoveFilterState>({
      moves: [],
      loading: false,
      error: null,
   });

   const filterByPower = useCallback(
      async (minPower: number, maxPower?: number) => {
         setState((prev) => ({ ...prev, loading: true, error: null }));

         try {
            const moves = await moveService.filterMovesByPower(
               minPower,
               maxPower
            );
            setState({ moves, loading: false, error: null });
         } catch (error) {
            setState({
               moves: [],
               loading: false,
               error:
                  error instanceof Error
                     ? error.message
                     : "Failed to filter moves",
            });
         }
      },
      []
   );

   return {
      ...state,
      filterByPower,
   };
};

// Hook for getting Pokemon that learn a specific move
export const useMoveLearnedBy = (moveName?: string) => {
   const [state, setState] = useState<{
      pokemon: Array<{ name: string; url: string }>;
      loading: boolean;
      error: string | null;
   }>({
      pokemon: [],
      loading: false,
      error: null,
   });

   const fetchPokemonThatLearnMove = useCallback(async (name: string) => {
      setState((prev) => ({ ...prev, loading: true, error: null }));

      try {
         const pokemon = await moveService.getPokemonThatLearnMove(name);
         setState({ pokemon, loading: false, error: null });
      } catch (error) {
         setState({
            pokemon: [],
            loading: false,
            error:
               error instanceof Error
                  ? error.message
                  : "Failed to fetch Pokemon data",
         });
      }
   }, []);

   useEffect(() => {
      if (moveName) {
         fetchPokemonThatLearnMove(moveName);
      }
   }, [moveName, fetchPokemonThatLearnMove]);

   const refetch = useCallback(() => {
      if (moveName) {
         fetchPokemonThatLearnMove(moveName);
      }
   }, [moveName, fetchPokemonThatLearnMove]);

   return {
      ...state,
      refetch,
   };
};

// Hook for batch getting multiple moves
export const useBatchMoves = () => {
   const [state, setState] = useState<{
      moves: Move[];
      loading: boolean;
      error: string | null;
   }>({
      moves: [],
      loading: false,
      error: null,
   });

   const fetchBatchMoves = useCallback(
      async (identifiers: (string | number)[]) => {
         if (!identifiers.length) return;

         setState((prev) => ({ ...prev, loading: true, error: null }));

         try {
            const moves = await moveService.batchGetMoves(identifiers);
            setState({ moves, loading: false, error: null });
         } catch (error) {
            setState({
               moves: [],
               loading: false,
               error:
                  error instanceof Error
                     ? error.message
                     : "Failed to fetch moves",
            });
         }
      },
      []
   );

   return {
      ...state,
      fetchBatchMoves,
   };
};
