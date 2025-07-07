import React, { memo, useCallback } from "react";
import { View } from "react-native";
import PokemonCard from "../PokemonCard";
import { PokemonCardData } from "../../Types";
import { styles } from "./Styles";

interface PokemonGridItemProps {
   pokemon: PokemonCardData;
   onPress?: (pokemon: PokemonCardData) => void;
}

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
