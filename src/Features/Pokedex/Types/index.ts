// Types/index.ts
import { ImageSourcePropType } from "react-native";

export interface PokemonCardData {
   id: number;
   name: string;
   image: ImageSourcePropType;
   types: string[];
}

export interface PokemonGridProps {
   pokemonData: PokemonCardData[];
   loading: boolean;
   error: string | null;
   refreshing?: boolean;
   onRefresh?: () => void;
   onLoadMore?: () => void;
}

// Additional types for the Pokemon data structure
export interface PokemonListItem {
   id: number;
   name: string;
   sprites: {
      front_default: string | null;
      other?: {
         "official-artwork"?: {
            front_default: string | null;
         };
      };
   };
   types: PokemonTypeSlot[];
}

export interface PokemonTypeSlot {
   slot: number;
   type: {
      name: string;
      url: string;
   };
}
