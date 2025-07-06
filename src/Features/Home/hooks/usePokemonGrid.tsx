// hooks/usePokemonGrid.tsx
import { useState, useEffect, useCallback, useMemo } from "react";
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

export const usePokemonGrid = (
   limit: number = 20,
   initialOffset: number = 0
): UsePokemonGridReturn => {
   const [state, setState] = useState<UsePokemonGridState>({
      pokemonData: [],
      loading: false,
      error: null,
      refreshing: false,
      hasMore: true,
      offset: initialOffset,
      loadingMore: false,
   });

   // Constants for Pokemon API limits
   const TOTAL_POKEMON = 1010; // Current total Pokemon count
   const BATCH_SIZE = Math.min(limit, 20); // Optimize batch size
   const PREFETCH_BUFFER = 5; // Number of items before end to start loading

   // Transform Pokemon to PokemonCardData
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

   // Optimized fetch function
   const fetchPokemon = useCallback(
      async (isRefresh = false, isLoadMore = false) => {
         try {
            // Prevent multiple simultaneous requests
            if (state.loading || state.loadingMore) return;

            // Calculate current offset
            const currentOffset = isRefresh ? 0 : state.offset;

            // Check if we've reached the end
            if (currentOffset >= TOTAL_POKEMON && !isRefresh) {
               setState((prev) => ({ ...prev, hasMore: false }));
               return;
            }

            // Set appropriate loading states
            setState((prev) => ({
               ...prev,
               loading:
                  !isRefresh && !isLoadMore && prev.pokemonData.length === 0,
               refreshing: isRefresh,
               loadingMore: isLoadMore,
               error: null,
            }));

            // Optionally, add a network check here if needed
            // For now, proceed without explicit connection check

            // Generate Pokemon IDs for pagination
            const pokemonIds = Array.from(
               { length: BATCH_SIZE },
               (_, index) => currentOffset + index + 1
            ).filter((id) => id <= TOTAL_POKEMON);

            // Batch fetch Pokemon details using IDs (more efficient)
            const pokemonList = await Promise.all(
               pokemonIds.map((id) => pokemonService.getPokemon(id))
            );

            // Transform to card data
            const transformedPokemon = pokemonList.map(transformPokemon);

            // Calculate new offset and hasMore
            const newOffset = currentOffset + pokemonList.length;
            const hasMoreData =
               newOffset < TOTAL_POKEMON && pokemonList.length === BATCH_SIZE;

            // Update state
            setState((prev) => ({
               ...prev,
               pokemonData: isRefresh
                  ? transformedPokemon
                  : [...prev.pokemonData, ...transformedPokemon],
               loading: false,
               refreshing: false,
               loadingMore: false,
               hasMore: hasMoreData,
               offset: newOffset,
            }));
         } catch (error) {
            console.error("Error fetching Pokemon:", error);
            setState((prev) => ({
               ...prev,
               loading: false,
               refreshing: false,
               loadingMore: false,
               error:
                  error instanceof Error
                     ? error.message
                     : "Failed to load Pokemon data",
            }));
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

   // Debounced load more to prevent rapid calls
   const loadMore = useCallback(
      (() => {
         let timeoutId: ReturnType<typeof setTimeout>;

         return () => {
            if (
               !state.hasMore ||
               state.loading ||
               state.refreshing ||
               state.loadingMore
            ) {
               return;
            }

            clearTimeout(timeoutId);
            timeoutId = setTimeout(() => {
               fetchPokemon(false, true);
            }, 300); // 300ms debounce
         };
      })(),
      [
         state.hasMore,
         state.loading,
         state.refreshing,
         state.loadingMore,
         fetchPokemon,
      ]
   );

   // Refresh function
   const onRefresh = useCallback(() => {
      setState((prev) => ({
         ...prev,
         offset: 0,
         hasMore: true,
         error: null,
      }));
      fetchPokemon(true, false);
   }, [fetchPokemon]);

   // Refetch function
   const refetch = useCallback(() => {
      setState((prev) => ({
         ...prev,
         offset: 0,
         hasMore: true,
         error: null,
      }));
      fetchPokemon(false, false);
   }, [fetchPokemon]);

   // Initial fetch
   useEffect(() => {
      if (state.pokemonData.length === 0) {
         fetchPokemon();
      }
   }, []); // Only run once on mount

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
