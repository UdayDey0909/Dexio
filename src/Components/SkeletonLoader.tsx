import React, { useEffect, useRef } from "react";
import { View, Animated, StyleSheet, Dimensions } from "react-native";
import { useTheme } from "@/Theme";
import { Fonts } from "@/Theme/Fonts";

interface SkeletonLoaderProps {
   width?: number | string;
   height?: number;
   borderRadius?: number;
   style?: any;
}

interface SkeletonCardProps {
   style?: any;
}

interface SkeletonGridProps {
   count?: number;
   columns?: number;
}

// Simple, instant shimmer effect
const SkeletonElement: React.FC<SkeletonLoaderProps> = ({
   width = "100%",
   height = 20,
   borderRadius = 4,
   style,
}) => {
   const { theme } = useTheme();
   const shimmerAnim = useRef(new Animated.Value(0)).current;

   React.useEffect(() => {
      const shimmer = Animated.loop(
         Animated.sequence([
            Animated.timing(shimmerAnim, {
               toValue: 1,
               duration: 1000,
               useNativeDriver: true,
            }),
            Animated.timing(shimmerAnim, {
               toValue: 0,
               duration: 1000,
               useNativeDriver: true,
            }),
         ])
      );
      shimmer.start();
      return () => shimmer.stop();
   }, []);

   const opacity = shimmerAnim.interpolate({
      inputRange: [0, 1],
      outputRange: [0.3, 0.8],
   });

   return (
      <Animated.View
         style={[
            {
               width,
               height,
               borderRadius,
               backgroundColor: theme.background.secondary || "#E0E0E0",
               opacity,
            },
            style,
         ]}
      />
   );
};

// Pokemon card skeleton - renders instantly with shimmer
const SkeletonPokemonCard: React.FC<SkeletonCardProps> = ({ style }) => {
   const { theme } = useTheme();

   return (
      <View
         style={[
            styles.skeletonCard,
            {
               backgroundColor: theme.background.card || "#F5F5F5",
               borderColor: theme.border?.light || "#E0E0E0",
            },
            style,
         ]}
      >
         <View style={styles.cardHeader}>
            <SkeletonElement width="60%" height={16} borderRadius={4} />
            <SkeletonElement width="20%" height={14} borderRadius={4} />
         </View>

         <View style={styles.cardBody}>
            <View style={styles.typesContainer}>
               <SkeletonElement width={70} height={24} borderRadius={12} />
               <SkeletonElement width={70} height={24} borderRadius={12} />
            </View>
            <View style={styles.imageContainer}>
               <SkeletonElement width={100} height={100} borderRadius={6} />
            </View>
         </View>
      </View>
   );
};

// Grid of skeleton cards for initial loading - Fixed layout to match FlashList
const SkeletonGrid: React.FC<SkeletonGridProps> = ({
   count = 10,
   columns = 2,
}) => {
   const { theme } = useTheme();

   // Create rows to match FlashList numColumns behavior
   const rows = Math.ceil(count / columns);
   const skeletonRows = Array.from({ length: rows }, (_, rowIndex) => {
      const startIndex = rowIndex * columns;
      const endIndex = Math.min(startIndex + columns, count);
      return Array.from(
         { length: endIndex - startIndex },
         (_, colIndex) => startIndex + colIndex
      );
   });

   return (
      <View
         style={[
            styles.skeletonGrid,
            {
               backgroundColor: theme.background.primary,
            },
         ]}
      >
         {skeletonRows.map((row, rowIndex) => (
            <View key={rowIndex} style={styles.skeletonRow}>
               {row.map((itemIndex) => (
                  <View key={itemIndex} style={styles.skeletonCardWrapper}>
                     <SkeletonPokemonCard />
                  </View>
               ))}
               {/* Add empty spacer if odd number of items in last row */}
               {row.length < columns && (
                  <View style={styles.skeletonCardWrapper} />
               )}
            </View>
         ))}
      </View>
   );
};

// Simple skeleton for infinite scroll - instant loading
const SkeletonInfiniteLoader: React.FC = () => {
   const { theme } = useTheme();

   return (
      <View style={styles.infiniteLoader}>
         <View style={styles.infiniteLoaderContent}>
            <SkeletonElement width={16} height={16} borderRadius={8} />
            <SkeletonElement width="50%" height={12} borderRadius={4} />
         </View>
      </View>
   );
};

const { width: screenWidth } = Dimensions.get("window");

const styles = StyleSheet.create({
   skeletonCard: {
      paddingTop: 8,
      paddingLeft: 6,
      paddingRight: 8,
      paddingBottom: 4,
      borderRadius: 12,
      borderWidth: 1,
      height: 130,
      overflow: "hidden",
   },
   cardHeader: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      marginBottom: 4,
   },
   cardBody: {
      flex: 1,
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
   },
   typesContainer: {
      flexDirection: "column",
      gap: 4,
      justifyContent: "center",
   },
   imageContainer: {
      marginLeft: "auto",
      justifyContent: "center",
      alignItems: "center",
   },
   skeletonGrid: {
      paddingTop: 20,
      paddingHorizontal: 12,
      paddingBottom: 20,
   },
   skeletonRow: {
      flexDirection: "row",
      marginBottom: 12,
   },
   skeletonCardWrapper: {
      flex: 1,
      maxWidth: "50%",
      paddingHorizontal: 4,
      paddingVertical: 6,
   },
   infiniteLoader: {
      paddingVertical: 16,
      paddingHorizontal: 20,
   },
   infiniteLoaderContent: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "center",
      gap: 12,
   },
});

export {
   SkeletonElement,
   SkeletonPokemonCard,
   SkeletonGrid,
   SkeletonInfiniteLoader,
};
export default SkeletonPokemonCard;
