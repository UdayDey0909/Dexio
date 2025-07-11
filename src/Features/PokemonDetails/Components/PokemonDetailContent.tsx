import React from "react";
import { View, StyleSheet } from "react-native";
import { PokemonDetailTabs } from "./PokemonDetailTabs";
import { PokemonDetailData } from "../Types/PokemonDetailTypes";

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
   return (
      <View style={styles.contentCard}>
         <PokemonDetailTabs
            pokemonData={pokemonData}
            useMetric={useMetric}
            onToggleMetric={onToggleMetric}
         />
      </View>
   );
};

const styles = StyleSheet.create({
   contentCard: {
      flex: 1,
      backgroundColor: "#fff",
      borderTopLeftRadius: 30,
      borderTopRightRadius: 30,
      paddingTop: 20,
   },
});
