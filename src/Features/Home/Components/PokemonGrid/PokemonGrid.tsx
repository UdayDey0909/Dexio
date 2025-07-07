import { FlashList, ListRenderItem } from "@shopify/flash-list";
import React, { memo, useCallback, useMemo, useRef } from "react";
import { View, RefreshControl } from "react-native";
import PokemonGridItem from "./PokemonGridItem";
import PokemonGridFooter from "./PokemonGridFooter";
import LoadingState from "../States/LoadingState";
import ErrorState from "../States/ErrorState";
import EmptyState from "../States/EmptyState";
import { COLORS } from "../../Constants/Colors";
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

   const renderItem: ListRenderItem<PokemonCardData> = useCallback(
      ({ item }) => <PokemonGridItem pokemon={item} onPress={onPokemonPress} />,
      [onPokemonPress]
   );

   const keyExtractor = useCallback(
      (item: PokemonCardData) => `pokemon-${item.id}`,
      []
   );

   const renderEmptyComponent = useCallback(() => {
      if (loading && pokemonData.length === 0) {
         return <LoadingState message="Loading Pokémon..." />;
      }
      if (error) {
         return <ErrorState error={new Error(error)} />;
      }
      return <EmptyState />;
   }, [loading, pokemonData.length, error]);

   const renderFooterComponent = useCallback(
      () => (
         <PokemonGridFooter
            loadingMore={loadingMore}
            pokemonCount={pokemonData.length}
         />
      ),
      [loadingMore, pokemonData.length]
   );

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

   const flashListProps = useMemo(
      () => ({
         numColumns: 2,
         estimatedItemSize: 150,
         drawDistance: 500,
         removeClippedSubviews: true,
         scrollEventThrottle: 16,
         decelerationRate: "fast" as const,
         recycleItems: true,
         onEndReachedThreshold: 0.5,
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
