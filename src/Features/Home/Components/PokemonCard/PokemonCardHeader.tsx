import React, { memo } from "react";
import { View, Text } from "react-native";
import { styles } from "./Styles";

interface PokemonCardHeaderProps {
   name: string;
   id: number;
}

const PokemonCardHeader: React.FC<PokemonCardHeaderProps> = ({ name, id }) => {
   return (
      <View style={styles.cardHeader}>
         <Text style={styles.name} numberOfLines={1} ellipsizeMode="tail">
            {name}
         </Text>
         <Text style={styles.pokedexNumber}>#{id}</Text>
      </View>
   );
};

export default memo(PokemonCardHeader);
