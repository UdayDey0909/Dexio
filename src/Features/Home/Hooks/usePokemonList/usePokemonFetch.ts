import { useCallback, useRef } from "react";
import { PokemonListState, PokemonListAction } from "./Types";
import { POKEMON_LIST_CONSTANTS } from "./Constants";
import { pokemonService } from "@/Services/API";
import {
   transformPokemonToCardData,
   generatePokemonIds,
   calculatePaginationData,
} from "./Utils";

interface UsePokemonFetchParams {
   state: PokemonListState;
   dispatch: React.Dispatch<PokemonListAction>;
   batchSize: number;
}

export const usePokemonFetch = ({
   state,
   dispatch,
   batchSize,
}: UsePokemonFetchParams) => {
   const abortControllerRef = useRef<AbortController | null>(null);
   const isMountedRef = useRef(true);

   const fetchPokemon = useCallback(
      async (isRefresh = false, isLoadMore = false) => {
         // Prevent multiple simultaneous requests
         if (state.loading || state.loadingMore) {
            console.warn("Fetch already in progress, skipping request");
            return;
         }

         // Cancel previous request if exists
         if (abortControllerRef.current) {
            abortControllerRef.current.abort();
         }

         // Create new abort controller
         abortControllerRef.current = new AbortController();

         try {
            // Calculate current offset
            const currentOffset = isRefresh ? 0 : state.offset;

            // Check if we've reached the end
            if (
               currentOffset >= POKEMON_LIST_CONSTANTS.TOTAL_POKEMON &&
               !isRefresh
            ) {
               dispatch({ type: "SET_HAS_MORE", payload: { hasMore: false } });
               return;
            }

            // Dispatch loading state
            dispatch({
               type: "FETCH_START",
               payload: { isRefresh, isLoadMore },
            });

            // Generate Pokemon IDs for pagination
            const pokemonIds = generatePokemonIds(
               currentOffset,
               batchSize,
               POKEMON_LIST_CONSTANTS.TOTAL_POKEMON
            );

            // Use batch fetch
            const pokemonList = await pokemonService.core.batchGetPokemon(
               pokemonIds
            );

            // Check if component is still mounted and request wasn't cancelled
            if (
               !isMountedRef.current ||
               abortControllerRef.current?.signal.aborted
            ) {
               return;
            }

            // Transform to card data
            const transformedPokemon = pokemonList.map(
               transformPokemonToCardData
            );

            // Calculate pagination data
            const { newOffset, hasMoreData } = calculatePaginationData(
               currentOffset,
               pokemonList.length,
               batchSize,
               POKEMON_LIST_CONSTANTS.TOTAL_POKEMON
            );

            // Dispatch success
            dispatch({
               type: "FETCH_SUCCESS",
               payload: {
                  data: transformedPokemon,
                  hasMore: hasMoreData,
                  offset: newOffset,
                  isRefresh,
               },
            });
         } catch (error) {
            // Don't handle aborted requests as errors
            if (error instanceof Error && error.name === "AbortError") {
               return;
            }

            console.error("Error fetching Pokemon:", error);

            // Only dispatch error if component is still mounted
            if (isMountedRef.current) {
               dispatch({
                  type: "FETCH_ERROR",
                  payload: {
                     error:
                        error instanceof Error
                           ? error.message
                           : "Failed to load Pokemon data",
                  },
               });
            }
         }
      },
      [state.offset, state.loading, state.loadingMore, batchSize, dispatch]
   );

   const cleanup = useCallback(() => {
      isMountedRef.current = false;

      // Cancel any pending requests
      if (abortControllerRef.current) {
         abortControllerRef.current.abort();
      }
   }, []);

   return {
      fetchPokemon,
      cleanup,
      isMountedRef,
   };
};
