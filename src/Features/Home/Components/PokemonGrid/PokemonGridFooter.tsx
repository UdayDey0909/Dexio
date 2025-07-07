import React, { memo } from "react";
import { View } from "react-native";
import LoadingState from "../States/LoadingState";
import { styles } from "./Styles";

interface PokemonGridFooterProps {
   loadingMore: boolean;
   pokemonCount: number;
}

const PokemonGridFooter: React.FC<PokemonGridFooterProps> = ({
   loadingMore,
   pokemonCount,
}) => {
   if (!loadingMore || pokemonCount === 0) return null;

   return (
      <View style={styles.footerContainer}>
         <LoadingState message="Loading more Pokémon..." />
      </View>
   );
};

export default memo(PokemonGridFooter);
