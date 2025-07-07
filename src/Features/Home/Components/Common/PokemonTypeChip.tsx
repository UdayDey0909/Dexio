import React, { memo } from "react";
import { View, Text, StyleSheet } from "react-native";
import { PokemonTypeIcon } from "@/Assets/SVG/PokemonTypeIcons";
import { getTypeColor, lightenColor } from "../../Utils/colorUtils";

interface PokemonTypeChipProps {
   type: string;
}

const PokemonTypeChip: React.FC<PokemonTypeChipProps> = ({ type }) => {
   const typeColor = lightenColor(getTypeColor(type), 2.1);

   return (
      <View style={[styles.typeChip, { backgroundColor: typeColor }]}>
         <PokemonTypeIcon
            type={type}
            size={16}
            color="white"
            style={styles.icon}
         />
         <Text style={styles.typeText}>{type}</Text>
      </View>
   );
};

const styles = StyleSheet.create({
   typeChip: {
      flexDirection: "row",
      alignItems: "center",
      marginBottom: 4,
      paddingVertical: 6,
      paddingHorizontal: 10,
      borderRadius: 20,
      minWidth: 80,
      justifyContent: "center",
      // Add subtle shadow for depth
      shadowColor: "#000",
      shadowOffset: {
         width: 0,
         height: 1,
      },
      shadowOpacity: 0.2,
      shadowRadius: 1.5,
      elevation: 2,
   },
   icon: {
      marginRight: 4,
   },
   typeText: {
      color: "#333",
      fontSize: 12,
      fontWeight: "600",
      textTransform: "capitalize",
      includeFontPadding: false,
      textShadowColor: "rgba(0, 0, 0, 0.3)",
      textShadowOffset: { width: 0.5, height: 0.5 },
      textShadowRadius: 1,
   },
});

// Memoize the component to prevent unnecessary re-renders
export default memo(PokemonTypeChip, (prevProps, nextProps) => {
   return prevProps.type === nextProps.type;
});
