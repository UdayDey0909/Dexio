import React, { memo } from "react";
import { View, Text, StyleSheet } from "react-native";

interface PokemonTypeChipProps {
   type: string;
}

const PokemonTypeChip: React.FC<PokemonTypeChipProps> = ({ type }) => {
   return (
      <View style={styles.typeChip}>
         <Text style={styles.typeText}>{type}</Text>
      </View>
   );
};

const styles = StyleSheet.create({
   typeChip: {
      marginBottom: 4,
      paddingVertical: 4,
      paddingHorizontal: 8,
      borderRadius: 16,
      backgroundColor: "rgba(255, 255, 255, 0.3)",
      alignItems: "center",
      width: 70,
   },
   typeText: {
      color: "#fff",
      fontSize: 12,
      fontWeight: "bold",
      includeFontPadding: false,
   },
});

// Memoize the component to prevent unnecessary re-renders
export default memo(PokemonTypeChip, (prevProps, nextProps) => {
   return prevProps.type === nextProps.type;
});
