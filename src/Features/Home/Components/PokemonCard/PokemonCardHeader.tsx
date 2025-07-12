import React, { memo } from "react";
import { View, Text } from "react-native";
import { styles } from "./Styles";

interface PokemonCardHeaderProps {
   name: string;
   id: number;
}

/**
 * Component to render the header of a Pokemon card
 */
const PokemonCardHeader: React.FC<PokemonCardHeaderProps> = ({ name, id }) => {
   return (
      <View style={styles.cardHeader}>
         <Text style={styles.name} numberOfLines={1} ellipsizeMode="tail">
            {name.split("-")[0]}
         </Text>
         <Text style={styles.pokedexNumber}>N°{id}</Text>
      </View>
   );
};

export default memo(PokemonCardHeader);
