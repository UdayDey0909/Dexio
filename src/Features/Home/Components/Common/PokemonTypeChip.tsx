import React, { memo } from "react";
import { View, Text, StyleSheet } from "react-native";
import { PokemonTypeIcon } from "@/Assets/SVG/PokemonTypeIcons";
import { getTypeColor, lightenColor } from "../../Utils/colorUtils";

interface PokemonTypeChipProps {
   type: string;
}

const PokemonTypeChip: React.FC<PokemonTypeChipProps> = ({ type }) => {
   const typeColor = getTypeColor(type);
   const lighterTypeColor = lightenColor(typeColor, 0.15);

   return (
      <View style={[styles.typeChip, { backgroundColor: lighterTypeColor }]}>
         {/* Using PokemonTypeIcon component to render the type icon */}
         <PokemonTypeIcon
            type={type}
            size={16}
            color="white"
            style={styles.icon}
         />
         {/* Displaying the type name */}
         <Text style={styles.typeText}>{type.toUpperCase()}</Text>
      </View>
   );
};

const styles = StyleSheet.create({
   typeChip: {
      marginBottom: 4,
      paddingVertical: 6,
      paddingHorizontal: 5,
      borderRadius: 16,
      flexDirection: "row",
      justifyContent: "center",
      alignItems: "center",
      minWidth: 72,
   },
   icon: {
      marginRight: 4,
   },
   typeText: {
      color: "#fff",
      fontSize: 12,
      fontWeight: "600",
      includeFontPadding: false,
      textShadowColor: "rgba(0, 0, 0, 0.3)",
      textShadowOffset: { width: 1, height: 1 },
      textShadowRadius: 1.5,
   },
});

// Memoize the component to prevent unnecessary re-renders
export default memo(PokemonTypeChip, (prevProps, nextProps) => {
   return prevProps.type === nextProps.type;
});
