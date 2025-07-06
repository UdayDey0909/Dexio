// components/PokemonGrid.tsx
import React, { memo, useCallback, useMemo } from "react";
import {
   StyleSheet,
   View,
   FlatList,
   RefreshControl,
   Platform,
   ListRenderItem,
} from "react-native";
import PokemonCard from "./PokemonCard";
import LoadingState from "./LoadingState";
import ErrorState from "./ErrorState";
import EmptyState from "./EmptyState";
import { COLORS } from "../Constants/Colors";
import { PokemonCardData } from "../Types";

interface PokemonGridProps {
   pokemonData: PokemonCardData[];
   loading: boolean;
   loadingMore: boolean;
   error: string | null;
   refreshing: boolean;
   hasMore: boolean;
   onLoadMore: () => void;
   onRefresh: () => void;
   onPokemonPress?: (pokemon: PokemonCardData) => void;
}

// Optimized Pokemon Card wrapper with strict memoization
const MemoizedPokemonCard = memo(
   ({
      pokemon,
      onPress,
   }: {
      pokemon: PokemonCardData;
      onPress?: (pokemon: PokemonCardData) => void;
   }) => {
      // Memoize the press handler to prevent recreating on every render
      const handlePress = useCallback(() => {
         onPress?.(pokemon);
      }, [onPress, pokemon]);

      return (
         <View style={styles.cardWrapper}>
            <PokemonCard
               name={pokemon.name}
               id={pokemon.id}
               image={pokemon.image}
               types={pokemon.types}
               onPress={handlePress}
            />
         </View>
      );
   },
   (prevProps, nextProps) => {
      // Strict comparison for better performance
      return (
         prevProps.pokemon.id === nextProps.pokemon.id &&
         prevProps.pokemon.name === nextProps.pokemon.name &&
         prevProps.pokemon.image === nextProps.pokemon.image &&
         prevProps.pokemon.types.length === nextProps.pokemon.types.length &&
         prevProps.pokemon.types.every(
            (type, index) => type === nextProps.pokemon.types[index]
         ) &&
         prevProps.onPress === nextProps.onPress
      );
   }
);

MemoizedPokemonCard.displayName = "MemoizedPokemonCard";

const PokemonGrid: React.FC<PokemonGridProps> = ({
   pokemonData,
   loading,
   loadingMore,
   error,
   refreshing,
   hasMore,
   onLoadMore,
   onRefresh,
   onPokemonPress,
}) => {
   // Memoize the renderItem function to prevent recreation
   const renderItem: ListRenderItem<PokemonCardData> = useCallback(
      ({ item }) => (
         <MemoizedPokemonCard pokemon={item} onPress={onPokemonPress} />
      ),
      [onPokemonPress]
   );

   // Memoize key extractor
   const keyExtractor = useCallback(
      (item: PokemonCardData) => `pokemon-${item.id}`,
      []
   );

   // Memoize empty component
   const renderEmptyComponent = useCallback(() => {
      if (loading && (!pokemonData || pokemonData.length === 0)) {
         return <LoadingState message="Loading Pokémon..." />;
      }

      if (error) {
         return <ErrorState error={new Error(error)} />;
      }

      return <EmptyState />;
   }, [loading, pokemonData, error]);

   // Memoize footer component
   const renderFooterComponent = useCallback(() => {
      if (!loadingMore || !pokemonData || pokemonData.length === 0) return null;

      return (
         <View style={styles.footerContainer}>
            <LoadingState message="Loading more Pokémon..." />
         </View>
      );
   }, [loadingMore, pokemonData]);

   // Optimized end reached handler with debouncing
   const handleEndReached = useCallback(() => {
      if (
         hasMore &&
         !loading &&
         !loadingMore &&
         !refreshing &&
         pokemonData.length > 0
      ) {
         onLoadMore();
      }
   }, [
      hasMore,
      loading,
      loadingMore,
      refreshing,
      onLoadMore,
      pokemonData.length,
   ]);

   // Memoize refresh control
   const refreshControl = useMemo(
      () => (
         <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={[COLORS.accent]}
            tintColor={COLORS.accent}
            progressBackgroundColor="#1f2937"
         />
      ),
      [refreshing, onRefresh]
   );

   // Platform-specific optimizations
   const platformOptimizations = useMemo(() => {
      if (Platform.OS === "android") {
         return {
            removeClippedSubviews: true,
            maxToRenderPerBatch: 6, // Reduced from 8
            updateCellsBatchingPeriod: 50, // Increased from 30
            windowSize: 10, // Increased from 7
            initialNumToRender: 8, // Increased from 6
            getItemLayout: undefined, // Let FlatList handle it
         };
      }
      return {
         removeClippedSubviews: true,
         maxToRenderPerBatch: 8,
         updateCellsBatchingPeriod: 16,
         windowSize: 10,
         initialNumToRender: 10,
      };
   }, []);

   return (
      <FlatList
         data={pokemonData}
         renderItem={renderItem}
         keyExtractor={keyExtractor}
         numColumns={2}
         columnWrapperStyle={styles.columnWrapper}
         scrollEventThrottle={Platform.OS === "android" ? 32 : 16}
         contentContainerStyle={styles.contentContainer}
         ListEmptyComponent={renderEmptyComponent}
         showsVerticalScrollIndicator={false}
         onEndReached={handleEndReached}
         onEndReachedThreshold={0.3} // Increased threshold
         ListFooterComponent={renderFooterComponent}
         refreshControl={refreshControl}
         // Performance optimizations
         {...platformOptimizations}
         // Additional performance props
         legacyImplementation={false}
         disableVirtualization={false}
         maintainVisibleContentPosition={undefined}
         // Reduce re-renders
         extraData={pokemonData.length} // Only re-render when length changes
      />
   );
};

const styles = StyleSheet.create({
   cardWrapper: {
      flex: 1,
      maxWidth: "50%",
      paddingHorizontal: 4,
      paddingVertical: 6,
   },
   columnWrapper: {
      justifyContent: "space-between",
      paddingHorizontal: 4,
   },
   contentContainer: {
      paddingTop: 20,
      paddingHorizontal: 12,
      paddingBottom: 20,
   },
   footerContainer: {
      paddingVertical: 10,
   },
});

export default memo(PokemonGrid);
