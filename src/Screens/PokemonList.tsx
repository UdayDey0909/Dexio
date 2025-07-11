// src/Screens/PokemonList.tsx
import React, { useCallback } from "react";
import PokemonGrid from "@/Features/Home/Components/PokemonGrid";
import AppHeader from "@/Features/Home/Components/Common/AppHeader";
import { lightThemeColors } from "@/Theme/Core/Variants";
import { PokemonCardData } from "@/Features/Home/Types";
import { usePokemonList } from "@/Features/Home/Hooks/usePokemonList";
import { useRouter } from "expo-router";
import {
   StyleSheet,
   SafeAreaView,
   StatusBar,
   Platform,
   Alert,
} from "react-native";

export const PokemonList: React.FC = () => {
   const router = useRouter();
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

   // Updated Pokemon press handler with navigation
   const handlePokemonPress = useCallback(
      (pokemon: PokemonCardData) => {
         try {
            // Navigate to Pokemon detail screen
            router.push(`/Pokemon/${pokemon.id}`);
         } catch (error) {
            console.error("Navigation error:", error);

            // Fallback to Alert if navigation fails
            const typeText =
               pokemon.types.length > 1
                  ? `Types: ${pokemon.types.join(", ")}`
                  : `Type: ${pokemon.types[0]}`;

            Alert.alert(`${pokemon.name} #${pokemon.id}`, typeText, [
               { text: "OK", style: "default" },
            ]);
         }
      },
      [router]
   );

   return (
      <SafeAreaView style={styles.container}>
         <StatusBar
            backgroundColor={lightThemeColors.background.primary}
            barStyle="dark-content"
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
      backgroundColor: lightThemeColors.background.primary,
   },
});
