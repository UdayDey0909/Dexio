import React, { memo } from "react";
import { View, Text } from "react-native";
import { styles } from "./Styles";

interface PokemonCardHeaderProps {
   name: string;
   id: number;
}

/**
 * Component to render the header of a Pokemon card
 * @param {PokemonCardHeaderProps} props - The properties for the component
 * @param {string} props.name - The name of the Pokemon
 * @param {number} props.id - The ID of the Pokemon
 */
const PokemonCardHeader: React.FC<PokemonCardHeaderProps> = ({
   name,
   id,
}: PokemonCardHeaderProps) => {
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
