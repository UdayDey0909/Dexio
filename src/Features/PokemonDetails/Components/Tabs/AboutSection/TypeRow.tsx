import React from "react";
import { View, Text } from "react-native";
import PokemonTypeIcon from "@/Components/PokemonTypeIcon";
import styles from "./Styles";

interface TypeRowProps {
   type: string;
   theme: any;
}

const TypeRow: React.FC<TypeRowProps> = ({ type, theme }) => (
   <View style={styles.typeRow}>
      <PokemonTypeIcon
         type={type}
         size={28}
         background
         style={{ marginRight: 8 }}
      />
      <Text style={[styles.typeText, { color: theme.text.primary }]}>
         {" "}
         {type.toUpperCase()}{" "}
      </Text>
   </View>
);

export default TypeRow;
