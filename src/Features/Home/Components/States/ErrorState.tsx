// components/ErrorState.tsx
import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { COLORS } from "../../Constants/Colors";

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
      color: COLORS.error,
      fontSize: 18,
      textAlign: "center",
      marginTop: 40,
      fontWeight: "500",
   },
   errorSubtext: {
      color: COLORS.text.light,
      fontSize: 14,
      textAlign: "center",
      marginTop: 10,
      opacity: 0.7,
      fontWeight: "400",
   },
});

export default ErrorState;
