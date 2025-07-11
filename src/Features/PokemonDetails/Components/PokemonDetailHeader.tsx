import React from "react";
import { View, Text, StyleSheet, Image, TouchableOpacity } from "react-native";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { usePokemonTypeColors } from "../Hooks/usePokemonDetail";
import type { Pokemon } from "pokenode-ts";

interface PokemonDetailHeaderProps {
   pokemon: Pokemon;
   backgroundColor: string;
   currentSprite: string;
   isShiny: boolean;
   hasShinySprite: boolean;
   onToggleShiny: () => void;
}

export const PokemonDetailHeader: React.FC<PokemonDetailHeaderProps> = ({
   pokemon,
   backgroundColor,
   currentSprite,
   isShiny,
   hasShinySprite,
   onToggleShiny,
}) => {
   const router = useRouter();
   const { getTypeColor } = usePokemonTypeColors();

   return (
      <View style={[styles.headerContainer, { backgroundColor }]}>
         {/* Navigation Header */}
         <View style={styles.header}>
            <TouchableOpacity
               style={styles.backButton}
               onPress={() => router.back()}
            >
               <Ionicons name="arrow-back" size={24} color="#fff" />
            </TouchableOpacity>

            <View style={styles.headerInfo}>
               <Text style={styles.pokemonName}>{pokemon.name}</Text>
               <Text style={styles.pokemonId}>
                  #{pokemon.id.toString().padStart(3, "0")}
               </Text>
            </View>

            {hasShinySprite && (
               <TouchableOpacity
                  style={styles.shinyButton}
                  onPress={onToggleShiny}
               >
                  <Ionicons
                     name={isShiny ? "sparkles" : "sparkles-outline"}
                     size={24}
                     color="#fff"
                  />
               </TouchableOpacity>
            )}
         </View>

         {/* Pokemon Image */}
         <View style={styles.imageContainer}>
            <Image
               source={{ uri: currentSprite }}
               style={styles.pokemonImage}
               resizeMode="contain"
            />
         </View>

         {/* Types */}
         <View style={styles.typesContainer}>
            {pokemon.types.map((type, index) => (
               <View
                  key={index}
                  style={[
                     styles.typeChip,
                     { backgroundColor: getTypeColor(type.type.name) },
                  ]}
               >
                  <Text style={styles.typeText}>{type.type.name}</Text>
               </View>
            ))}
         </View>
      </View>
   );
};

const styles = StyleSheet.create({
   headerContainer: {
      paddingBottom: 20,
   },
   header: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      paddingHorizontal: 20,
      paddingVertical: 15,
   },
   backButton: {
      padding: 5,
   },
   headerInfo: {
      flex: 1,
      alignItems: "center",
   },
   pokemonName: {
      fontSize: 24,
      fontWeight: "bold",
      color: "#fff",
      textTransform: "capitalize",
   },
   pokemonId: {
      fontSize: 16,
      color: "rgba(255, 255, 255, 0.8)",
   },
   shinyButton: {
      padding: 5,
   },
   imageContainer: {
      alignItems: "center",
      paddingVertical: 20,
   },
   pokemonImage: {
      width: 200,
      height: 200,
   },
   typesContainer: {
      flexDirection: "row",
      justifyContent: "center",
      paddingHorizontal: 20,
   },
   typeChip: {
      paddingHorizontal: 16,
      paddingVertical: 8,
      borderRadius: 20,
      marginHorizontal: 5,
   },
   typeText: {
      color: "#fff",
      fontSize: 14,
      fontWeight: "bold",
      textTransform: "capitalize",
   },
});
