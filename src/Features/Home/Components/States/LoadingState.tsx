import React from "react";
import { View, Text, ActivityIndicator, StyleSheet } from "react-native";
import { useTheme } from "@/Theme";
import { Fonts } from "@/Theme/Fonts";
import { SkeletonGrid } from "@/Components/SkeletonLoader";

interface LoadingStateProps {
   message?: string;
   showSkeleton?: boolean;
   skeletonCount?: number;
}

const LoadingState: React.FC<LoadingStateProps> = ({
   message = "Loading...",
   showSkeleton = true,
   skeletonCount = 10, // Reduced from 12 to 10 for better performance
}) => {
   const { theme } = useTheme();

   if (showSkeleton) {
      return <SkeletonGrid count={skeletonCount} columns={2} />;
   }

   return (
      <View style={styles.container}>
         <ActivityIndicator size="large" color={theme.accent} />
         <Text style={[styles.text, { color: theme.text.secondary }]}>
            {message}
         </Text>
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
      fontFamily: Fonts.primaryMedium,
   },
});

export default LoadingState;
