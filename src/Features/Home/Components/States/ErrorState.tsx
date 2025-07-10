import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { lightThemeColors } from "@/Theme/Core/Variants";
import { Fonts } from "@/Theme/Fonts";

interface ErrorStateProps {
   error: Error;
}

const ErrorState: React.FC<ErrorStateProps> = ({ error }) => {
   return (
      <View style={styles.container}>
         <Text style={styles.errorText}>
            Error loading Pokémon: {error.message}
         </Text>
         <Text style={styles.errorSubtext}>Pull down to refresh</Text>
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
   errorText: {
      color: lightThemeColors.system.error,
      fontSize: 16,
      textAlign: "center",
      marginTop: 40,
      fontFamily: Fonts.primaryMedium,
   },
   errorSubtext: {
      color: lightThemeColors.text.muted,
      fontSize: 14,
      textAlign: "center",
      marginTop: 10,
      fontFamily: Fonts.primaryRegular,
   },
});

export default ErrorState;
