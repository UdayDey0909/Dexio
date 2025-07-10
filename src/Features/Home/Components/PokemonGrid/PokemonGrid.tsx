import React, { memo, useCallback, useMemo, useRef } from "react";
import { FlashList, ListRenderItem } from "@shopify/flash-list";
import { View, RefreshControl } from "react-native";
import PokemonGridFooter from "./PokemonGridFooter";
import LoadingState from "../States/LoadingState";
import PokemonGridItem from "./PokemonGridItem";
import { lightThemeColors } from "@/Theme/Core/Variants";
import ErrorState from "../States/ErrorState";
import EmptyState from "../States/EmptyState";
import { PokemonCardData } from "../../Types";
import { styles } from "./Styles";

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

/**
 * Component to render a grid of Pokémon cards with infinite scrolling.
 * It handles loading states, error states, and refresh functionality.
 * It uses FlashList for performance optimization with large datasets.
 */
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

   /**
    * Callback to render each Pokémon card item in the grid.
    */
   const renderItem: ListRenderItem<PokemonCardData> = useCallback(
      ({ item }) => <PokemonGridItem pokemon={item} onPress={onPokemonPress} />,
      [onPokemonPress]
   );

   /**
    * Key extractor function to uniquely identify each Pokémon card.
    * This is important for performance optimization in lists.
    */
   const keyExtractor = useCallback(
      (item: PokemonCardData) => `pokemon-${item.id}`,
      []
   );

   /**
    * Callback to render the empty component based on the current state.
    * It shows a loading state, error state, or an empty state based on the conditions.
    */
   const renderEmptyComponent = useCallback(() => {
      if (loading && pokemonData.length === 0) {
         return <LoadingState message="Loading Pokémon..." />;
      }
      if (error) {
         return <ErrorState error={new Error(error)} />;
      }
      return <EmptyState />;
   }, [loading, pokemonData.length, error]);

   /**
    * Callback to render the footer component for the grid.
    * It shows a loading footer when more Pokémon are being loaded.
    */
   const renderFooterComponent = useCallback(
      () => (
         <PokemonGridFooter
            loadingMore={loadingMore}
            pokemonCount={pokemonData.length}
         />
      ),
      [loadingMore, pokemonData.length]
   );

   /**
    * Callback to handle the end of the list being reached.
    * It triggers loading more Pokémon if there are more available and not currently loading.
    */
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

   React.useEffect(() => {
      if (!loadingMore) {
         loadMoreCalledRef.current = false;
      }
   }, [loadingMore]);

   /**
    * Memoized refresh control to handle pull-to-refresh functionality.
    * It shows a spinner when refreshing and allows the user to trigger a refresh.
    */
   const refreshControl = useMemo(
      () => (
         <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={[lightThemeColors.accent]}
            tintColor={lightThemeColors.accent}
            progressBackgroundColor={lightThemeColors.background.secondary}
         />
      ),
      [refreshing, onRefresh]
   );

   /**
    * Memoized FlashList properties to optimize performance.
    * It includes properties like number of columns, estimated item size, and scroll behavior.
    */
   const flashListProps = useMemo(
      () => ({
         numColumns: 2,
         estimatedItemSize: 150,
         renderAheadOffset: 150,
         removeClippedSubviews: true,
         scrollEventThrottle: 16,
         decelerationRate: "normal" as const,
         recycleItems: true,
         onEndReachedThreshold: 0.5,
         showsVerticalScrollIndicator: false,
         bounces: true,
         alwaysBounceVertical: true,
      }),
      []
   );

   /**
    * Main render function for the Pokémon grid.
    * It uses FlashList to render the Pokémon cards in a grid layout.
    */
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

/**
 * Memoized export of the Pokémon grid component.
 * It prevents unnecessary re-renders by comparing props.
 */
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
