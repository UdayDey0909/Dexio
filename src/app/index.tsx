import React from "react";
import { View, ScrollView } from "react-native";
import { PokemonCard } from "../Components/PokemonCard"; // Adjust the import path if needed

export default function App() {
   return (
      <ScrollView>
         <PokemonCard pokemonId={1} />
         <PokemonCard pokemonId={4} />
         <PokemonCard pokemonId={7} />
      </ScrollView>
   );
}
