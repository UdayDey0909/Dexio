import React from "react";
import { View, Text, ActivityIndicator, StyleSheet } from "react-native";
import { lightThemeColors } from "@/Theme/Core/Variants";
import { Fonts } from "@/Theme/Fonts";

interface LoadingStateProps {
   message?: string;
}

const LoadingState: React.FC<LoadingStateProps> = ({
   message = "Loading...",
}) => {
   return (
      <View style={styles.container}>
         <ActivityIndicator size="large" color={lightThemeColors.accent} />
         <Text style={styles.text}>{message}</Text>
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
      fontSize: 16,
      marginTop: 10,
      color: lightThemeColors.text.secondary,
      fontFamily: Fonts.primaryMedium, // Roboto-Medium
   },
});

export { default } from "@/Features/Common/Components/LoadingView";
