// src/Features/PokemonDetail/Hooks/usePokemonDetail.ts
import { useState, useEffect, useCallback } from "react";
import { PokemonData } from "@/Services/API/Pokemon/PokemonData";
import { PokemonStats } from "@/Services/API/Pokemon/PokemonStats";
import { EvolutionService } from "@/Services/API/Evolution";
import { TypeService } from "@/Services/API/Type";
import { AbilityService } from "@/Services/API/Ability";
import { MoveService } from "@/Services/API/Move";
import type {
   Pokemon,
   PokemonSpecies,
   EvolutionChain,
   Type,
   Ability,
   Move,
} from "pokenode-ts";

export interface PokemonDetailData {
   pokemon: Pokemon | null;
   species: PokemonSpecies | null;
   evolutionChain: EvolutionChain | null;
   stats: any | null;
   moves: any[] | null;
   types: Type[] | null;
   abilities: Ability[] | null;
   typeEffectiveness: any | null;
}

export interface UsePokemonDetailReturn {
   pokemonData: PokemonDetailData;
   loading: boolean;
   error: string | null;
   refetch: () => void;
   isShiny: boolean;
   toggleShiny: () => void;
   currentSprite: string;
   hasShinySprite: boolean;
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
      types: null,
      abilities: null,
      typeEffectiveness: null,
   });
   const [loading, setLoading] = useState(true);
   const [error, setError] = useState<string | null>(null);
   const [isShiny, setIsShiny] = useState(false);

   const pokemonService = useMemo(() => new PokemonData(), []);
   const pokemonStatsService = useMemo(() => new PokemonStats(), []);
   const evolutionService = useMemo(() => new EvolutionService(), []);
   const typeService = useMemo(() => new TypeService(), []);
   const abilityService = useMemo(() => new AbilityService(), []);
   const moveService = useMemo(() => new MoveService(), []);

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

         // Fetch types data
         const typeNames = pokemon.types.map((t) => t.type.name);
         const types = await typeService.batchGetTypes(typeNames);

         // Fetch abilities data
         const abilityNames = pokemon.abilities.map((a) => a.ability.name);
         const abilities = (await abilityService.batchGetAbilities)
            ? await abilityService.batchGetAbilities(abilityNames)
            : await Promise.all(
                 abilityNames.map((name) => abilityService.getAbility(name))
              );

         // Calculate type effectiveness
         let typeEffectiveness = null;
         if (types.length > 0) {
            const effectiveness = await Promise.all(
               types.map((type) => typeService.getTypeEffectiveness(type.name))
            );
            typeEffectiveness = effectiveness;
         }

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
            types,
            abilities,
            typeEffectiveness,
         });
      } catch (err) {
         setError(
            err instanceof Error ? err.message : "Failed to fetch Pokemon data"
         );
      } finally {
         setLoading(false);
      }
   }, [
      pokemonId,
      pokemonService,
      pokemonStatsService,
      evolutionService,
      typeService,
      abilityService,
   ]);

   useEffect(() => {
      fetchPokemonData();
   }, [fetchPokemonData]);

   const refetch = useCallback(() => {
      fetchPokemonData();
   }, [fetchPokemonData]);

   const toggleShiny = useCallback(() => {
      setIsShiny((prev) => !prev);
   }, []);

   const currentSprite = useMemo(() => {
      if (!pokemonData.pokemon) return "";

      return isShiny
         ? pokemonData.pokemon.sprites.front_shiny ||
              pokemonData.pokemon.sprites.front_default
         : pokemonData.pokemon.sprites.front_default;
   }, [pokemonData.pokemon, isShiny]);

   const hasShinySprite = useMemo(() => {
      return pokemonData.pokemon?.sprites.front_shiny != null;
   }, [pokemonData.pokemon]);

   return {
      pokemonData,
      loading,
      error,
      refetch,
      isShiny,
      toggleShiny,
      currentSprite: currentSprite || "",
      hasShinySprite,
   };
};

// Utility function to extract ID from URL
const extractIdFromUrl = (url: string): number | null => {
   const match = url.match(/\/(\d+)\/$/);
   return match ? parseInt(match[1], 10) : null;
};

// Additional hook for Pokemon type colors
export const usePokemonTypeColors = () => {
   const typeColors: Record<string, string> = useMemo(
      () => ({
         normal: "#A8A878",
         fire: "#FA6555",
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
      }),
      []
   );

   const getTypeColor = useCallback(
      (type: string): string => {
         return typeColors[type.toLowerCase()] || "#68A090";
      },
      [typeColors]
   );

   const getTypeGradient = useCallback(
      (types: string[]): string[] => {
         if (types.length === 1) {
            const color = getTypeColor(types[0]);
            return [color, color];
         }
         return types.map((type) => getTypeColor(type));
      },
      [getTypeColor]
   );

   return {
      getTypeColor,
      getTypeGradient,
      typeColors,
   };
};
