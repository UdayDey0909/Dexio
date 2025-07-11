// src/app/Pokemon/[id].tsx
import React, { useState, useMemo } from "react";
import {
   View,
   Text,
   StyleSheet,
   ScrollView,
   Image,
   TouchableOpacity,
   ActivityIndicator,
   SafeAreaView,
   StatusBar,
   Dimensions,
} from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import {
   usePokemonDetail,
   usePokemonTypeColors,
} from "@/Features/PokemonDetails/Hooks/usePokemonDetail";
import { Ionicons } from "@expo/vector-icons";

const { width: screenWidth } = Dimensions.get("window");

const PokemonDetailScreen: React.FC = () => {
   const { id } = useLocalSearchParams<{ id: string }>();
   const router = useRouter();
   const [activeTab, setActiveTab] = useState<"About">("About");

   const {
      pokemonData,
      loading,
      error,
      refetch,
      isShiny,
      toggleShiny,
      currentSprite,
      hasShinySprite,
   } = usePokemonDetail(id || "1");

   const { getTypeColor } = usePokemonTypeColors();

   const backgroundColor = useMemo(() => {
      if (
         !pokemonData.pokemon?.types ||
         pokemonData.pokemon.types.length === 0
      ) {
         return "#68A090";
      }
      return getTypeColor(pokemonData.pokemon.types[0].type.name);
   }, [pokemonData.pokemon?.types, getTypeColor]);

   if (loading) {
      return (
         <SafeAreaView style={[styles.container, { backgroundColor }]}>
            <StatusBar
               backgroundColor={backgroundColor}
               barStyle="light-content"
            />
            <View style={styles.loadingContainer}>
               <ActivityIndicator size="large" color="#fff" />
               <Text style={styles.loadingText}>Loading Pokémon...</Text>
            </View>
         </SafeAreaView>
      );
   }

   if (error) {
      return (
         <SafeAreaView style={[styles.container, { backgroundColor }]}>
            <StatusBar
               backgroundColor={backgroundColor}
               barStyle="light-content"
            />
            <View style={styles.errorContainer}>
               <Text style={styles.errorText}>{error}</Text>
               <TouchableOpacity style={styles.retryButton} onPress={refetch}>
                  <Text style={styles.retryButtonText}>Retry</Text>
               </TouchableOpacity>
            </View>
         </SafeAreaView>
      );
   }

   const { pokemon, species } = pokemonData;

   if (!pokemon || !species) {
      return (
         <SafeAreaView style={[styles.container, { backgroundColor }]}>
            <StatusBar
               backgroundColor={backgroundColor}
               barStyle="light-content"
            />
            <View style={styles.errorContainer}>
               <Text style={styles.errorText}>Pokémon not found</Text>
               <TouchableOpacity
                  style={styles.retryButton}
                  onPress={() => router.back()}
               >
                  <Text style={styles.retryButtonText}>Go Back</Text>
               </TouchableOpacity>
            </View>
         </SafeAreaView>
      );
   }

   return (
      <SafeAreaView style={[styles.container, { backgroundColor }]}>
         <StatusBar
            backgroundColor={backgroundColor}
            barStyle="light-content"
         />

         {/* Header */}
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
                  onPress={toggleShiny}
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

         {/* Species Info */}
         <View style={styles.speciesContainer}>
            <Text style={styles.speciesText}>
               {species.genera.find((g) => g.language.name === "en")?.genus ||
                  "Unknown Species"}
            </Text>
         </View>

         {/* Content Card */}
         <View style={styles.contentCard}>
            {/* Tab Navigation */}
            <View style={styles.tabContainer}>
               <TouchableOpacity
                  style={[styles.tab, styles.activeTab]}
                  onPress={() => setActiveTab("About")}
               >
                  <Text style={[styles.tabText, styles.activeTabText]}>
                     About
                  </Text>
               </TouchableOpacity>
            </View>

            {/* Tab Content */}
            <ScrollView
               style={styles.tabContent}
               showsVerticalScrollIndicator={false}
            >
               <PokemonAbout pokemon={pokemon} species={species} />
            </ScrollView>
         </View>
      </SafeAreaView>
   );
};

