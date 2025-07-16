import React from "react";
import { View, Text } from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import styles from "./Styles";

interface AbilityPillProps {
   ability: any;
   idx: number;
   total: number;
}

const AbilityPill: React.FC<AbilityPillProps> = ({ ability, idx, total }) => (
   <View
      style={[
         styles.abilityPill,
         ability.is_hidden
            ? styles.abilityPillHidden
            : styles.abilityPillNormal,
         idx !== total - 1 ? { marginBottom: 8 } : { marginBottom: 0 },
      ]}
   >
      <Text
         style={[
            styles.abilityText,
            ability.is_hidden
               ? styles.abilityTextHidden
               : styles.abilityTextNormal,
         ]}
      >
         {ability.ability.name.charAt(0).toUpperCase() +
            ability.ability.name.slice(1)}
      </Text>
      {ability.is_hidden && (
         <MaterialCommunityIcons
            name="eye-off-outline"
            size={18}
            color="#b71c1c"
            style={{ marginLeft: 8 }}
         />
      )}
   </View>
);

export default AbilityPill;
