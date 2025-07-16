import React from "react";
import { ScrollView, Text, View, ActivityIndicator } from "react-native";
import { PokemonDetailData } from "../../../Types/PokemonDetailTypes";
import { useTypeDetails } from "@/Services/Hooks/Type/useTypeDetails";
import { getTypeColor, lightenColor } from "@/Theme/Utils/PokeBallBG";
import { useTheme } from "@/Theme/ThemeContext";
import {
   formatHeight,
   formatWeight,
   getStatColor,
} from "@/Features/PokemonDetails/Utils/Formatters";
import { combineWeaknesses } from "@/Features/PokemonDetails/Utils/TypeUtils";
import { Fonts } from "@/Theme/Fonts";
import StatRow from "./StatRow";
import AbilityPill from "./AbilityPill";
import TypeRow from "./TypeRow";
import InfoBlock from "./InfoBlock";
import WeaknessChip from "./WeaknessChip";
import styles from "./Styles";

interface PokemonAboutSectionProps {
   pokemonData: PokemonDetailData;
   useMetric: boolean;
   onToggleMetric: () => void;
}

const PokemonAboutSection: React.FC<PokemonAboutSectionProps> = ({
   pokemonData,
   useMetric,
   onToggleMetric,
}) => {
   const { pokemon, species } = pokemonData;
   const types = pokemon?.types?.map((t: any) => t.type.name) || [];
   const { data: type1, loading: loading1 } = useTypeDetails(types[0]);
   const { data: type2, loading: loading2 } = useTypeDetails(types[1]);
   const weaknesses = React.useMemo(() => {
      if (!type1) return [];
      if (types.length > 1 && type2) {
         return combineWeaknesses([type1, type2]);
      }
      return combineWeaknesses([type1]);
   }, [type1, type2, types]);
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
         genus = genus.replace(/\s*Pok[eé]mon$/i, "").trim();
         return genus;
      }
      return "Unknown Species";
   };

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

   const stats = pokemon.stats || [];

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
               {stats.map((stat: any, idx: number) => (
                  <StatRow
                     key={stat.stat.name}
                     stat={stat}
                     idx={idx}
                     theme={theme}
                     isDark={isDark}
                  />
               ))}
               {/* Abilities Section */}
               <Text style={[styles.sectionHeader, { color: typeColor }]}>
                  ABILITIES
               </Text>
               <View style={styles.abilitiesRow}>
                  {pokemon.abilities.map((ability: any, idx: number) => (
                     <AbilityPill
                        key={ability.ability.name}
                        ability={ability}
                        idx={idx}
                        total={pokemon.abilities.length}
                     />
                  ))}
               </View>
            </View>
            {/* Right: Type, Category, Weight, Height */}
            <View style={styles.rightCol}>
               <Text style={[styles.sectionHeader, { color: typeColor }]}>
                  TYPE
               </Text>
               {types.map((type: any) => (
                  <TypeRow key={type} type={type} theme={theme} />
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
               <InfoBlock
                  icon={"weight"}
                  label="Weight"
                  value={formatWeight(pokemon.weight, useMetric)}
                  theme={theme}
                  labelColor={typeColor}
               />
               {/* Height */}
               <InfoBlock
                  icon={"arrow-expand-vertical"}
                  label="Height"
                  value={formatHeight(pokemon.height, useMetric)}
                  theme={theme}
                  labelColor={typeColor}
               />
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
            {weaknesses.map(([type, mult]: [any, any]) => (
               <WeaknessChip key={type} type={type} mult={mult} />
            ))}
         </View>
      </ScrollView>
   );
};

export default PokemonAboutSection;