// About Tab Component
const PokemonAbout: React.FC<{
   pokemon: any;
   species: any;
}> = ({ pokemon, species }) => {
   const [showAllDescriptions, setShowAllDescriptions] = useState(false);
   const [useMetric, setUseMetric] = useState(true);

   const descriptions = useMemo(() => {
      return species.flavor_text_entries
         .filter((entry: any) => entry.language.name === "en")
         .map((entry: any) => ({
            text: entry.flavor_text.replace(/[\f\n\r]+/g, " "),
            version: entry.version?.name || "unknown",
         }))
         .slice(0, showAllDescriptions ? undefined : 3);
   }, [species.flavor_text_entries, showAllDescriptions]);

   const formatHeight = (height: number) => {
      if (useMetric) {
         return `${(height / 10).toFixed(1)} m`;
      } else {
         const totalInches = Math.round(height * 3.937);
         const feet = Math.floor(totalInches / 12);
         const inches = totalInches % 12;
         return `${feet}'${inches}"`;
      }
   };

   const formatWeight = (weight: number) => {
      if (useMetric) {
         return `${(weight / 10).toFixed(1)} kg`;
      } else {
         return `${(weight * 0.220462).toFixed(1)} lbs`;
      }
   };

   return (
      <View style={styles.aboutContainer}>
         {/* Descriptions */}
         <View style={styles.section}>
            <Text style={styles.sectionTitle}>Description</Text>
            {descriptions.map((desc: any, index: number) => (
               <View key={index} style={styles.descriptionItem}>
                  <Text style={styles.descriptionText}>{desc.text}</Text>
                  <Text style={styles.descriptionVersion}>
                     — {desc.version}
                  </Text>
               </View>
            ))}
            {species.flavor_text_entries.filter(
               (entry: any) => entry.language.name === "en"
            ).length > 3 && (
               <TouchableOpacity
                  style={styles.showMoreButton}
                  onPress={() => setShowAllDescriptions(!showAllDescriptions)}
               >
                  <Text style={styles.showMoreText}>
                     {showAllDescriptions ? "Show Less" : "Show More"}
                  </Text>
               </TouchableOpacity>
            )}
         </View>

         {/* Physical Attributes */}
         <View style={styles.section}>
            <View style={styles.sectionHeader}>
               <Text style={styles.sectionTitle}>Physical Attributes</Text>
               <TouchableOpacity
                  style={styles.unitToggle}
                  onPress={() => setUseMetric(!useMetric)}
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
                     {formatHeight(pokemon.height)}
                  </Text>
               </View>
               <View style={styles.attributeItem}>
                  <Text style={styles.attributeLabel}>Weight</Text>
                  <Text style={styles.attributeValue}>
                     {formatWeight(pokemon.weight)}
                  </Text>
               </View>
               <View style={styles.attributeItem}>
                  <Text style={styles.attributeLabel}>Base Experience</Text>
                  <Text style={styles.attributeValue}>
                     {pokemon.base_experience}
                  </Text>
               </View>
               <View style={styles.attributeItem}>
                  <Text style={styles.attributeLabel}>Color</Text>
                  <Text style={styles.attributeValue}>
                     {species.color?.name || "Unknown"}
                  </Text>
               </View>
            </View>
         </View>

         {/* Abilities */}
         <View style={styles.section}>
            <Text style={styles.sectionTitle}>Abilities</Text>
            {pokemon.abilities.map((ability: any, index: number) => (
               <View key={index} style={styles.abilityItem}>
                  <Text style={styles.abilityName}>{ability.ability.name}</Text>
                  <Text style={styles.abilityDescription}>
                     {ability.is_hidden ? "Hidden Ability" : "Normal Ability"}
                  </Text>
               </View>
            ))}
         </View>

         {/* Habitat & Growth */}
         <View style={styles.section}>
            <Text style={styles.sectionTitle}>Habitat & Growth</Text>
            <View style={styles.attributeGrid}>
               <View style={styles.attributeItem}>
                  <Text style={styles.attributeLabel}>Habitat</Text>
                  <Text style={styles.attributeValue}>
                     {species.habitat?.name || "Unknown"}
                  </Text>
               </View>
               <View style={styles.attributeItem}>
                  <Text style={styles.attributeLabel}>Growth Rate</Text>
                  <Text style={styles.attributeValue}>
                     {species.growth_rate?.name || "Unknown"}
                  </Text>
               </View>
               <View style={styles.attributeItem}>
                  <Text style={styles.attributeLabel}>Shape</Text>
                  <Text style={styles.attributeValue}>
                     {species.shape?.name || "Unknown"}
                  </Text>
               </View>
               <View style={styles.attributeItem}>
                  <Text style={styles.attributeLabel}>Generation</Text>
                  <Text style={styles.attributeValue}>
                     {species.generation?.name || "Unknown"}
                  </Text>
               </View>
            </View>
         </View>
      </View>
   );
};

