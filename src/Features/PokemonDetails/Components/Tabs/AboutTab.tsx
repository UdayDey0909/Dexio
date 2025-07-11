import React from "react";
import {
   View,
   Text,
   StyleSheet,
   ScrollView,
   TouchableOpacity,
} from "react-native";
import { PokemonDetailData } from "../../Types/PokemonDetailTypes";
import { formatHeight, formatWeight } from "../../Utils/Formatters";

interface AboutTabProps {
   pokemonData: PokemonDetailData;
   useMetric: boolean;
   onToggleMetric: () => void;
}

export const AboutTab: React.FC<AboutTabProps> = ({
   pokemonData,
   useMetric,
   onToggleMetric,
}) => {
   const { pokemon, species } = pokemonData;

   const getDescription = () => {
      if (species?.flavor_text_entries) {
         const englishEntry = species.flavor_text_entries.find(
            (entry: any) => entry.language.name === "en"
         );
         return (
            englishEntry?.flavor_text.replace(/[\f\n\r]+/g, " ") ||
            "No description available"
         );
      }
      return "No description available";
   };

   const getGenus = () => {
      if (species?.genera) {
         const englishGenus = species.genera.find(
            (genus: any) => genus.language.name === "en"
         );
         return englishGenus?.genus || "Unknown Species";
      }
      return "Unknown Species";
   };

   if (!pokemon) return null;

   return (
      <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
         {/* Species Info */}
         <View style={styles.section}>
            <Text style={styles.speciesText}>{getGenus()}</Text>
         </View>

         {/* Description */}
         <View style={styles.section}>
            <Text style={styles.sectionTitle}>Description</Text>
            <Text style={styles.descriptionText}>{getDescription()}</Text>
         </View>

         {/* Physical Attributes */}
         <View style={styles.section}>
            <View style={styles.sectionHeader}>
               <Text style={styles.sectionTitle}>Physical Attributes</Text>
               <TouchableOpacity
                  style={styles.unitToggle}
                  onPress={onToggleMetric}
               >
                  <Text style={styles.unitToggleText}>
                     {useMetric ? "Metric" : "Imperial"}
                  </Text>
               </TouchableOpacity>
            </View>
            <View style={styles.attributeGrid}>
               <View style={styles.attributeItem}>
                  <Text style={styles.attributeLabel}>Height</Text>
                  <Text style={styles.attributeValue}>
                     {formatHeight(pokemon.height, useMetric)}
                  </Text>
               </View>
               <View style={styles.attributeItem}>
                  <Text style={styles.attributeLabel}>Weight</Text>
                  <Text style={styles.attributeValue}>
                     {formatWeight(pokemon.weight, useMetric)}
                  </Text>
               </View>
               <View style={styles.attributeItem}>
                  <Text style={styles.attributeLabel}>Base Experience</Text>
                  <Text style={styles.attributeValue}>
                     {pokemon.base_experience || "N/A"}
                  </Text>
               </View>
               <View style={styles.attributeItem}>
                  <Text style={styles.attributeLabel}>Order</Text>
                  <Text style={styles.attributeValue}>
                     {pokemon.order || "N/A"}
                  </Text>
               </View>
            </View>
         </View>
      </ScrollView>
   );
};

const styles = StyleSheet.create({
   container: {
      flex: 1,
      paddingTop: 20,
   },
   section: {
      marginBottom: 25,
   },
   sectionHeader: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      marginBottom: 15,
   },
   sectionTitle: {
      fontSize: 18,
      fontWeight: "bold",
      color: "#333",
      marginBottom: 15,
   },
   speciesText: {
      fontSize: 16,
      color: "#666",
      textAlign: "center",
      fontStyle: "italic",
   },
   descriptionText: {
      fontSize: 14,
      color: "#666",
      lineHeight: 20,
   },
   unitToggle: {
      backgroundColor: "#f0f0f0",
      paddingHorizontal: 12,
      paddingVertical: 6,
      borderRadius: 15,
   },
   unitToggleText: {
      fontSize: 12,
      color: "#666",
      fontWeight: "bold",
   },
   attributeGrid: {
      flexDirection: "row",
      flexWrap: "wrap",
      justifyContent: "space-between",
   },
   attributeItem: {
      width: "48%",
      backgroundColor: "#f8f8f8",
      padding: 15,
      borderRadius: 10,
      marginBottom: 10,
   },
   attributeLabel: {
      fontSize: 12,
      color: "#999",
      marginBottom: 5,
   },
   attributeValue: {
      fontSize: 16,
      fontWeight: "bold",
      color: "#333",
      textTransform: "capitalize",
   },
});
