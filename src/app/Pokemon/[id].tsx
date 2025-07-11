// app/pokemon/[id].tsx
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
   Alert,
} from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { usePokemonDetail, usePokemonTypeColors } from "@/Features/PokemonDetails/Hooks/usePokemonDetail";
import { Ionicons } from "@expo/vector-icons";
import { lightThemeColors } from "@/Theme/Core/Variants";

const { width: screenWidth, height: screenHeight } = Dimensions.get("window");

const PokemonDetailScreen: React.FC = () => {
   const { id } = useLocalSearchParams<{ id: string }>();
   const router = useRouter();
   const [activeTab, setActiveTab] = useState<"About" | "Stats" | "Evolution" | "Moves">("About");
   
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

   const { getTypeColor, getTypeGradient } = usePokemonTypeColors();

   const backgroundColor = useMemo(() => {
      if (!pokemonData.pokemon?.types || pokemonData.pokemon.types.length === 0) {
         return lightThemeColors.background.primary;
      }
      return getTypeColor(pokemonData.pokemon.types[0].type.name);
   }, [pokemonData.pokemon?.types, getTypeColor]);

   const tabs = ["About", "Stats", "Evolution", "Moves"] as const;

   if (loading) {
      return (
         <SafeAreaView style={[styles.container, { backgroundColor }]}>
            <StatusBar backgroundColor={backgroundColor} barStyle="light-content" />
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
            <StatusBar backgroundColor={backgroundColor} barStyle="light-content" />
            <View style={styles.errorContainer}>
               <Text style={styles.errorText}>{error}</Text>
               <TouchableOpacity style={styles.retryButton} onPress={refetch}>
                  <Text style={styles.retryButtonText}>Retry</Text>
               </TouchableOpacity>
            </View>
         </SafeAreaView>
      );
   }

   const { pokemon, species, evolutionChain, stats, moves, types, abilities, typeEffectiveness } = pokemonData;

   if (!pokemon || !species) {
      return (
         <SafeAreaView style={[styles.container, { backgroundColor }]}>
            <StatusBar backgroundColor={backgroundColor} barStyle="light-content" />
            <View style={styles.errorContainer}>
               <Text style={styles.errorText}>Pokémon not found</Text>
               <TouchableOpacity style={styles.retryButton} onPress={() => router.back()}>
                  <Text style={styles.retryButtonText}>Go Back</Text>
               </TouchableOpacity>
            </View>
         </SafeAreaView>
      );
   }

   return (
      <SafeAreaView style={[styles.container, { backgroundColor }]}>
         <StatusBar backgroundColor={backgroundColor} barStyle="light-content" />
         
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
               <Text style={styles.pokemonId}>#{pokemon.id.toString().padStart(3, "0")}</Text>
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
               {species.genera.find(g => g.language.name === "en")?.genus || "Unknown Species"}
            </Text>
         </View>

         {/* Content Card */}
         <View style={styles.contentCard}>
            {/* Tab Navigation */}
            <View style={styles.tabContainer}>
               {tabs.map((tab) => (
                  <TouchableOpacity
                     key={tab}
                     style={[
                        styles.tab,
                        activeTab === tab && styles.activeTab,
                     ]}
                     onPress={() => setActiveTab(tab)}
                  >
                     <Text
                        style={[
                           styles.tabText,
                           activeTab === tab && styles.activeTabText,
                        ]}
                     >
                        {tab}
                     </Text>
                  </TouchableOpacity>
               ))}
            </View>

            {/* Tab Content */}
            <ScrollView style={styles.tabContent} showsVerticalScrollIndicator={false}>
               {activeTab === "About" && (
                  <PokemonAbout
                     pokemon={pokemon}
                     species={species}
                     abilities={abilities}
                     typeEffectiveness={typeEffectiveness}
                  />
               )}
               {activeTab === "Stats" && (
                  <PokemonStats pokemon={pokemon} stats={stats} />
               )}
               {activeTab === "Evolution" && (
                  <PokemonEvolution 
                     evolutionChain={evolutionChain}
                     currentPokemon={pokemon}
                  />
               )}
               {activeTab === "Moves" && (
                  <PokemonMoves moves={moves} />
               )}
            </ScrollView>
         </View>
      </SafeAreaView>
   );
};

