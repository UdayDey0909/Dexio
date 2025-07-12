import React from "react";
import {
   View,
   Text,
   StyleSheet,
   ScrollView,
   TouchableOpacity,
   ActivityIndicator,
} from "react-native";
import { PokemonDetailData } from "../../Types/PokemonDetailTypes";
import { formatHeight, formatWeight } from "../../Utils/Formatters";
import { PokemonTypeIcon } from "@/Assets/SVG/PokemonTypeIcons";
import { useTypeDetails } from "@/Services/Hooks/Type/useTypeDetails";
import { getStatColor, formatStatName } from "../../Utils/Formatters";
import { baseColors } from "@/Theme/Core/Colors";
import type { TypeDetails } from "@/Services/Hooks/Type/Shared/Types";
import { usePokemonTypeColors } from "../../Hooks/usePokemonDetail";
import { lightenColor } from "@/Theme/Utils/PokeBallBG";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useTheme } from "@/Theme/ThemeContext";
import { Fonts } from "@/Theme/Fonts";

// Helper: Combine weaknesses for dual types
function combineWeaknesses(
   typeDetailsArr: (TypeDetails | undefined)[]
): [string, number][] {
   const allTypes = [
      "normal",
      "fire",
      "water",
      "electric",
      "grass",
      "ice",
      "fighting",
      "poison",
      "ground",
      "flying",
      "psychic",
      "bug",
      "rock",
      "ghost",
      "dragon",
      "dark",
      "steel",
      "fairy",
   ];
   // Start with 1x for all types
   const result: Record<string, number> = {};
   allTypes.forEach((t) => (result[t] = 1));
   typeDetailsArr.forEach((typeDetails) => {
      if (!typeDetails) return;
      typeDetails.effectivenessChart.weakTo.forEach((t: { name: string }) => {
         result[t.name] *= 2;
      });
      typeDetails.effectivenessChart.resistantTo.forEach(
         (t: { name: string }) => {
            result[t.name] *= 0.5;
         }
      );
      typeDetails.effectivenessChart.immuneTo.forEach((t: { name: string }) => {
         result[t.name] *= 0;
      });
   });
   // Only show >1 (weaknesses)
   return Object.entries(result).filter(
      ([type, mult]) => typeof mult === "number" && mult > 1
   ) as [string, number][];
}

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
   const types = pokemon?.types?.map((t) => t.type.name) || [];
   const { data: type1, loading: loading1 } = useTypeDetails(types[0]);
   const { data: type2, loading: loading2 } = useTypeDetails(types[1]);
   const weaknesses = React.useMemo(() => {
      if (!type1) return [];
      if (types.length > 1 && type2) {
         return combineWeaknesses([type1, type2]);
      }
      return combineWeaknesses([type1]);
   }, [type1, type2, types]);
   const { getTypeColor } = usePokemonTypeColors();
   const typeColor = getTypeColor(types[0] || "normal");
   const { theme, isDark } = useTheme();

   if (!pokemon) return null;
   if (loading1 || (types.length > 1 && loading2)) {
      return (
         <ActivityIndicator
            size="large"
            color="#4CAF50"
            style={{ marginTop: 40 }}
         />
      );
   }

   // Genus/Category
   const getGenus = () => {
      if (species?.genera) {
         const englishGenus = species.genera.find(
            (genus: any) => genus.language.name === "en"
         );
         let genus = englishGenus?.genus || "Unknown Species";
         // Remove 'Pokémon' or 'pokemon' at the end (with or without space)
         genus = genus.replace(/\s*Pok[eé]mon$/i, "").trim();
         return genus;
      }
      return "Unknown Species";
   };

   // Description
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

   // Stats
   const stats = pokemon.stats || [];
   const totalStats = stats.reduce((sum, stat) => sum + stat.base_stat, 0);

   // Map stat names to abbreviations
   const statAbbr: Record<string, string> = {
      hp: "HP",
      attack: "ATK",
      defense: "DEF",
      "special-attack": "Sp. ATK",
      "special-defense": "Sp. DEF",
      speed: "SPD",
   };

   return (
      <ScrollView
         style={[styles.container, { backgroundColor: theme.background.card }]}
         showsVerticalScrollIndicator={false}
      >
         {/* Description */}
         <Text style={[styles.description, { color: theme.text.primary }]}>
            {getDescription()}
         </Text>

         {/* Main two-column layout */}
         <View style={styles.mainRow}>
            {/* Left: Stats */}
            <View style={styles.leftCol}>
               <Text style={[styles.sectionHeader, { color: typeColor }]}>
                  STATS
               </Text>
               {stats.map((stat, idx) => (
                  <View key={stat.stat.name} style={styles.statRow}>
                     <Text
                        style={[
                           styles.statLabel,
                           { color: theme.text.secondary },
                        ]}
                     >
                        {(statAbbr as any)[stat.stat.name] ||
                           stat.stat.name.toUpperCase()}
                     </Text>
                     <View
                        style={[
                           styles.statBarBg,
                           {
                              backgroundColor: isDark
                                 ? "#5a6270"
                                 : theme.background.secondary,
                           },
                        ]}
                     >
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
                     <Text
                        style={[
                           styles.statValue,
                           { color: theme.text.secondary },
                        ]}
                     >
                        {stat.base_stat}
                     </Text>
                  </View>
               ))}

               {/* Abilities Section */}
               <Text style={[styles.sectionHeader, { color: typeColor }]}>
                  ABILITIES
               </Text>
               <View style={styles.abilitiesRow}>
                  {pokemon.abilities.map((ability, idx) => (
                     <View
                        key={ability.ability.name}
                        style={[
                           styles.abilityPill,
                           ability.is_hidden
                              ? styles.abilityPillHidden
                              : styles.abilityPillNormal,
                           idx !== pokemon.abilities.length - 1
                              ? { marginBottom: 8 } // more space between abilities
                              : { marginBottom: 0 }, // no space after last ability
                        ]}
                     >
                        <Text
                           style={[
                              styles.abilityText,
                              ability.is_hidden
                                 ? styles.abilityTextHidden
                                 : styles.abilityTextNormal,
                           ]}
                        >
                           {ability.ability.name.charAt(0).toUpperCase() +
                              ability.ability.name.slice(1)}
                        </Text>
                        {ability.is_hidden && (
                           <MaterialCommunityIcons
                              name="eye-off-outline"
                              size={18}
                              color="#b71c1c"
                              style={{ marginLeft: 8 }}
                           />
                        )}
                     </View>
                  ))}
               </View>
            </View>
            {/* Right: Type, Category, Weight, Height */}
            <View style={styles.rightCol}>
               <Text style={[styles.sectionHeader, { color: typeColor }]}>
                  TYPE
               </Text>
               {types.map((type) => (
                  <View key={type} style={styles.typeRow}>
                     <View
                        style={[
                           styles.typeIconCircle,
                           { backgroundColor: getTypeColor(type) },
                        ]}
                     >
                        <PokemonTypeIcon
                           type={type}
                           size={20}
                           style={{ marginRight: 0 }}
                        />
                     </View>
                     <Text
                        style={[styles.typeText, { color: theme.text.primary }]}
                     >
                        {type.toUpperCase()}
                     </Text>
                  </View>
               ))}

               {/* Separator line after Type, before Category */}
               <View
                  style={{
                     height: 2,
                     borderRadius: 1,
                     backgroundColor: isDark ? "#444b57" : theme.border.medium,
                     marginVertical: 10,
                     width: "100%",
                  }}
               />

               <Text style={[styles.sectionHeader, { color: typeColor }]}>
                  CATEGORY
               </Text>
               <Text
                  style={[styles.categoryText, { color: theme.text.primary }]}
               >
                  {getGenus()}
               </Text>

               {/* Separator line below Category */}
               <View
                  style={{
                     height: 2,
                     borderRadius: 1,
                     backgroundColor: isDark ? "#444b57" : theme.border.medium,
                     marginVertical: 10,
                     width: "100%",
                  }}
               />

               {/* Weight */}
               <View style={styles.infoBlockColumn}>
                  <Text style={[styles.sectionHeader, { color: typeColor }]}>
                     Weight
                  </Text>
                  <View style={styles.infoBlock}>
                     <MaterialCommunityIcons
                        name="weight"
                        size={18}
                        color={theme.text.secondary}
                        style={{ marginRight: 6 }}
                     />
                     <Text
                        style={[
                           styles.infoValue,
                           { color: theme.text.primary },
                        ]}
                     >
                        {formatWeight(pokemon.weight, useMetric)}
                     </Text>
                  </View>
               </View>
               {/* Height */}
               <View style={styles.infoBlockColumn}>
                  <Text style={[styles.sectionHeader, { color: typeColor }]}>
                     Height
                  </Text>
                  <View style={styles.infoBlock}>
                     <MaterialCommunityIcons
                        name="arrow-expand-vertical"
                        size={18}
                        color={theme.text.secondary}
                        style={{ marginRight: 6 }}
                     />
                     <Text
                        style={[
                           styles.infoValue,
                           { color: theme.text.primary },
                        ]}
                     >
                        {formatHeight(pokemon.height, useMetric)}
                     </Text>
                  </View>
               </View>
            </View>
         </View>
         {/* Weaknesses */}
         <Text
            style={[
               styles.sectionHeader,
               styles.weaknessesHeader,
               { color: typeColor },
            ]}
         >
            WEAKNESSES
         </Text>
         <View style={styles.weaknessRow}>
            {weaknesses.length === 0 && (
               <Text style={[styles.weaknessNone, { color: theme.text.muted }]}>
                  None
               </Text>
            )}
            {weaknesses.map(([type, mult]) => (
               <View
                  key={type}
                  style={[
                     styles.weaknessChip,
                     {
                        backgroundColor: lightenColor(getTypeColor(type), 0.15),
                     },
                  ]}
               >
                  <PokemonTypeIcon
                     type={type}
                     size={16}
                     style={{ marginRight: 4 }}
                  />
                  <Text style={styles.weaknessText}>{type.toUpperCase()}</Text>
                  <Text style={styles.weaknessMult}>x{Number(mult)}</Text>
               </View>
            ))}
         </View>
      </ScrollView>
   );
};

