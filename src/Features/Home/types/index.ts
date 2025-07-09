export interface PokemonCardData {
   id: number;
   name: string;
   image: { uri: string } | number;
   types: string[];
}

export interface PokemonCardProps {
   name: string;
   id: number;
   image: { uri: string } | number;
   types: string[];
   onPress?: () => void;
}
