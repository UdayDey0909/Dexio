// components/PokemonGrid.tsx
import React, { memo, useCallback } from "react";
import {
   StyleSheet,
   View,
   FlatList,
   RefreshControl,
   Platform,
} from "react-native";
import PokemonCard from "./PokemonCard";
import LoadingState from "./LoadingState";
import ErrorState from "./ErrorState";
import EmptyState from "./EmptyState";
import { COLORS } from "../constants/colors";
import { PokemonCardData } from "../types";

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

const MemoizedPokemonCard = memo(
   ({
      pokemon,
      onPress,
   }: {
      pokemon: PokemonCardData;
      onPress?: (pokemon: PokemonCardData) => void;
   }) => (
      <View style={styles.cardWrapper}>
         <PokemonCard
            name={pokemon.name}
            id={pokemon.id}
            image={pokemon.image}
            types={pokemon.types}
            onPress={() => onPress?.(pokemon)}
         />
      </View>
   ),
   (prevProps, nextProps) => {
      if (prevProps.pokemon.id !== nextProps.pokemon.id) return false;
      if (prevProps.pokemon.name !== nextProps.pokemon.name) return false;
      if (prevProps.pokemon.image !== nextProps.pokemon.image) return false;
      if (prevProps.pokemon.types.length !== nextProps.pokemon.types.length)
         return false;

      for (let i = 0; i < prevProps.pokemon.types.length; i++) {
         if (prevProps.pokemon.types[i] !== nextProps.pokemon.types[i])
            return false;
      }

      return true;
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
   const renderItem = useCallback(
      ({ item }: { item: PokemonCardData }) => (
         <MemoizedPokemonCard pokemon={item} onPress={onPokemonPress} />
      ),
      [onPokemonPress]
   );

   const keyExtractor = useCallback(
      (item: PokemonCardData) => item.id.toString(),
      []
   );

   const renderEmptyComponent = useCallback(() => {
      if (loading && (!pokemonData || pokemonData.length === 0)) {
         return <LoadingState message="Loading Pokémon..." />;
      }

      if (error) {
         return <ErrorState error={new Error(error)} />;
      }

      return <EmptyState />;
   }, [loading, pokemonData, error]);

   const renderFooterComponent = useCallback(() => {
      if (!loadingMore || !pokemonData || pokemonData.length === 0) return null;

      return <LoadingState message="Loading more Pokémon..." />;
   }, [loadingMore, pokemonData]);

   const handleEndReached = useCallback(() => {
      if (hasMore && !loading && !loadingMore && !refreshing) {
         onLoadMore();
      }
   }, [hasMore, loading, loadingMore, refreshing, onLoadMore]);

   const androidProps =
      Platform.OS === "android"
         ? {
              removeClippedSubviews: true,
              maxToRenderPerBatch: 8,
              updateCellsBatchingPeriod: 30,
              windowSize: 7,
              initialNumToRender: 6,
           }
         : {};

   return (
      <FlatList
         data={pokemonData}
         renderItem={renderItem}
         keyExtractor={keyExtractor}
         numColumns={2}
         columnWrapperStyle={styles.columnWrapper}
         scrollEventThrottle={Platform.OS === "android" ? 100 : 16}
         contentContainerStyle={styles.contentContainer}
         ListEmptyComponent={renderEmptyComponent}
         showsVerticalScrollIndicator={false}
         onEndReached={handleEndReached}
         onEndReachedThreshold={0.2}
         ListFooterComponent={renderFooterComponent}
         refreshControl={
            <RefreshControl
               refreshing={refreshing}
               onRefresh={onRefresh}
               colors={[COLORS.accent]}
               tintColor={COLORS.accent}
               progressBackgroundColor="#1f2937"
            />
         }
         {...androidProps}
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
   },
   contentContainer: {
      paddingTop: 20,
      paddingHorizontal: 12,
      paddingBottom: 20,
   },
});

export default PokemonGrid;
