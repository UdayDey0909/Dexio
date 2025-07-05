import React, { useCallback, useMemo } from "react";
import {
   View,
   FlatList,
   StyleSheet,
   Text,
   ActivityIndicator,
   RefreshControl,
   Dimensions,
} from "react-native";
import { PokemonCard } from "./PokemonCard";
import { PokemonCardData } from "../Types";

interface PokemonGridProps {
   pokemonData: PokemonCardData[];
   loading: boolean;
   error: string | null;
   refreshing?: boolean;
   loadingMore?: boolean;
   onRefresh?: () => void;
   onLoadMore?: () => void;
   hasMore?: boolean;
}

const { width } = Dimensions.get("window");
const ITEM_WIDTH = (width - 48) / 2;
const ITEM_HEIGHT = 130;

export const PokemonGrid: React.FC<PokemonGridProps> = ({
   pokemonData,
   loading,
   error,
   refreshing = false,
   loadingMore = false,
   onRefresh,
   onLoadMore,
   hasMore = true,
}) => {
   // Memoized render function for performance
   const renderPokemonCard = useCallback(
      ({ item, index }: { item: PokemonCardData; index: number }) => (
         <PokemonCard
            pokemon={item}
            onPress={(pokemon) => {
               // Handle Pokemon card press
               console.log("Pokemon pressed:", pokemon.name);
            }}
         />
      ),
      []
   );

   // Key extractor for better performance
   const keyExtractor = useCallback(
      (item: PokemonCardData, index: number) => `pokemon-${item.id}-${index}`,
      []
   );

   // Memoized footer component
   const ListFooterComponent = useMemo(() => {
      if (loadingMore && hasMore) {
         return (
            <View style={styles.footerLoader}>
               <ActivityIndicator size="large" color="#3B82F6" />
               <Text style={styles.footerText}>Loading more Pokemon...</Text>
            </View>
         );
      }

      if (!hasMore && pokemonData.length > 0) {
         return (
            <View style={styles.footerLoader}>
               <Text style={styles.footerText}>You've caught them all! 🎉</Text>
            </View>
         );
      }

      return null;
   }, [loadingMore, hasMore, pokemonData.length]);

   // Memoized empty component
   const ListEmptyComponent = useMemo(() => {
      if (loading) {
         return (
            <View style={styles.centerContainer}>
               <ActivityIndicator size="large" color="#3B82F6" />
               <Text style={styles.loadingText}>Loading Pokemon...</Text>
            </View>
         );
      }

      if (error) {
         return (
            <View style={styles.centerContainer}>
               <Text style={styles.errorText}>⚠️ {error}</Text>
               <Text style={styles.errorSubtext}>Pull down to retry</Text>
            </View>
         );
      }

      return (
         <View style={styles.centerContainer}>
            <Text style={styles.emptyText}>No Pokemon found</Text>
            <Text style={styles.emptySubtext}>Pull down to refresh</Text>
         </View>
      );
   }, [loading, error]);

   // Optimized onEndReached handler
   const handleEndReached = useCallback(() => {
      if (onLoadMore && hasMore && !loadingMore && !loading) {
         onLoadMore();
      }
   }, [onLoadMore, hasMore, loadingMore, loading]);

   // Get item layout for better performance
   const getItemLayout = useCallback(
      (data: any, index: number) => ({
         length: ITEM_HEIGHT + 12, // item height + margin
         offset: (ITEM_HEIGHT + 12) * Math.floor(index / 2),
         index,
      }),
      []
   );

   return (
      <FlatList
         data={pokemonData}
         renderItem={renderPokemonCard}
         keyExtractor={keyExtractor}
         numColumns={2}
         contentContainerStyle={styles.container}
         columnWrapperStyle={styles.row}
         showsVerticalScrollIndicator={false}
         // Empty state
         ListEmptyComponent={ListEmptyComponent}
         ListFooterComponent={ListFooterComponent}
         // Refresh control
         refreshControl={
            onRefresh ? (
               <RefreshControl
                  refreshing={refreshing}
                  onRefresh={onRefresh}
                  colors={["#3B82F6"]}
                  progressBackgroundColor="#F3F4F6"
               />
            ) : undefined
         }
         // Infinite scroll optimization
         onEndReached={handleEndReached}
         onEndReachedThreshold={0.3} // Trigger when 30% from bottom
         // Performance optimizations
         removeClippedSubviews={true}
         maxToRenderPerBatch={10}
         windowSize={10}
         initialNumToRender={10}
         updateCellsBatchingPeriod={50}
         getItemLayout={getItemLayout}
         // Maintain scroll position
         maintainVisibleContentPosition={{
            minIndexForVisible: 0,
            autoscrollToTopThreshold: 100,
         }}
      />
   );
};

const styles = StyleSheet.create({
   container: {
      padding: 16,
      flexGrow: 1,
   },
   row: {
      justifyContent: "space-between",
   },
   centerContainer: {
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
      paddingVertical: 60,
      paddingHorizontal: 20,
   },
   loadingText: {
      fontSize: 16,
      color: "#6B7280",
      marginTop: 12,
      fontWeight: "500",
   },
   errorText: {
      fontSize: 18,
      color: "#EF4444",
      textAlign: "center",
      fontWeight: "600",
      marginBottom: 8,
   },
   errorSubtext: {
      fontSize: 14,
      color: "#9CA3AF",
      textAlign: "center",
   },
   emptyText: {
      fontSize: 18,
      color: "#6B7280",
      textAlign: "center",
      fontWeight: "600",
      marginBottom: 8,
   },
   emptySubtext: {
      fontSize: 14,
      color: "#9CA3AF",
      textAlign: "center",
   },
   footerLoader: {
      paddingVertical: 20,
      alignItems: "center",
   },
   footerText: {
      fontSize: 14,
      color: "#6B7280",
      marginTop: 8,
      fontWeight: "500",
   },
});
