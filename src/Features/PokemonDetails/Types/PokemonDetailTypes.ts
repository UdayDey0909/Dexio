import type {
   Pokemon,
   PokemonSpecies as PokemonSpeciesType,
} from "pokenode-ts";

export interface PokemonDetailData {
   pokemon: Pokemon | null;
   species: PokemonSpeciesType | null;
   stats: any | null;
}

export interface TabContentProps {
   pokemonData: PokemonDetailData;
   useMetric: boolean;
   onToggleMetric: () => void;
}
