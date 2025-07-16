import React from "react";
import { View, StyleSheet } from "react-native";
import PokemonAboutSection from "./Tabs/AboutSection";
import { PokemonDetailData } from "../Types/PokemonDetailTypes";

interface PokemonDetailTabsProps {
   pokemonData: PokemonDetailData;
   useMetric: boolean;
   onToggleMetric: () => void;
}

export const PokemonDetailTabs: React.FC<PokemonDetailTabsProps> = ({
   pokemonData,
   useMetric,
   onToggleMetric,
}) => {
   return (
      <View style={styles.container}>
         {/* Tab Content - Only About Tab */}
         <View style={styles.tabContent}>
            <PokemonAboutSection
               pokemonData={pokemonData}
               useMetric={useMetric}
               onToggleMetric={onToggleMetric}
            />
         </View>
      </View>
   );
};

const styles = StyleSheet.create({
   container: {
      flex: 1,
   },
   tabContent: {
      flex: 1,
      paddingHorizontal: 0,
   },
});
