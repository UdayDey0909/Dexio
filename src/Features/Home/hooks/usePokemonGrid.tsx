// hooks/usePokemonGrid.tsx
import {
   useState,
   useEffect,
   useCallback,
   useMemo,
   useRef,
   useReducer,
} from "react";
import { pokemonService } from "@/Services/API";
import type { Pokemon } from "pokenode-ts";
import { PokemonCardData } from "../Types";

interface UsePokemonGridState {
   pokemonData: PokemonCardData[];
   loading: boolean;
   error: string | null;
   refreshing: boolean;
   hasMore: boolean;
   offset: number;
   loadingMore: boolean;
}

interface UsePokemonGridReturn extends UsePokemonGridState {
   refetch: () => void;
   onRefresh: () => void;
   loadMore: () => void;
}

// Action types for useReducer
type PokemonGridAction =
   | {
        type: "FETCH_START";
        payload: { isRefresh: boolean; isLoadMore: boolean };
     }
   | {
        type: "FETCH_SUCCESS";
        payload: {
           data: PokemonCardData[];
           hasMore: boolean;
           offset: number;
           isRefresh: boolean;
        };
     }
   | { type: "FETCH_ERROR"; payload: { error: string } }
   | { type: "RESET" }
   | { type: "SET_HAS_MORE"; payload: { hasMore: boolean } };

// Reducer for managing complex state transitions
const pokemonGridReducer = (
   state: UsePokemonGridState,
   action: PokemonGridAction
): UsePokemonGridState => {
   switch (action.type) {
      case "FETCH_START":
         return {
            ...state,
            loading:
               !action.payload.isRefresh &&
               !action.payload.isLoadMore &&
               state.pokemonData.length === 0,
            refreshing: action.payload.isRefresh,
            loadingMore: action.payload.isLoadMore,
            error: null,
         };
      case "FETCH_SUCCESS":
         return {
            ...state,
            pokemonData: action.payload.isRefresh
               ? action.payload.data
               : [...state.pokemonData, ...action.payload.data],
            hasMore: action.payload.hasMore,
            offset: action.payload.offset,
            loading: false,
            refreshing: false,
            loadingMore: false,
            error: null,
         };
      case "FETCH_ERROR":
         return {
            ...state,
            loading: false,
            refreshing: false,
            loadingMore: false,
            error: action.payload.error,
         };
      case "RESET":
         return {
            ...state,
            pokemonData: [],
            offset: 0,
            hasMore: true,
            error: null,
            loading: false,
            refreshing: false,
            loadingMore: false,
         };
      case "SET_HAS_MORE":
         return {
            ...state,
            hasMore: action.payload.hasMore,
         };
      default:
         return state;
   }
};

export const usePokemonGrid = (
   limit: number = 20,
   initialOffset: number = 0
): UsePokemonGridReturn => {
   // Use useReducer for complex state management
   const [state, dispatch] = useReducer(pokemonGridReducer, {
      pokemonData: [],
      loading: false,
      error: null,
      refreshing: false,
      hasMore: true,
      offset: initialOffset,
      loadingMore: false,
   });

   // Refs for cleanup and preventing memory leaks
   const abortControllerRef = useRef<AbortController | null>(null);
   const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
   const isMountedRef = useRef(true);

   // Constants for Pokemon API limits
   const TOTAL_POKEMON = 1010;
   const BATCH_SIZE = Math.min(limit, 20);

   // Transform Pokemon to PokemonCardData - memoized to prevent recreations
   const transformPokemon = useCallback((pokemon: Pokemon): PokemonCardData => {
      return {
         id: pokemon.id,
         name: pokemon.name.charAt(0).toUpperCase() + pokemon.name.slice(1),
         image: {
            uri:
               pokemon.sprites.other?.["official-artwork"]?.front_default ||
               pokemon.sprites.front_default ||
               `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${pokemon.id}.png`,
         },
         types: pokemon.types.map(
            (type) =>
               type.type.name.charAt(0).toUpperCase() + type.type.name.slice(1)
         ),
      };
   }, []);

   // Optimized fetch function with proper error handling and cancellation
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
            if (currentOffset >= TOTAL_POKEMON && !isRefresh) {
               dispatch({ type: "SET_HAS_MORE", payload: { hasMore: false } });
               return;
            }

            // Dispatch loading state
            dispatch({
               type: "FETCH_START",
               payload: { isRefresh, isLoadMore },
            });

            // Generate Pokemon IDs for pagination
            const pokemonIds = Array.from(
               { length: BATCH_SIZE },
               (_, index) => currentOffset + index + 1
            ).filter((id) => id <= TOTAL_POKEMON);

            // Batch fetch Pokemon details using IDs
            const pokemonPromises = pokemonIds.map(async (id) => {
               // Check if request was cancelled
               if (abortControllerRef.current?.signal.aborted) {
                  throw new Error("Request cancelled");
               }
               return pokemonService.getPokemon(id);
            });

            const pokemonList = await Promise.all(pokemonPromises);

            // Check if component is still mounted and request wasn't cancelled
            if (
               !isMountedRef.current ||
               abortControllerRef.current?.signal.aborted
            ) {
               return;
            }

            // Transform to card data
            const transformedPokemon = pokemonList.map(transformPokemon);

            // Calculate new offset and hasMore
            const newOffset = currentOffset + pokemonList.length;
            const hasMoreData =
               newOffset < TOTAL_POKEMON && pokemonList.length === BATCH_SIZE;

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
      [
         state.offset,
         state.loading,
         state.loadingMore,
         BATCH_SIZE,
         transformPokemon,
      ]
   );

   // Debounced load more with proper cleanup
   const loadMore = useCallback(() => {
      if (
         !state.hasMore ||
         state.loading ||
         state.refreshing ||
         state.loadingMore
      ) {
         return;
      }

      // Clear existing timeout
      if (timeoutRef.current) {
         clearTimeout(timeoutRef.current);
      }

      // Set new timeout
      timeoutRef.current = setTimeout(() => {
         if (isMountedRef.current) {
            fetchPokemon(false, true);
         }
      }, 300);
   }, [
      state.hasMore,
      state.loading,
      state.refreshing,
      state.loadingMore,
      fetchPokemon,
   ]);

   // Refresh function
   const onRefresh = useCallback(() => {
      dispatch({ type: "RESET" });
      fetchPokemon(true, false);
   }, [fetchPokemon]);

   // Refetch function
   const refetch = useCallback(() => {
      dispatch({ type: "RESET" });
      fetchPokemon(false, false);
   }, [fetchPokemon]);

   // Initial fetch effect
   useEffect(() => {
      if (state.pokemonData.length === 0 && !state.loading && !state.error) {
         fetchPokemon();
      }
   }, []);

   // Cleanup effect
   useEffect(() => {
      return () => {
         isMountedRef.current = false;

         // Cancel any pending requests
         if (abortControllerRef.current) {
            abortControllerRef.current.abort();
         }

         // Clear any pending timeouts
         if (timeoutRef.current) {
            clearTimeout(timeoutRef.current);
         }
      };
   }, []);

   // Memoized return to prevent unnecessary re-renders
   return useMemo(
      () => ({
         ...state,
         refetch,
         onRefresh,
         loadMore,
      }),
      [state, refetch, onRefresh, loadMore]
   );
};