// About Tab Component
const PokemonAbout: React.FC<{
   pokemon: any;
   species: any;
   abilities: any[] | null;
   typeEffectiveness: any;
}> = ({ pokemon, species, abilities, typeEffectiveness }) => {
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
                  <Text style={styles.descriptionVersion}>— {desc.version}</Text>
               </View>
            ))}
            {species.flavor_text_entries.length > 3 && (
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
                  <Text style={styles.attributeValue}>{formatHeight(pokemon.height)}</Text>
               </View>
               <View style={styles.attributeItem}>
                  <Text style={styles.attributeLabel}>Weight</Text>
                  <Text style={styles.attributeValue}>{formatWeight(pokemon.weight)}</Text>
               </View>
               <View style={styles.attributeItem}>
                  <Text style={styles.attributeLabel}>Base Experience</Text>
                  <Text style={styles.attributeValue}>{pokemon.base_experience}</Text>
               </View>
               <View style={styles.attributeItem}>
                  <Text style={styles.attributeLabel}>Color</Text>
                  <Text style={styles.attributeValue}>{species.color?.name || "Unknown"}</Text>
               </View>
            </View>
         </View>

         {/* Abilities */}
         {abilities && abilities.length > 0 && (
            <View style={styles.section}>
               <Text style={styles.sectionTitle}>Abilities</Text>
               {abilities.map((ability: any, index: number) => (
                  <View key={index} style={styles.abilityItem}>
                     <Text style={styles.abilityName}>{ability.name}</Text>
                     <Text style={styles.abilityDescription}>
                        {ability.effect_entries?.find((e: any) => e.language.name === "en")?.short_effect || "No description available"}
                     </Text>
                  </View>
               ))}
            </View>
         )}

         {/* Habitat & Growth */}
         <View style={styles.section}>
            <Text style={styles.sectionTitle}>Habitat & Growth</Text>
            <View style={styles.attributeGrid}>
               <View style={styles.attributeItem}>
                  <Text style={styles.attributeLabel}>Habitat</Text>
                  <Text style={styles.attributeValue}>{species.habitat?.name || "Unknown"}</Text>
               </View>
               <View style={styles.attributeItem}>
                  <Text style={styles.attributeLabel}>Growth Rate</Text>
                  <Text style={styles.attributeValue}>{species.growth_rate?.name || "Unknown"}</Text>
               </View>
               <View style={styles.attributeItem}>
                  <Text style={styles.attributeLabel}>Shape</Text>
                  <Text style={styles.attributeValue}>{species.shape?.name || "Unknown"}</Text>
               </View>
               <View style={styles.attributeItem}>
                  <Text style={styles.attributeLabel}>Generation</Text>
                  <Text style={styles.attributeValue}>{species.generation?.name || "Unknown"}</Text>
               </View>
            </View>
         </View>
      </View>
   );
};

// Stats Tab Component
const PokemonStats: React.FC<{
   pokemon: any;
   stats: any;
}> = ({ pokemon, stats }) => {
   const getStatColor = (value: number) => {
      if (value >= 90) return "#4CAF50";
      if (value >= 70) return "#FF9800";
      if (value >= 50) return "#FFC107";
      return "#F44336";
   };

   const getStatName = (name: string) => {
      const nameMap: Record<string, string> = {
         "hp": "HP",
         "attack": "Attack",
         "defense": "Defense",
         "special-attack": "Sp. Attack",
         "special-defense": "Sp. Defense",
         "speed": "Speed",
      };
      return nameMap[name] || name;
   };

   return (
      <View style={styles.statsContainer}>
         {/* Base Stats */}
         <View style={styles.section}>
            <Text style={styles.sectionTitle}>Base Stats</Text>
            {pokemon.stats.map((stat: any, index: number) => (
               <View key={index} style={styles.statRow}>
                  <View style={styles.statInfo}>
                     <Text style={styles.statName}>{getStatName(stat.stat.name)}</Text>
                     <Text style={styles.statValue}>{stat.base_stat}</Text>
                  </View>
                  <View style={styles.statBarContainer}>
                     <View
                        style={[
                           styles.statBar,
                           {
                              width: `${(stat.base_stat / 255) * 100}%`,
                              backgroundColor: getStatColor(stat.base_stat),
                           },
                        ]}
                     />
                  </View>
               </View>
            ))}
         </View>

         {/* Total Stats */}
         <View style={styles.section}>
            <Text style={styles.sectionTitle}>Total Stats</Text>
            <View style={styles.totalStatsContainer}>
               <Text style={styles.totalStatsValue}>{stats?.totalStats || 0}</Text>
               <Text style={styles.totalStatsLabel}>Total</Text>
            </View>
         </View>
      </View>
   );
};

