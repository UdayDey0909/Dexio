// src/Features/PokemonDetail/Hooks/usePokemonDetail.ts
import { useState, useEffect, useCallback } from "react";
import { PokemonData } from "@/Services/API/Pokemon/PokemonData";
import { PokemonStats } from "@/Services/API/Pokemon/PokemonStats";
import { EvolutionService } from "@/Services/API/Evolution";
import type { Pokemon, PokemonSpecies, EvolutionChain } from "pokenode-ts";

export interface PokemonDetailData {
   pokemon: Pokemon | null;
   species: PokemonSpecies | null;
   evolutionChain: EvolutionChain | null;
   stats: any | null;
   moves: any[] | null;
}

export interface UsePokemonDetailReturn {
   pokemonData: PokemonDetailData;
   loading: boolean;
   error: string | null;
   refetch: () => void;
}

export const usePokemonDetail = (
   pokemonId: string | number
): UsePokemonDetailReturn => {
   const [pokemonData, setPokemonData] = useState<PokemonDetailData>({
      pokemon: null,
      species: null,
      evolutionChain: null,
      stats: null,
      moves: null,
   });
   const [loading, setLoading] = useState(true);
   const [error, setError] = useState<string | null>(null);

   const pokemonService = new PokemonData();
   const pokemonStatsService = new PokemonStats();
   const evolutionService = new EvolutionService();

   const fetchPokemonData = useCallback(async () => {
      try {
         setLoading(true);
         setError(null);

         // Fetch Pokemon and Species data in parallel
         const [pokemon, species] = await Promise.all([
            pokemonService.getPokemon(pokemonId),
            pokemonService.getPokemonSpecies(pokemonId),
         ]);

         // Fetch additional data
         const [stats, moves] = await Promise.all([
            pokemonStatsService.getPokemonStats(pokemon.name),
            pokemonStatsService.getPokemonMoves(pokemon.name),
         ]);

         // Fetch evolution chain if available
         let evolutionChain: EvolutionChain | null = null;
         try {
            if (species.evolution_chain?.url) {
               const evolutionChainId = extractIdFromUrl(
                  species.evolution_chain.url
               );
               if (evolutionChainId) {
                  evolutionChain = await evolutionService.getEvolutionChain(
                     evolutionChainId
                  );
               }
            }
         } catch (evolutionError) {
            console.warn("Failed to fetch evolution chain:", evolutionError);
         }

         setPokemonData({
            pokemon,
            species,
            evolutionChain,
            stats,
            moves,
         });
      } catch (err) {
         setError(
            err instanceof Error ? err.message : "Failed to fetch Pokemon data"
         );
      } finally {
         setLoading(false);
      }
   }, [pokemonId]);

   useEffect(() => {
      fetchPokemonData();
   }, [fetchPokemonData]);

   const refetch = useCallback(() => {
      fetchPokemonData();
   }, [fetchPokemonData]);

   return {
      pokemonData,
      loading,
      error,
      refetch,
   };
};

// Utility function to extract ID from URL
const extractIdFromUrl = (url: string): number | null => {
   const match = url.match(/\/(\d+)\/$/);
   return match ? parseInt(match[1], 10) : null;
};

// Hook for Pokemon sprites
export const usePokemonSprites = (pokemon: Pokemon | null) => {
   const [currentSprite, setCurrentSprite] = useState<string>("");
   const [isShiny, setIsShiny] = useState(false);

   useEffect(() => {
      if (pokemon) {
         const sprite = isShiny
            ? pokemon.sprites.front_shiny || pokemon.sprites.front_default
            : pokemon.sprites.front_default;
         setCurrentSprite(sprite || "");
      }
   }, [pokemon, isShiny]);

   const toggleShiny = useCallback(() => {
      setIsShiny((prev) => !prev);
   }, []);

   return {
      currentSprite,
      isShiny,
      toggleShiny,
      hasShinySprite: pokemon?.sprites.front_shiny != null,
   };
};
