// App.tsx
import React, { useCallback } from "react";
import {
   StyleSheet,
   SafeAreaView,
   StatusBar,
   Platform,
   Alert,
} from "react-native";
import PokemonGrid from "@/Features/Home/components/PokemonGrid";
import AppHeader from "@/Features/Home/components/AppHeader";
import { COLORS } from "@/Features/Home/constants/colors";
import { PokemonCardData } from "@/Features/Home/types";
import { usePokemonGrid } from "@/Features/Home/hooks/usePokemonGrid";

export const PokemonList: React.FC = () => {
   const {
      pokemonData,
      loading,
      loadingMore,
      error,
      refreshing,
      hasMore,
      onRefresh,
      loadMore,
   } = usePokemonGrid(20, 0);

   const handlePokemonPress = useCallback((pokemon: PokemonCardData) => {
      Alert.alert(
         `${pokemon.name} #${pokemon.id}`,
         `Types: ${pokemon.types.join(", ")}`,
         [{ text: "OK" }]
      );
   }, []);

   return (
      <SafeAreaView style={styles.container}>
         <StatusBar
            backgroundColor={COLORS.background}
            barStyle="light-content"
            translucent={Platform.OS === "ios"}
         />

         <AppHeader title="PokéDEX" />

         <PokemonGrid
            pokemonData={pokemonData}
            loading={loading}
            loadingMore={loadingMore}
            error={error}
            refreshing={refreshing}
            hasMore={hasMore}
            onLoadMore={loadMore}
            onRefresh={onRefresh}
            onPokemonPress={handlePokemonPress}
         />
      </SafeAreaView>
   );
};

const styles = StyleSheet.create({
   container: {
      flex: 1,
      backgroundColor: COLORS.background,
   },
});
