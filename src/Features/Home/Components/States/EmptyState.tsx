import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { lightThemeColors } from "@/Theme/Core/Variants";
import { Fonts } from "@/Theme/Fonts";

const EmptyState: React.FC = () => {
   return (
      <View style={styles.container}>
         <Text style={styles.text}>No Pokémon found</Text>
      </View>
   );
};

const styles = StyleSheet.create({
   container: {
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
      paddingVertical: 40,
   },
   text: {
      color: lightThemeColors.text.secondary,
      fontSize: 16,
      textAlign: "center",
      marginTop: 40,
      fontFamily: Fonts.primaryMedium, // Roboto-Medium
   },
});

export default EmptyState;
