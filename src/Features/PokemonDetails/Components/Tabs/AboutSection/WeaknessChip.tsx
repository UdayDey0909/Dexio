import React from "react";
import { View, Text } from "react-native";
import PokemonTypeIcon from "@/Components/PokemonTypeIcon";
import { getTypeColor, lightenColor } from "@/Theme/Utils/PokeBallBG";
import styles from "./Styles";

interface WeaknessChipProps {
   type: string;
   mult: number;
}

const WeaknessChip: React.FC<WeaknessChipProps> = ({ type, mult }) => (
   <View
      style={[
         styles.weaknessChip,
         { backgroundColor: lightenColor(getTypeColor(type), 0.15) },
      ]}
   >
      <PokemonTypeIcon type={type} size={16} style={{ marginRight: 4 }} />
      <Text style={styles.weaknessText}>{type.toUpperCase()}</Text>
      <Text style={styles.weaknessMult}>x{Number(mult)}</Text>
   </View>
);

export default WeaknessChip;
