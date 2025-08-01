import React, { memo } from "react";
import { View, Text, ActivityIndicator } from "react-native";
import { useTheme } from "@/Theme";
import { styles } from "./Styles";

interface PokemonGridFooterProps {
   loadingMore: boolean;
   pokemonCount: number;
}

/**
 * Component to render the footer of the Pokémon grid.
 * It displays a compact loading state when more Pokémon are being loaded.
 * This is useful for infinite scrolling scenarios.
 */
const PokemonGridFooter: React.FC<PokemonGridFooterProps> = ({
   loadingMore,
   pokemonCount,
}) => {
   const { theme } = useTheme();

   if (!loadingMore || pokemonCount === 0) return null;

   return (
      <View
         style={[
            styles.footerContainer,
            { backgroundColor: theme.background.primary },
         ]}
      >
         <View style={styles.footerContent}>
            <ActivityIndicator size="small" color={theme.accent} />
            <Text style={[styles.footerText, { color: theme.text.secondary }]}>
               Loading more Pokémon...
            </Text>
         </View>
      </View>
   );
};

export default memo(PokemonGridFooter);
