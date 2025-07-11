import React from "react";
import { View, Text, StyleSheet, ScrollView } from "react-native";
import type { Pokemon } from "pokenode-ts";

interface AbilitiesTabProps {
   pokemon: Pokemon | null;
}

export const AbilitiesTab: React.FC<AbilitiesTabProps> = ({ pokemon }) => {
   if (!pokemon) return null;

   return (
      <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
         <View style={styles.section}>
            <Text style={styles.sectionTitle}>Abilities</Text>
            {pokemon.abilities.map((ability, index) => (
               <View key={index} style={styles.abilityItem}>
                  <View style={styles.abilityHeader}>
                     <Text style={styles.abilityName}>
                        {ability.ability.name}
                     </Text>
                     {ability.is_hidden && (
                        <View style={styles.hiddenBadge}>
                           <Text style={styles.hiddenBadgeText}>Hidden</Text>
                        </View>
                     )}
                  </View>
                  <Text style={styles.abilitySlot}>Slot {ability.slot}</Text>
                  <Text style={styles.abilityDescription}>
                     {ability.is_hidden ? "Hidden Ability" : "Normal Ability"}
                  </Text>
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
   abilityItem: {
      backgroundColor: "#f8f8f8",
      padding: 15,
      borderRadius: 10,
      marginBottom: 10,
   },
   abilityHeader: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      marginBottom: 5,
   },
   abilityName: {
      fontSize: 16,
      fontWeight: "bold",
      color: "#333",
      textTransform: "capitalize",
      flex: 1,
   },
   hiddenBadge: {
      backgroundColor: "#FF6B6B",
      paddingHorizontal: 8,
      paddingVertical: 4,
      borderRadius: 12,
   },
   hiddenBadgeText: {
      color: "#fff",
      fontSize: 10,
      fontWeight: "bold",
   },
   abilitySlot: {
      fontSize: 12,
      color: "#999",
      marginBottom: 5,
   },
   abilityDescription: {
      fontSize: 14,
      color: "#666",
   },
});
