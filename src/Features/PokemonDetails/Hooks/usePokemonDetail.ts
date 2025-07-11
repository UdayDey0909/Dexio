import { useState, useEffect, useCallback, useMemo } from "react";
import { PokemonData } from "@/Services/API/Pokemon/PokemonData";
import { PokemonSpecies } from "@/Services/API/Pokemon/PokemonSpecies";
import { PokemonStats } from "@/Services/API/Pokemon/PokemonStats";
import type {
   Pokemon,
   PokemonSpecies as PokemonSpeciesType,
} from "pokenode-ts";

// Extended types to include shiny official artwork
interface ExtendedOfficialArtwork {
   front_default: string | null;
   front_shiny: string | null;
}

interface ExtendedPokemon extends Pokemon {
   sprites: Pokemon["sprites"] & {
      other?: {
         "official-artwork": ExtendedOfficialArtwork;
         [key: string]: any;
      };
   };
}

interface PokemonDetailData {
   pokemon: ExtendedPokemon | null;
   species: PokemonSpeciesType | null;
   stats: any | null;
}

interface UsePokemonDetailReturn {
   pokemonData: PokemonDetailData;
   loading: boolean;
   error: string | null;
   refetch: () => void;
   isShiny: boolean;
   toggleShiny: () => void;
   currentSprite: string;
   hasShinySprite: boolean;
}

const pokemonDataService = new PokemonData();
const pokemonSpeciesService = new PokemonSpecies();
const pokemonStatsService = new PokemonStats();

export const usePokemonDetail = (pokemonId: string): UsePokemonDetailReturn => {
   const [pokemonData, setPokemonData] = useState<PokemonDetailData>({
      pokemon: null,
      species: null,
      stats: null,
   });
   const [loading, setLoading] = useState(true);
   const [error, setError] = useState<string | null>(null);
   const [isShiny, setIsShiny] = useState(false);

   const fetchPokemonDetail = useCallback(async () => {
      if (!pokemonId) return;

      setLoading(true);
      setError(null);

      try {
         // Fetch Pokemon basic data
         const pokemon = (await pokemonDataService.getPokemon(
            pokemonId
         )) as ExtendedPokemon;

         // Fetch Pokemon species data
         const species = await pokemonSpeciesService.getPokemonSpecies(
            pokemonId
         );

         // Fetch Pokemon stats (optional, can be null if service doesn't exist)
         let stats = null;
         try {
            stats = await pokemonStatsService.getPokemonStats(pokemonId);
         } catch (statsError) {
            console.warn("Stats service not available:", statsError);
         }

         setPokemonData({
            pokemon,
            species,
            stats,
         });
      } catch (err) {
         setError(
            err instanceof Error
               ? err.message
               : "Failed to fetch Pokemon details"
         );
         console.error("Error fetching Pokemon details:", err);
      } finally {
         setLoading(false);
      }
   }, [pokemonId]);

   useEffect(() => {
      fetchPokemonDetail();
   }, [fetchPokemonDetail]);

   const refetch = useCallback(() => {
      fetchPokemonDetail();
   }, [fetchPokemonDetail]);

   const toggleShiny = useCallback(() => {
      setIsShiny((prev) => !prev);
   }, []);

   const currentSprite = useMemo(() => {
      if (!pokemonData.pokemon) return "";

      const sprites = pokemonData.pokemon.sprites;

      const officialArtwork = sprites.other?.[
         "official-artwork"
      ] as ExtendedOfficialArtwork;

      if (isShiny) {
         return (
            officialArtwork?.front_shiny ||
            sprites.front_shiny ||
            officialArtwork?.front_default ||
            sprites.front_default ||
            ""
         );
      } else {
         return officialArtwork?.front_default || sprites.front_default || "";
      }
   }, [pokemonData.pokemon, isShiny]);

   const hasShinySprite = useMemo(() => {
      if (!pokemonData.pokemon) return false;

      const sprites = pokemonData.pokemon.sprites;
      const officialArtwork = sprites.other?.[
         "official-artwork"
      ] as ExtendedOfficialArtwork;

      return Boolean(officialArtwork?.front_shiny || sprites.front_shiny);
   }, [pokemonData.pokemon]);

   return {
      pokemonData,
      loading,
      error,
      refetch,
      isShiny,
      toggleShiny,
      currentSprite,
      hasShinySprite,
   };
};

// Type colors mapping
const TYPE_COLORS: Record<string, string> = {
   normal: "#A8A878",
   fire: "#F08030",
   water: "#6890F0",
   electric: "#F8D030",
   grass: "#78C850",
   ice: "#98D8D8",
   fighting: "#C03028",
   poison: "#A040A0",
   ground: "#E0C068",
   flying: "#A890F0",
   psychic: "#F85888",
   bug: "#A8B820",
   rock: "#B8A038",
   ghost: "#705898",
   dragon: "#7038F8",
   dark: "#705848",
   steel: "#B8B8D0",
   fairy: "#EE99AC",
};

export const usePokemonTypeColors = () => {
   const getTypeColor = useCallback((type: string): string => {
      return TYPE_COLORS[type.toLowerCase()] || "#68A090";
   }, []);

   return { getTypeColor };
};