const styles = StyleSheet.create({
   container: {
      flex: 1,
      paddingHorizontal: 20,
   },

   nameNumberRow: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      marginBottom: 8,
   },
   nameText: {
      fontSize: 26,
      fontWeight: "bold",
      color: "#388e3c",
      textTransform: "capitalize",
      letterSpacing: 1,
      textAlign: "left",
   },
   numberText: {
      fontSize: 18,
      color: "#333",
      fontWeight: "bold",
      opacity: 0.7,
      marginRight: 12,
      marginBottom: 2,
   },
   description: {
      fontSize: 16,
      marginBottom: 24,
      textAlign: "left",
      lineHeight: 24,
      marginHorizontal: 0,
      fontFamily: Fonts.primaryRegular, // Roboto-Regular
   },
   mainRow: {
      flexDirection: "row",
      marginBottom: 32,
      gap: 12,
      position: "relative",
      borderRightWidth: 0,
   },
   leftCol: {
      flex: 7.5,
      marginRight: 6,
      borderRightWidth: 1,
      borderRightColor: "transparent",
      paddingRight: 8,
   },
   rightCol: {
      flex: 3.5,
      marginLeft: 4,
      justifyContent: "flex-start",
   },
   sectionHeader: {
      fontSize: 15,
      fontWeight: "800",
      letterSpacing: 1.5,
      marginBottom: 8, // was 12
      textTransform: "uppercase",
      marginTop: 6, // was 8
      fontFamily: Fonts.headingSemiBold, // Poppins-SemiBold
   },
   statRow: {
      flexDirection: "row",
      alignItems: "center",
      marginBottom: 14,
   },
   statLabel: {
      width: 48,
      fontSize: 13,
      fontWeight: "bold",
      marginRight: 0,
      fontFamily: Fonts.primaryMedium, // Roboto-Medium
   },
   statBarBg: {
      flex: 1,
      height: 14, // taller bar
      borderRadius: 8,
      marginLeft: 0,
      overflow: "hidden",
      marginRight: 0,
   },
   statBar: {
      height: "100%",
      borderRadius: 8,
      position: "absolute",
      left: 0,
      top: 0,
   },
   statValue: {
      width: 32,
      fontSize: 13,
      fontWeight: "bold",
      textAlign: "right",
      marginLeft: 2,
      fontFamily: Fonts.primaryMedium, // Roboto-Medium
   },
   typeChip: {
      flexDirection: "row",
      alignItems: "center",
      marginRight: 0,
      marginBottom: 0,
   },
   typeRow: {
      flexDirection: "row",
      alignItems: "center",
      marginBottom: 8,
   },
   typeIconCircle: {
      width: 28,
      height: 28,
      borderRadius: 14,
      alignItems: "center",
      justifyContent: "center",
      marginRight: 8,
   },
   typeText: {
      fontWeight: "bold",
      fontSize: 14,
   },
   pokemonIdOld: {
      fontSize: 16,
      color: "#888",
      fontWeight: "bold",
      marginBottom: 8,
      marginLeft: 2,
   },
   categoryText: {
      fontSize: 15,
      fontWeight: "bold",
      marginBottom: 8,
      fontFamily: Fonts.primaryMedium, // Roboto-Medium
   },
   infoBlock: {
      flexDirection: "row",
      alignItems: "center",
      marginBottom: 0,
   },
   infoBlockColumn: {
      flexDirection: "column",
      alignItems: "flex-start",
      marginBottom: 10,
   },
   infoLabel: {
      fontSize: 13,
      color: "#388e3c",
      fontWeight: "700",
      marginBottom: 4,
      marginLeft: 2,
      letterSpacing: 1,
      textTransform: "uppercase",
      fontFamily: Fonts.primaryMedium, // Roboto-Medium
   },
   infoValue: {
      fontSize: 15,
      fontWeight: "bold",
      fontFamily: Fonts.primaryRegular, // Roboto-Regular
   },
   weaknessRow: {
      flexDirection: "row",
      flexWrap: "wrap",
      alignItems: "center",
      marginTop: 8,
      marginBottom: 16,
      gap: 2, // further decrease spacing between weakness chips
   },
   weaknessChip: {
      flexDirection: "row",
      alignItems: "center",
      borderRadius: 16,
      paddingHorizontal: 14,
      paddingVertical: 5,
      marginRight: 4,
      marginBottom: 4,
      backgroundColor: "#eee",
   },
   weaknessText: {
      color: "#fff",
      fontWeight: "bold",
      fontSize: 14,
      letterSpacing: 1,
      marginRight: 2,
      fontFamily: Fonts.primaryMedium, // Roboto-Medium
   },
   weaknessMult: {
      color: "#fff",
      fontWeight: "bold",
      fontSize: 13,
      marginLeft: 2,
      fontFamily: Fonts.primaryMedium, // Roboto-Medium
   },
   weaknessNone: {
      fontStyle: "italic",
      fontFamily: Fonts.primaryRegular, // Roboto-Regular
   },
   idAbsoluteWrapper: {
      position: "absolute",
      right: 20,
      top: 12,
      zIndex: 20,
      pointerEvents: "none",
      width: 80,
      alignItems: "flex-end",
   },
   pokemonIdTop: {
      fontSize: 17,
      color: "#888",
      fontWeight: "600",
      opacity: 0.92,
      paddingHorizontal: 0,
      paddingVertical: 0,
      borderRadius: 0,
      overflow: "visible",
      shadowColor: undefined,
      shadowOffset: undefined,
      shadowOpacity: undefined,
      shadowRadius: undefined,
      elevation: undefined,
   },
   // Add new styles for abilities pills
   abilitiesRow: {
      flexDirection: "row",
      flexWrap: "wrap",
      gap: 2,
      marginTop: 4,
      marginBottom: 0,
      alignItems: "flex-start",
   },
   abilityPill: {
      flexDirection: "row",
      alignItems: "center",
      borderRadius: 20,
      paddingHorizontal: 18,
      paddingVertical: 7,
      borderWidth: 2,
      marginRight: 2,
      minWidth: 80,
      justifyContent: "center",
   },
   abilityPillNormal: {
      borderColor: "#90caf9",
      backgroundColor: "#f8fbff",
   },
   abilityPillHidden: {
      borderColor: "#ef9a9a",
      backgroundColor: "#fff6f6",
   },
   abilityText: {
      fontWeight: "bold",
      fontSize: 16,
      textTransform: "capitalize",
      fontFamily: Fonts.primaryMedium, // Roboto-Medium
   },
   abilityTextNormal: {
      color: "#1976d2",
   },
   abilityTextHidden: {
      color: "#b71c1c",
   },
   weaknessesHeader: {
      marginTop: 2,
   },
});
