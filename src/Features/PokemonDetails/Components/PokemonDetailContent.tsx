import React from "react";
import { View, StyleSheet, SafeAreaView, Text } from "react-native";
import { PokemonDetailTabs } from "./PokemonDetailTabs";
import { PokemonDetailData } from "../Types/PokemonDetailTypes";
import { getTypeColor } from "@/Theme/Utils/PokeBallBG";
import { useTheme } from "@/Theme/ThemeContext";
import { Fonts } from "@/Theme/Fonts";

interface PokemonDetailContentProps {
   pokemonData: PokemonDetailData;
   useMetric: boolean;
   onToggleMetric: () => void;
}

export const PokemonDetailContent: React.FC<PokemonDetailContentProps> = ({
   pokemonData,
   useMetric,
   onToggleMetric,
}) => {
   const pokemon = pokemonData.pokemon;
   const types = pokemon?.types?.map((t) => t.type.name) || [];
   const typeColor = getTypeColor(types[0] || "normal");
   const { theme } = useTheme();

   return (
      <SafeAreaView
         style={[
            styles.contentCard,
            { backgroundColor: theme.background.card },
         ]}
      >
         {/* Name pill and number, in a horizontal row */}
         {pokemon && (
            <View style={styles.nameRowWrapper} pointerEvents="none">
               <View
                  style={[
                     styles.namePill,
                     styles.namePillShadow,
                     { backgroundColor: typeColor },
                  ]}
               >
                  <Text style={styles.nameText}>
                     {pokemon.name.split("-")[0]}
                  </Text>
               </View>
               <View style={styles.numberBox}>
                  <Text
                     style={[styles.numberText, { color: theme.text.primary }]}
                  >
                     N°{pokemon.id.toString().padStart(3, "0")}
                  </Text>
               </View>
            </View>
         )}
         <View style={styles.tabContentWrapper}>
            <PokemonDetailTabs
               pokemonData={pokemonData}
               useMetric={useMetric}
               onToggleMetric={onToggleMetric}
            />
         </View>
      </SafeAreaView>
   );
};

const NAME_PILL_WIDTH = 220;
const NAME_PILL_HEIGHT = 56;

const styles = StyleSheet.create({
   contentCard: {
      flex: 1,
      borderTopLeftRadius: 30,
      borderTopRightRadius: 30,
      position: "relative",
      overflow: "visible",
   },
   nameRowWrapper: {
      position: "absolute",
      top: -NAME_PILL_HEIGHT / 2 - 8,
      left: 0,
      width: "100%",
      height: NAME_PILL_HEIGHT + 18,
      flexDirection: "row",
      alignItems: "center",
      zIndex: 10,
      pointerEvents: "none",
      justifyContent: "space-between",
      paddingHorizontal: 0,
   },
   namePill: {
      width: NAME_PILL_WIDTH,
      height: NAME_PILL_HEIGHT,
      borderTopRightRadius: NAME_PILL_HEIGHT / 2,
      borderBottomRightRadius: NAME_PILL_HEIGHT / 2,
      borderTopLeftRadius: 0,
      borderBottomLeftRadius: 0,
      justifyContent: "center",
      alignItems: "flex-start",
      paddingLeft: 36,
      paddingRight: 0,
      // backgroundColor is set inline in the render, not here
   },
   namePillShadow: {
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.18,
      shadowRadius: 8,
      elevation: 8,
   },
   nameText: {
      fontSize: 28,
      fontWeight: "bold",
      color: "#fff",
      textTransform: "capitalize",
      letterSpacing: 1,
      textAlign: "left",
      fontFamily: Fonts.headingBold, // Poppins-Bold
   },
   numberBox: {
      justifyContent: "center",
      alignItems: "flex-start",
      paddingHorizontal: 0,
      paddingTop: 28,
      minWidth: 60,
      marginLeft: 8,
      marginRight: 10,
   },
   numberText: {
      fontSize: 18,
      fontWeight: "bold",
      opacity: 0.85,
      fontFamily: Fonts.primaryMedium, // Roboto-Medium
   },
   tabContentWrapper: {
      flex: 1,
      marginTop: NAME_PILL_HEIGHT - 8,
   },
});
