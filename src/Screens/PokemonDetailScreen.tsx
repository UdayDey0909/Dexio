import React from "react";
import { SafeAreaView, StatusBar, StyleSheet } from "react-native";
import { PokemonDetailHeader } from "@/Features/PokemonDetails/Components/PokemonDetailHeader";
import { PokemonDetailContent } from "@/Features/PokemonDetails/Components/PokemonDetailContent";
import LoadingView from "@/Features/Common/Components/LoadingView";
import ErrorView from "@/Features/Common/Components/ErrorView";
import { usePokemonDetail } from "@/Features/PokemonDetails/Hooks/usePokemonDetail";
import { usePokemonDetailState } from "@/Features/PokemonDetails/Hooks/usePokemonDetailState";
import { getTypeColor } from "@/Theme/Utils/PokeBallBG";

interface PokemonDetailScreenProps {
   pokemonId: string;
}

export const PokemonDetailScreen: React.FC<PokemonDetailScreenProps> = ({
   pokemonId,
}) => {
   const {
      pokemonData,
      loading,
      error,
      refetch,
      isShiny,
      toggleShiny,
      currentSprite,
      hasShinySprite,
   } = usePokemonDetail(pokemonId);

   const { useMetric, setUseMetric } = usePokemonDetailState();

   const backgroundColor = React.useMemo(() => {
      if (
         !pokemonData.pokemon?.types ||
         pokemonData.pokemon.types.length === 0
      ) {
         return "#68A090";
      }
      return getTypeColor(pokemonData.pokemon.types[0].type.name);
   }, [pokemonData.pokemon?.types]);

   if (loading) {
      return <LoadingView backgroundColor={backgroundColor} />;
   }

   if (error) {
      return (
         <ErrorView
            backgroundColor={backgroundColor}
            error={error}
            onRetry={refetch}
         />
      );
   }

   if (!pokemonData.pokemon) {
      return (
         <ErrorView
            backgroundColor={backgroundColor}
            error="Pokémon not found"
            showGoBack
         />
      );
   }

   return (
      <SafeAreaView style={[styles.container, { backgroundColor }]}>
         <StatusBar
            backgroundColor={backgroundColor}
            barStyle="light-content"
         />

         <PokemonDetailHeader
            pokemon={pokemonData.pokemon}
            backgroundColor={backgroundColor}
            currentSprite={currentSprite}
            isShiny={isShiny}
            hasShinySprite={hasShinySprite}
            onToggleShiny={toggleShiny}
         />

         <PokemonDetailContent
            pokemonData={pokemonData}
            useMetric={useMetric}
            onToggleMetric={() => setUseMetric(!useMetric)}
         />
      </SafeAreaView>
   );
};

const styles = StyleSheet.create({
   container: {
      flex: 1,
   },
});