const styles = StyleSheet.create({
   container: {
      flex: 1,
   },
   loadingContainer: {
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
   },
   loadingText: {
      color: "#fff",
      fontSize: 16,
      marginTop: 10,
   },
   errorContainer: {
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
      padding: 20,
   },
   errorText: {
      color: "#fff",
      fontSize: 16,
      textAlign: "center",
      marginBottom: 20,
   },
   retryButton: {
      backgroundColor: "rgba(255, 255, 255, 0.2)",
      paddingHorizontal: 20,
      paddingVertical: 10,
      borderRadius: 20,
   },
   retryButtonText: {
      color: "#fff",
      fontSize: 16,
      fontWeight: "bold",
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
      marginBottom: 10,
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
   speciesContainer: {
      alignItems: "center",
      paddingHorizontal: 20,
      marginBottom: 20,
   },
   speciesText: {
      fontSize: 16,
      color: "rgba(255, 255, 255, 0.9)",
   },
   contentCard: {
      flex: 1,
      backgroundColor: "#fff",
      borderTopLeftRadius: 30,
      borderTopRightRadius: 30,
      paddingTop: 20,
   },
   tabContainer: {
      flexDirection: "row",
      justifyContent: "center",
      paddingHorizontal: 20,
      marginBottom: 20,
   },
   tab: {
      paddingHorizontal: 20,
      paddingVertical: 10,
      borderRadius: 20,
      marginHorizontal: 5,
   },
   activeTab: {
      backgroundColor: "#f0f0f0",
   },
   tabText: {
      fontSize: 16,
      color: "#666",
   },
   activeTabText: {
      color: "#333",
      fontWeight: "bold",
   },
   tabContent: {
      flex: 1,
      paddingHorizontal: 20,
   },
   aboutContainer: {
      paddingBottom: 20,
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
   descriptionItem: {
      marginBottom: 15,
   },
   descriptionText: {
      fontSize: 14,
      color: "#666",
      lineHeight: 20,
      marginBottom: 5,
   },
   descriptionVersion: {
      fontSize: 12,
      color: "#999",
      fontStyle: "italic",
   },
   showMoreButton: {
      alignSelf: "flex-start",
      marginTop: 10,
   },
   showMoreText: {
      color: "#007AFF",
      fontSize: 14,
      fontWeight: "bold",
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
   abilityItem: {
      backgroundColor: "#f8f8f8",
      padding: 15,
      borderRadius: 10,
      marginBottom: 10,
   },
   abilityName: {
      fontSize: 16,
      fontWeight: "bold",
      color: "#333",
      textTransform: "capitalize",
      marginBottom: 5,
   },
   abilityDescription: {
      fontSize: 14,
      color: "#666",
   },
});

export default PokemonDetailScreen;
