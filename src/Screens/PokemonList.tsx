import React, { useCallback } from "react";
import PokemonGrid from "@/Features/Home/Components/PokemonGrid";
import AppHeader from "@/Features/Home/Components/Common/AppHeader";
import { COLORS } from "@/Features/Home/Constants/Colors";
import { PokemonCardData } from "@/Features/Home/Types";
import { usePokemonList } from "@/Features/Home/Hooks/usePokemonList";
import {
   StyleSheet,
   SafeAreaView,
   StatusBar,
   Platform,
   Alert,
} from "react-native";

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
   } = usePokemonList(20, 0);

   // Memoized Pokemon press handler
   const handlePokemonPress = useCallback((pokemon: PokemonCardData) => {
      const typeText =
         pokemon.types.length > 1
            ? `Types: ${pokemon.types.join(", ")}`
            : `Type: ${pokemon.types[0]}`;

      Alert.alert(`${pokemon.name} #${pokemon.id}`, typeText, [
         { text: "OK", style: "default" },
         {
            text: "Details",
            onPress: () => {
               // TODO: Navigate to Pokemon details screen
               console.log(`Navigate to details for ${pokemon.name}`);
            },
         },
      ]);
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
