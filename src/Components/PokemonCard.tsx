// components/PokemonCard.tsx
import React from "react";
import { View, Text, Image, StyleSheet } from "react-native";
import { usePokemon } from "../Hooks/usePokemon";
import {
   getPokemonImageUrl,
   formatPokemonId,
   capitalizeName,
   getTypeColor,
} from "../Utils/PokemonHelpers";

interface PokemonCardProps {
   pokemonId: number;
}

export const PokemonCard: React.FC<PokemonCardProps> = ({ pokemonId }) => {
   const { pokemon, loading, error } = usePokemon(pokemonId);

   if (loading) return <Text>Loading...</Text>;
   if (error) return <Text>Error: {error}</Text>;
   if (!pokemon) return null;

   return (
      <View style={styles.card}>
         <Text style={styles.id}>{formatPokemonId(pokemon.id)}</Text>
         <Image
            source={{ uri: getPokemonImageUrl(pokemon.id) }}
            style={styles.image}
         />
         <Text style={styles.name}>{capitalizeName(pokemon.name)}</Text>
         <View style={styles.types}>
            {pokemon.types.map((type, index) => (
               <View
                  key={index}
                  style={[
                     styles.typeChip,
                     { backgroundColor: getTypeColor(type.type.name) },
                  ]}
               >
                  <Text style={styles.typeText}>
                     {capitalizeName(type.type.name)}
                  </Text>
               </View>
            ))}
         </View>
      </View>
   );
};

const styles = StyleSheet.create({
   card: {
      backgroundColor: "white",
      borderRadius: 10,
      padding: 16,
      margin: 8,
      alignItems: "center",
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 4,
      elevation: 3,
   },
   id: {
      fontSize: 14,
      color: "#666",
      marginBottom: 8,
   },
   image: {
      width: 100,
      height: 100,
      marginBottom: 8,
   },
   name: {
      fontSize: 18,
      fontWeight: "bold",
      marginBottom: 8,
   },
   types: {
      flexDirection: "row",
      gap: 4,
   },
   typeChip: {
      paddingHorizontal: 8,
      paddingVertical: 4,
      borderRadius: 12,
   },
   typeText: {
      color: "white",
      fontSize: 12,
      fontWeight: "bold",
   },
});
