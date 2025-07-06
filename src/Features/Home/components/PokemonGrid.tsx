// components/PokemonGrid.tsx
import React, { memo, useCallback, useMemo, useRef } from "react";
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

// Simplified Pokemon Card wrapper - removed unnecessary memoization
const PokemonCardWrapper = ({
   pokemon,
   onPress,
}: {
   pokemon: PokemonCardData;
   onPress?: (pokemon: PokemonCardData) => void;
}) => {
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
};

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
   const loadMoreCalledRef = useRef(false);

   // Simplified renderItem - removed unnecessary memoization
   const renderItem: ListRenderItem<PokemonCardData> = useCallback(
      ({ item }) => (
         <PokemonCardWrapper pokemon={item} onPress={onPokemonPress} />
      ),
      [onPokemonPress]
   );

   // Keep key extractor memoized
   const keyExtractor = useCallback(
      (item: PokemonCardData) => `pokemon-${item.id}`,
      []
   );

   // Simplified empty component
   const renderEmptyComponent = useCallback(() => {
      if (loading && pokemonData.length === 0) {
         return <LoadingState message="Loading Pokémon..." />;
      }
      if (error) {
         return <ErrorState error={new Error(error)} />;
      }
      return <EmptyState />;
   }, [loading, pokemonData.length, error]);

   // Simplified footer component
   const renderFooterComponent = useCallback(() => {
      if (!loadingMore || pokemonData.length === 0) return null;
      return (
         <View style={styles.footerContainer}>
            <LoadingState message="Loading more Pokémon..." />
         </View>
      );
   }, [loadingMore, pokemonData.length]);

   // Optimized end reached handler
   const handleEndReached = useCallback(() => {
      if (loadMoreCalledRef.current) return;

      if (
         hasMore &&
         !loading &&
         !loadingMore &&
         !refreshing &&
         pokemonData.length > 0
      ) {
         loadMoreCalledRef.current = true;
         onLoadMore();

         // Reset flag after delay
         setTimeout(() => {
            loadMoreCalledRef.current = false;
         }, 1000);
      }
   }, [
      hasMore,
      loading,
      loadingMore,
      refreshing,
      onLoadMore,
      pokemonData.length,
   ]);

   // Reset loadMore flag when loading states change
   React.useEffect(() => {
      if (!loadingMore) {
         loadMoreCalledRef.current = false;
      }
   }, [loadingMore]);

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

   // Optimized FlatList props for large lists
   const optimizedProps = useMemo(() => {
      const baseProps = {
         removeClippedSubviews: true,
         maxToRenderPerBatch: Platform.OS === "android" ? 4 : 6,
         updateCellsBatchingPeriod: Platform.OS === "android" ? 100 : 50,
         windowSize: 10,
         initialNumToRender: 8,
         getItemLayout: (data: any, index: number) => ({
            length: 200, // Approximate height of your cards
            offset: 200 * Math.floor(index / 2), // Adjust for 2 columns
            index,
         }),
      };

      return baseProps;
   }, []);

   return (
      <FlatList
         data={pokemonData}
         renderItem={renderItem}
         keyExtractor={keyExtractor}
         numColumns={2}
         columnWrapperStyle={styles.columnWrapper}
         scrollEventThrottle={16}
         contentContainerStyle={styles.contentContainer}
         ListEmptyComponent={renderEmptyComponent}
         showsVerticalScrollIndicator={false}
         onEndReached={handleEndReached}
         onEndReachedThreshold={0.5}
         ListFooterComponent={renderFooterComponent}
         refreshControl={refreshControl}
         // Optimized props for large lists
         {...optimizedProps}
         // Additional performance optimizations
         legacyImplementation={false}
         disableVirtualization={false}
         // REMOVED: extraData prop that was causing unnecessary re-renders
         // extraData={dataLength} // This was causing performance issues

         // Optimize scrolling
         decelerationRate="fast"
         bounces={true}
         bouncesZoom={false}
         alwaysBounceVertical={false}
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

// Simplified memo comparison
export default memo(PokemonGrid, (prevProps, nextProps) => {
   return (
      prevProps.pokemonData.length === nextProps.pokemonData.length &&
      prevProps.loading === nextProps.loading &&
      prevProps.loadingMore === nextProps.loadingMore &&
      prevProps.error === nextProps.error &&
      prevProps.refreshing === nextProps.refreshing &&
      prevProps.hasMore === nextProps.hasMore
   );
});
