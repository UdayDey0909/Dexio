// PokemonListScreen.tsx
import React, { useMemo } from "react";
import { View, StyleSheet, SafeAreaView } from "react-native";
import { PokemonGrid } from "@/Features/Pokedex/Components/PokemonGrid";
import { usePokemonGrid } from "@/Features/Pokedex/Hooks/usePokemonGrid";
import { usePokemonList } from "@/Services/Hooks/Pokemon/usePokemonList";
import { PokemonCardData } from "@/Features/Pokedex/Types";
import type { Pokemon } from "pokenode-ts";

export const PokemonListScreen: React.FC = () => {
   const {
      pokemonData,
      loading,
      error,
      refreshing,
      onRefresh,
      loadMore,
      hasMore,
   } = usePokemonGrid(20, 0);

   return (
      <SafeAreaView style={styles.container}>
         <PokemonGrid
            pokemonData={pokemonData}
            loading={loading}
            error={error}
            refreshing={refreshing}
            onRefresh={onRefresh}
            onLoadMore={hasMore ? loadMore : undefined}
         />
      </SafeAreaView>
   );
};

// Alternative: Simple version using existing usePokemonList hook
export const PokemonListScreenSimple: React.FC = () => {
   const { data, loading, error, refetch } = usePokemonList(0, 20);

   // Transform Pokemon data to PokemonCardData format
   const pokemonData = useMemo(() => {
      if (!data) return [];

      return data.map(
         (pokemon: Pokemon): PokemonCardData => ({
            id: pokemon.id,
            name: pokemon.name.charAt(0).toUpperCase() + pokemon.name.slice(1),
            image: {
               uri:
                  pokemon.sprites.other?.["official-artwork"]?.front_default ||
                  pokemon.sprites.front_default ||
                  `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${pokemon.id}.png`,
            },
            types: pokemon.types.map(
               (type) =>
                  type.type.name.charAt(0).toUpperCase() +
                  type.type.name.slice(1)
            ),
         })
      );
   }, [data]);

   return (
      <SafeAreaView style={styles.container}>
         <PokemonGrid
            pokemonData={pokemonData}
            loading={loading}
            error={error}
            refreshing={false}
            onRefresh={refetch}
         />
      </SafeAreaView>
   );
};

const styles = StyleSheet.create({
   container: {
      flex: 1,
      backgroundColor: "#F3F4F6",
   },
});
