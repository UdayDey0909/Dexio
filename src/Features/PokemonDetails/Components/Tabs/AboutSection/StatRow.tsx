import React from "react";
import { View, Text } from "react-native";
import { getStatColor } from "@/Features/PokemonDetails/Utils/Formatters";
import styles from "./Styles";

interface StatRowProps {
   stat: any;
   idx: number;
   theme: any;
   isDark: boolean;
}

const statAbbr: Record<string, string> = {
   hp: "HP",
   attack: "ATK",
   defense: "DEF",
   "special-attack": "Sp. ATK",
   "special-defense": "Sp. DEF",
   speed: "SPD",
};

const StatRow: React.FC<StatRowProps> = ({ stat, theme, isDark }) => (
   <View style={styles.statRow}>
      <Text style={[styles.statLabel, { color: theme.text.secondary }]}>
         {statAbbr[stat.stat.name] || stat.stat.name.toUpperCase()}
      </Text>
      <View
         style={[
            styles.statBarBg,
            { backgroundColor: isDark ? "#5a6270" : theme.border.medium },
         ]}
      >
         <View
            style={[
               styles.statBar,
               {
                  width: `${(stat.base_stat / 255) * 100}%`,
                  backgroundColor: getStatColor(stat.base_stat),
               },
            ]}
         />
      </View>
      <Text style={[styles.statValue, { color: theme.text.secondary }]}>
         {stat.base_stat}
      </Text>
   </View>
);

export default StatRow;
