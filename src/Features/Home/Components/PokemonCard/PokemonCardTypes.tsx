import React, { memo, useMemo } from "react";
import { View } from "react-native";
import PokemonTypeChip from "../Common/PokemonTypeChip";
import { styles } from "./Styles";

interface PokemonCardTypesProps {
   types: string[];
}

const PokemonCardTypes: React.FC<PokemonCardTypesProps> = ({ types }) => {
   const typeComponents = useMemo(() => {
      return types.map((type: string, index: number) => (
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