// Evolution Tab Component
const PokemonEvolution: React.FC<{
   evolutionChain: any;
   currentPokemon: any;
}> = ({ evolutionChain, currentPokemon }) => {
   if (!evolutionChain) {
      return (
         <View style={styles.evolutionContainer}>
            <Text style={styles.noEvolutionText}>No evolution data available</Text>
         </View>
      );
   }

   const parseEvolutionChain = (chain: any): any[] => {
      const evolutions = [];
      
      const addEvolution = (evolution: any) => {
         evolutions.push({
            name: evolution.species.name,
            id: evolution.species.url.split("/").slice(-2, -1)[0],
            trigger: evolution.evolution_details[0]?.trigger?.name || null,
            minLevel: evolution.evolution_details[0]?.min_level || null,
         });
         
         if (evolution.evolves_to && evolution.evolves_to.length > 0) {
            evolution.evolves_to.forEach(addEvolution);
         }
      };

      addEvolution(chain.chain);
      return evolutions;
   };

   const evolutions = parseEvolutionChain(evolutionChain);

   return (
      <View style={styles.evolutionContainer}>
         <Text style={styles.sectionTitle}>Evolution Chain</Text>
         <View style={styles.evolutionChainContainer}>
            {evolutions.map((evolution, index) => (
               <View key={index} style={styles.evolutionStage}>
                  <TouchableOpacity
                     style={[
                        styles.evolutionCard,
                        currentPokemon.name === evolution.name && styles.currentEvolution,
                     ]}
                     onPress={() => {
                        if (evolution.name !== currentPokemon.name) {
                           Alert.alert(
                              "Navigate to Evolution",
                              `Go to ${evolution.name}?`,
                              [
                                 { text: "Cancel", style: "cancel" },
                                 { text: "Go", onPress: () => console.log(`Navigate to ${evolution.name}`) },
                              ]
                           );
                        }
                     }}
                  >
                     <Text style={styles.evolutionName}>{evolution.name}</Text>
                     <Text style={styles.evolutionId}>#{evolution.id.padStart(3, "0")}</Text>
                     {evolution.trigger && (
                        <Text style={styles.evolutionTrigger}>
                           {evolution.trigger}
                           {evolution.minLevel && ` (Lv. ${evolution.minLevel})`}
                        </Text>
                     )}
                  </TouchableOpacity>
                  {index < evolutions.length - 1 && (
                     <Ionicons name="chevron-down" size={24} color="#666" />
                  )}
               </View>
            ))}
         </View>
      </View>
   );
};

// Moves Tab Component
const PokemonMoves: React.FC<{
   moves: any[] | null;
}> = ({ moves }) => {
   if (!moves || moves.length === 0) {
      return (
         <View style={styles.movesContainer}>
            <Text style={styles.noMovesText}>No moves data available</Text>
         </View>
      );
   }

   return (
      <View style={styles.movesContainer}>
         <Text style={styles.sectionTitle}>Moves</Text>
         {moves.map((move, index) => (
            <View key={index} style={styles.moveItem}>
               <Text style={styles.moveName}>{move.name}</Text>
               <View style={styles.moveDetails}>
                  {move.learnMethod.map((method: any, methodIndex: number) => (
                     <Text key={methodIndex} style={styles.moveMethod}>
                        {method.learnMethod}
                        {method.levelLearnedAt > 0 && ` (Lv. ${method.levelLearnedAt})`}
                     </Text>
                  ))}
               </View>
            </View>
         ))}
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
      justifyContent: "space-around",
      pad