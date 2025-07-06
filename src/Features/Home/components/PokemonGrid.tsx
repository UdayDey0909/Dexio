import React, { memo, useCallback, useMemo, useRef } from "react";
import { StyleSheet, View, RefreshControl } from "react-native";
import { FlashList, ListRenderItem } from "@shopify/flash-list";
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
const PokemonCardWrapper = memo(
   ({
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
   }
);

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

   // Simplified renderItem for FlashList
   const renderItem: ListRenderItem<PokemonCardData> = useCallback(
      ({ item }) => (
         <PokemonCardWrapper pokemon={item} onPress={onPokemonPress} />
      ),
      [onPokemonPress]
   );

   // Key extractor for FlashList
   const keyExtractor = useCallback(
      (item: PokemonCardData) => `pokemon-${item.id}`,
      []
   );

   // Empty component for FlashList
   const renderEmptyComponent = useCallback(() => {
      if (loading && pokemonData.length === 0) {
         return <LoadingState message="Loading Pokémon..." />;
      }
      if (error) {
         return <ErrorState error={new Error(error)} />;
      }
      return <EmptyState />;
   }, [loading, pokemonData.length, error]);

   // Footer component for FlashList
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

   // FlashList specific optimizations
   const flashListProps = useMemo(
      () => ({
         // Essential FlashList props
         numColumns: 2,
         estimatedItemSize: 150, // Approximate height of each card

         // Performance optimizations
         drawDistance: 500, // How far ahead to render items
         removeClippedSubviews: true,

         // Scrolling optimizations
         scrollEventThrottle: 16,
         decelerationRate: "fast" as const,

         // Memory management
         recycleItems: true,

         // End reached configuration
         onEndReachedThreshold: 0.5,

         // Visual optimizations
         showsVerticalScrollIndicator: false,
         bounces: true,
         alwaysBounceVertical: false,
      }),
      []
   );

   return (
      <View style={styles.container}>
         <FlashList
            data={pokemonData}
            renderItem={renderItem}
            keyExtractor={keyExtractor}
            contentContainerStyle={styles.contentContainer}
            ListEmptyComponent={renderEmptyComponent}
            ListFooterComponent={renderFooterComponent}
            onEndReached={handleEndReached}
            refreshControl={refreshControl}
            {...flashListProps}
         />
      </View>
   );
};

const styles = StyleSheet.create({
   container: {
      flex: 1,
   },
   cardWrapper: {
      flex: 1,
      maxWidth: "50%",
      paddingHorizontal: 4,
      paddingVertical: 6,
   },
   contentContainer: {
      paddingTop: 20,
      paddingHorizontal: 12,
      paddingBottom: 20,
   },
   footerContainer: {
      paddingVertical: 10,
      paddingHorizontal: 12,
   },
});

// Simplified memo comparison for FlashList
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
