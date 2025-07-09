import React, { memo, useCallback } from "react";
import { PokemonCardData } from "../../Types";
import PokemonCard from "../PokemonCard";
import { View } from "react-native";
import { styles } from "./Styles";

interface PokemonGridItemProps {
   pokemon: PokemonCardData;
   onPress?: (pokemon: PokemonCardData) => void;
}

/**
 * Component to render a single Pokémon card in the grid.
 * It handles the onPress event and passes the pokemon data to the parent component.
 */
const PokemonGridItem: React.FC<PokemonGridItemProps> = ({
   pokemon,
   onPress,
}) => {
   const handlePress = useCallback(() => {
      onPress?.(pokemon);
   }, [onPress, pokemon]);

   return (
      <View style={styles.cardWrapper}>
         <PokemonCard
            name={pokemon.name}
            id={pokemon.id}
            image={pokemon.image}
            types={pokemon.types}
            onPress={handlePress}
         />
      </View>
   );
};

export default memo(PokemonGridItem);
