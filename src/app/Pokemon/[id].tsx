// src/app/Pokemon/[id].tsx
import React from "react";
import { useLocalSearchParams } from "expo-router";
import { PokemonDetailScreen } from "@/Screens/PokemonDetailScreen";

const PokemonDetailPage: React.FC = () => {
   const { id } = useLocalSearchParams<{ id: string }>();

   return <PokemonDetailScreen pokemonId={id || "1"} />;
};

export default PokemonDetailPage;
