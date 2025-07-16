import React, { memo, useMemo } from "react";
import PokemonTypeChip from "@/Features/Common/Components/PokemonTypeChip";
import { View } from "react-native";
import { styles } from "./Styles";

interface PokemonCardTypesProps {
   types: string[];
}

/**
 * Component to render the types of a Pokémon card.
 * It displays each type using the PokemonTypeChip component.
 */
const PokemonCardTypes: React.FC<PokemonCardTypesProps> = ({ types }) => {
   /**
    * Memoize the type components to avoid unnecessary re-renders.
    */
   const typeComponents = useMemo(() => {
      return types.map((type: string, index: number) => (
         /**
          * Render a PokemonTypeChip for each type.
          */
         <PokemonTypeChip key={`${type}-${index}`} type={type} />
      ));
   }, [types]);

   return (
      <View style={styles.cardType}>
         <View style={styles.cardTypeAlign}>{typeComponents}</View>
      </View>
   );
};

export default memo(PokemonCardTypes);
