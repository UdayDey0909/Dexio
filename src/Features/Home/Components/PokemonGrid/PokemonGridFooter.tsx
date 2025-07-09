import React, { memo } from "react";
import LoadingState from "../States/LoadingState";
import { View } from "react-native";
import { styles } from "./Styles";

interface PokemonGridFooterProps {
   loadingMore: boolean;
   pokemonCount: number;
}

/**
 * Component to render the footer of the Pokémon grid.
 * It displays a loading state when more Pokémon are being loaded.
 * This is useful for infinite scrolling scenarios.
 */
const PokemonGridFooter: React.FC<PokemonGridFooterProps> = ({
   loadingMore,
   pokemonCount,
}) => {
   if (!loadingMore || pokemonCount === 0) return null;

   return (
      <View style={styles.footerContainer}>
         {/* //! Add Proper Loading State Animation Later */}
         <LoadingState message="Loading more Pokémon..." />
      </View>
   );
};

export default memo(PokemonGridFooter);
