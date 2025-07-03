import React, { useState } from "react";
import {
   View,
   ScrollView,
   Text,
   TouchableOpacity,
   StyleSheet,
   SafeAreaView,
   StatusBar,
} from "react-native";
import { PokemonCard } from "../Components/PokemonCard";

export default function App() {
   const [selectedPokemon, setSelectedPokemon] = useState<number[]>([1, 4, 7]);

   const popularPokemon = [
      { id: 1, name: "Bulbasaur" },
      { id: 4, name: "Charmander" },
      { id: 7, name: "Squirtle" },
      { id: 25, name: "Pikachu" },
      { id: 39, name: "Jigglypuff" },
      { id: 54, name: "Psyduck" },
      { id: 92, name: "Gastly" },
      { id: 104, name: "Cubone" },
      { id: 113, name: "Chansey" },
      { id: 131, name: "Lapras" },
      { id: 143, name: "Snorlax" },
      { id: 150, name: "Mewtwo" },
   ];

   const handleRandomPokemon = () => {
      const randomIds: number[] = [];
      while (randomIds.length < 3) {
         const randomId = Math.floor(Math.random() * 151) + 1; // Gen 1 Pokemon
         if (!randomIds.includes(randomId)) {
            randomIds.push(randomId);
         }
      }
      setSelectedPokemon(randomIds);
   };

   const handlePresetPokemon = (pokemonIds: number[]) => {
      setSelectedPokemon(pokemonIds);
   };

   return (
      <SafeAreaView style={styles.container}>
         <StatusBar backgroundColor="#0066CC" barStyle="light-content" />

         <View style={styles.header}>
            <Text style={styles.headerTitle}>Pokemon Explorer</Text>
            <Text style={styles.headerSubtitle}>
               Using pokenode-ts wrapper with PokeAPI
            </Text>
         </View>

         <ScrollView style={styles.scrollView}>
            <View style={styles.controlsContainer}>
               <TouchableOpacity
                  style={styles.randomButton}
                  onPress={handleRandomPokemon}
               >
                  <Text style={styles.buttonText}>🎲 Random Pokemon</Text>
               </TouchableOpacity>

               <Text style={styles.sectionTitle}>Quick Select:</Text>
               <View style={styles.presetsContainer}>
                  <TouchableOpacity
                     style={styles.presetButton}
                     onPress={() => handlePresetPokemon([1, 4, 7])}
                  >
                     <Text style={styles.presetButtonText}>Starters</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                     style={styles.presetButton}
                     onPress={() => handlePresetPokemon([25, 26, 39])}
                  >
                     <Text style={styles.presetButtonText}>Popular</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                     style={styles.presetButton}
                     onPress={() => handlePresetPokemon([144, 145, 146])}
                  >
                     <Text style={styles.presetButtonText}>Legendary</Text>
                  </TouchableOpacity>
               </View>
            </View>

            <View style={styles.pokemonContainer}>
               {selectedPokemon.map((pokemonId) => (
                  <PokemonCard key={pokemonId} pokemonId={pokemonId} />
               ))}
            </View>

            <View style={styles.infoContainer}>
               <Text style={styles.infoTitle}>How this works:</Text>
               <Text style={styles.infoText}>
                  1. The PokemonCard component uses the usePokemonDetails hook
               </Text>
               <Text style={styles.infoText}>
                  2. The hook calls your PokemonService to fetch data from
                  PokeAPI
               </Text>
               <Text style={styles.infoText}>
                  3. Data is cached and error handling is built-in
               </Text>
               <Text style={styles.infoText}>
                  4. Enhanced details include formatted stats, abilities, and
                  generation info
               </Text>
            </View>
         </ScrollView>
      </SafeAreaView>
   );
}

const styles = StyleSheet.create({
   container: {
      flex: 1,
      backgroundColor: "#f5f5f5",
   },
   header: {
      backgroundColor: "#0066CC",
      padding: 20,
      paddingTop: 10,
   },
   headerTitle: {
      fontSize: 24,
      fontWeight: "bold",
      color: "#fff",
      textAlign: "center",
   },
   headerSubtitle: {
      fontSize: 14,
      color: "#CCE5FF",
      textAlign: "center",
      marginTop: 4,
   },
   scrollView: {
      flex: 1,
   },
   controlsContainer: {
      backgroundColor: "#fff",
      margin: 16,
      padding: 16,
      borderRadius: 12,
      shadowColor: "#000",
      shadowOffset: {
         width: 0,
         height: 2,
      },
      shadowOpacity: 0.1,
      shadowRadius: 3.84,
      elevation: 5,
   },
   randomButton: {
      backgroundColor: "#FF6B35",
      paddingHorizontal: 24,
      paddingVertical: 12,
      borderRadius: 8,
      alignItems: "center",
      marginBottom: 16,
   },
   buttonText: {
      color: "#fff",
      fontSize: 16,
      fontWeight: "bold",
   },
   sectionTitle: {
      fontSize: 16,
      fontWeight: "bold",
      marginBottom: 8,
      color: "#333",
   },
   presetsContainer: {
      flexDirection: "row",
      justifyContent: "space-between",
   },
   presetButton: {
      backgroundColor: "#E3F2FD",
      paddingHorizontal: 16,
      paddingVertical: 8,
      borderRadius: 6,
      flex: 1,
      marginHorizontal: 4,
      alignItems: "center",
   },
   presetButtonText: {
      color: "#0066CC",
      fontSize: 14,
      fontWeight: "600",
   },
   pokemonContainer: {
      flex: 1,
   },
   infoContainer: {
      backgroundColor: "#fff",
      margin: 16,
      padding: 16,
      borderRadius: 12,
      shadowColor: "#000",
      shadowOffset: {
         width: 0,
         height: 2,
      },
      shadowOpacity: 0.1,
      shadowRadius: 3.84,
      elevation: 5,
   },
   infoTitle: {
      fontSize: 16,
      fontWeight: "bold",
      marginBottom: 8,
      color: "#333",
   },
   infoText: {
      fontSize: 14,
      color: "#666",
      marginBottom: 4,
      lineHeight: 20,
   },
});
