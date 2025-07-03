import React from "react";
import {
   View,
   Text,
   Image,
   StyleSheet,
   ActivityIndicator,
   TouchableOpacity,
} from "react-native";
import { usePokemonDetails } from "../Services/Hooks/Pokemon/usePokemonDetails";

interface PokemonCardProps {
   pokemonId: number;
}

export const PokemonCard: React.FC<PokemonCardProps> = ({ pokemonId }) => {
   const {
      data: pokemon,
      loading,
      error,
      refetch,
   } = usePokemonDetails(pokemonId.toString());

   const getTypeColor = (type: string): string => {
      const colors: Record<string, string> = {
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
      return colors[type] || "#68A090";
   };

   if (loading) {
      return (
         <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color="#0066CC" />
            <Text style={styles.loadingText}>Loading Pokemon...</Text>
         </View>
      );
   }

   if (error) {
      return (
         <View style={styles.errorContainer}>
            <Text style={styles.errorText}>Error: {error}</Text>
            <TouchableOpacity style={styles.retryButton} onPress={refetch}>
               <Text style={styles.retryText}>Retry</Text>
            </TouchableOpacity>
         </View>
      );
   }

   if (!pokemon) {
      return (
         <View style={styles.errorContainer}>
            <Text style={styles.errorText}>No Pokemon data found</Text>
         </View>
      );
   }

   return (
      <View style={styles.container}>
         <View style={styles.header}>
            <Text style={styles.name}>
               {pokemon.name.charAt(0).toUpperCase() + pokemon.name.slice(1)}
            </Text>
            <Text style={styles.id}>
               #{pokemon.id.toString().padStart(3, "0")}
            </Text>
         </View>

         <View style={styles.imageContainer}>
            <Image
               source={{
                  uri:
                     pokemon.sprites.other?.["official-artwork"]
                        ?.front_default ||
                     pokemon.sprites.front_default ||
                     "https://via.placeholder.com/150",
               }}
               style={styles.image}
               resizeMode="contain"
            />
         </View>

         <View style={styles.typesContainer}>
            {pokemon.formattedTypes.map((type) => (
               <View
                  key={type.name}
                  style={[
                     styles.typeChip,
                     { backgroundColor: getTypeColor(type.name) },
                  ]}
               >
                  <Text style={styles.typeText}>
                     {type.name.charAt(0).toUpperCase() + type.name.slice(1)}
                  </Text>
               </View>
            ))}
         </View>

         <View style={styles.statsContainer}>
            <Text style={styles.sectionTitle}>Base Stats</Text>
            {pokemon.formattedStats.map((stat) => (
               <View key={stat.name} style={styles.statRow}>
                  <Text style={styles.statName}>
                     {stat.name.charAt(0).toUpperCase() + stat.name.slice(1)}:
                  </Text>
                  <Text style={styles.statValue}>{stat.baseStat}</Text>
               </View>
            ))}
            <View style={styles.totalStatsRow}>
               <Text style={styles.totalStatsLabel}>Total:</Text>
               <Text style={styles.totalStatsValue}>{pokemon.totalStats}</Text>
            </View>
         </View>

         <View style={styles.abilitiesContainer}>
            <Text style={styles.sectionTitle}>Abilities</Text>
            {pokemon.formattedAbilities.map((ability) => (
               <Text key={ability.name} style={styles.abilityText}>
                  •{" "}
                  {ability.name.charAt(0).toUpperCase() + ability.name.slice(1)}
                  {ability.isHidden && " (Hidden)"}
               </Text>
            ))}
         </View>

         <View style={styles.physicalContainer}>
            <Text style={styles.sectionTitle}>Physical</Text>
            <Text style={styles.physicalText}>
               Height: {(pokemon.height / 10).toFixed(1)} m
            </Text>
            <Text style={styles.physicalText}>
               Weight: {(pokemon.weight / 10).toFixed(1)} kg
            </Text>
         </View>

         {pokemon.generationInfo && (
            <View style={styles.generationContainer}>
               <Text style={styles.sectionTitle}>Generation Info</Text>
               <Text style={styles.generationText}>
                  Generation: {pokemon.generationInfo.generation}
               </Text>
               {pokemon.generationInfo.isLegendary && (
                  <Text style={styles.legendaryText}>⭐ Legendary</Text>
               )}
               {pokemon.generationInfo.isMythical && (
                  <Text style={styles.mythicalText}>✨ Mythical</Text>
               )}
            </View>
         )}
      </View>
   );
};

const styles = StyleSheet.create({
   container: {
      backgroundColor: "#fff",
      margin: 16,
      borderRadius: 12,
      padding: 16,
      shadowColor: "#000",
      shadowOffset: {
         width: 0,
         height: 2,
      },
      shadowOpacity: 0.25,
      shadowRadius: 3.84,
      elevation: 5,
   },
   loadingContainer: {
      alignItems: "center",
      justifyContent: "center",
      padding: 40,
      margin: 16,
      backgroundColor: "#f5f5f5",
      borderRadius: 12,
   },
   loadingText: {
      marginTop: 10,
      fontSize: 16,
      color: "#666",
   },
   errorContainer: {
      alignItems: "center",
      justifyContent: "center",
      padding: 20,
      margin: 16,
      backgroundColor: "#ffebee",
      borderRadius: 12,
   },
   errorText: {
      fontSize: 16,
      color: "#d32f2f",
      textAlign: "center",
      marginBottom: 10,
   },
   retryButton: {
      backgroundColor: "#0066CC",
      paddingHorizontal: 20,
      paddingVertical: 8,
      borderRadius: 6,
   },
   retryText: {
      color: "#fff",
      fontSize: 14,
      fontWeight: "bold",
   },
   header: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      marginBottom: 16,
   },
   name: {
      fontSize: 24,
      fontWeight: "bold",
      color: "#333",
   },
   id: {
      fontSize: 18,
      color: "#666",
      fontFamily: "monospace",
   },
   imageContainer: {
      alignItems: "center",
      marginBottom: 16,
   },
   image: {
      width: 150,
      height: 150,
   },
   typesContainer: {
      flexDirection: "row",
      justifyContent: "center",
      marginBottom: 20,
   },
   typeChip: {
      paddingHorizontal: 12,
      paddingVertical: 6,
      borderRadius: 16,
      marginHorizontal: 4,
   },
   typeText: {
      color: "#fff",
      fontSize: 14,
      fontWeight: "bold",
   },
   statsContainer: {
      marginBottom: 20,
   },
   sectionTitle: {
      fontSize: 18,
      fontWeight: "bold",
      marginBottom: 10,
      color: "#333",
   },
   statRow: {
      flexDirection: "row",
      justifyContent: "space-between",
      marginBottom: 4,
   },
   statName: {
      fontSize: 14,
      color: "#666",
      flex: 1,
   },
   statValue: {
      fontSize: 14,
      fontWeight: "bold",
      color: "#333",
   },
   totalStatsRow: {
      flexDirection: "row",
      justifyContent: "space-between",
      marginTop: 8,
      paddingTop: 8,
      borderTopWidth: 1,
      borderTopColor: "#eee",
   },
   totalStatsLabel: {
      fontSize: 16,
      fontWeight: "bold",
      color: "#333",
   },
   totalStatsValue: {
      fontSize: 16,
      fontWeight: "bold",
      color: "#0066CC",
   },
   abilitiesContainer: {
      marginBottom: 20,
   },
   abilityText: {
      fontSize: 14,
      color: "#666",
      marginBottom: 2,
   },
   physicalContainer: {
      marginBottom: 20,
   },
   physicalText: {
      fontSize: 14,
      color: "#666",
      marginBottom: 2,
   },
   generationContainer: {
      marginBottom: 10,
   },
   generationText: {
      fontSize: 14,
      color: "#666",
      marginBottom: 2,
   },
   legendaryText: {
      fontSize: 14,
      color: "#ff9800",
      fontWeight: "bold",
   },
   mythicalText: {
      fontSize: 14,
      color: "#9c27b0",
      fontWeight: "bold",
   },
});
