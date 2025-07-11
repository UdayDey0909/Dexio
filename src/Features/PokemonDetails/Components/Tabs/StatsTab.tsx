import React from "react";
import { View, Text, StyleSheet, ScrollView } from "react-native";
import type { Pokemon } from "pokenode-ts";

interface StatsTabProps {
   pokemon: Pokemon | null;
}

export const StatsTab: React.FC<StatsTabProps> = ({ pokemon }) => {
   if (!pokemon) return null;

   const getStatColor = (statValue: number) => {
      if (statValue >= 100) return "#4CAF50"; // Green
      if (statValue >= 70) return "#FF9800"; // Orange
      if (statValue >= 50) return "#2196F3"; // Blue
      return "#F44336"; // Red
   };

   const getStatName = (statName: string) => {
      const statNames: Record<string, string> = {
         hp: "HP",
         attack: "Attack",
         defense: "Defense",
         "special-attack": "Sp. Attack",
         "special-defense": "Sp. Defense",
         speed: "Speed",
      };
      return statNames[statName] || statName;
   };

   const totalStats = pokemon.stats.reduce(
      (sum, stat) => sum + stat.base_stat,
      0
   );

   return (
      <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
         <View style={styles.section}>
            <Text style={styles.sectionTitle}>Base Stats</Text>

            {/* Total Stats */}
            <View style={styles.totalStatsContainer}>
               <Text style={styles.totalStatsLabel}>Total</Text>
               <Text style={styles.totalStatsValue}>{totalStats}</Text>
            </View>

            {/* Individual Stats */}
            {pokemon.stats.map((stat, index) => (
               <View key={index} style={styles.statItem}>
                  <View style={styles.statHeader}>
                     <Text style={styles.statName}>
                        {getStatName(stat.stat.name)}
                     </Text>
                     <Text style={styles.statValue}>{stat.base_stat}</Text>
                  </View>
                  <View style={styles.statBarContainer}>
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
               </View>
            ))}
         </View>
      </ScrollView>
   );
};

const styles = StyleSheet.create({
   container: {
      flex: 1,
      paddingTop: 20,
   },
   section: {
      marginBottom: 25,
   },
   sectionTitle: {
      fontSize: 18,
      fontWeight: "bold",
      color: "#333",
      marginBottom: 20,
   },
   totalStatsContainer: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      backgroundColor: "#f0f0f0",
      padding: 15,
      borderRadius: 10,
      marginBottom: 15,
   },
   totalStatsLabel: {
      fontSize: 16,
      fontWeight: "bold",
      color: "#333",
   },
   totalStatsValue: {
      fontSize: 16,
      fontWeight: "bold",
      color: "#007AFF",
   },
   statItem: {
      marginBottom: 15,
   },
   statHeader: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      marginBottom: 8,
   },
   statName: {
      fontSize: 14,
      fontWeight: "600",
      color: "#333",
   },
   statValue: {
      fontSize: 14,
      fontWeight: "bold",
      color: "#333",
   },
   statBarContainer: {
      backgroundColor: "#e0e0e0",
      borderRadius: 10,
      height: 12,
      overflow: "hidden",
   },
   statBar: {
      height: "100%",
      borderRadius: 10,
   },
});
