// components/LoadingState.tsx
import React from "react";
import { View, Text, ActivityIndicator, StyleSheet } from "react-native";
import { COLORS } from "../constants/colors";

interface LoadingStateProps {
   message?: string;
}

const LoadingState: React.FC<LoadingStateProps> = ({
   message = "Loading...",
}) => {
   return (
      <View style={styles.container}>
         <ActivityIndicator size="large" color={COLORS.accent} />
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
      fontSize: 18,
      marginTop: 10,
      color: COLORS.text.light,
      fontWeight: "400",
   },
});

export default LoadingState;
