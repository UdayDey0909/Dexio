import React, { useState } from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { AboutTab } from "./Tabs/AboutTab";
import { StatsTab } from "./Tabs/StatsTab";
import { AbilitiesTab } from "./Tabs/AbilitiesTab";
import { PokemonDetailData } from "../Types/PokemonDetailTypes";

interface PokemonDetailTabsProps {
   pokemonData: PokemonDetailData;
   useMetric: boolean;
   onToggleMetric: () => void;
}

export const PokemonDetailTabs: React.FC<PokemonDetailTabsProps> = ({
   pokemonData,
   useMetric,
   onToggleMetric,
}) => {
   const [activeTab, setActiveTab] = useState<"about" | "stats" | "abilities">(
      "about"
   );

   const tabs = [
      { id: "about", label: "About" },
      { id: "stats", label: "Stats" },
      { id: "abilities", label: "Abilities" },
   ] as const;

   const renderTabContent = () => {
      switch (activeTab) {
         case "about":
            return (
               <AboutTab
                  pokemonData={pokemonData}
                  useMetric={useMetric}
                  onToggleMetric={onToggleMetric}
               />
            );
         case "stats":
            return <StatsTab pokemon={pokemonData.pokemon} />;
         case "abilities":
            return <AbilitiesTab pokemon={pokemonData.pokemon} />;
         default:
            return null;
      }
   };

   return (
      <View style={styles.container}>
         {/* Tab Headers */}
         <View style={styles.tabHeaders}>
            {tabs.map((tab) => (
               <TouchableOpacity
                  key={tab.id}
                  style={[
                     styles.tabHeader,
                     activeTab === tab.id && styles.activeTabHeader,
                  ]}
                  onPress={() => setActiveTab(tab.id)}
               >
                  <Text
                     style={[
                        styles.tabHeaderText,
                        activeTab === tab.id && styles.activeTabHeaderText,
                     ]}
                  >
                     {tab.label}
                  </Text>
               </TouchableOpacity>
            ))}
         </View>

         {/* Tab Content */}
         <View style={styles.tabContent}>{renderTabContent()}</View>
      </View>
   );
};

const styles = StyleSheet.create({
   container: {
      flex: 1,
   },
   tabHeaders: {
      flexDirection: "row",
      paddingHorizontal: 20,
      borderBottomWidth: 1,
      borderBottomColor: "#f0f0f0",
   },
   tabHeader: {
      flex: 1,
      paddingVertical: 15,
      alignItems: "center",
   },
   activeTabHeader: {
      borderBottomWidth: 2,
      borderBottomColor: "#007AFF",
   },
   tabHeaderText: {
      fontSize: 16,
      color: "#666",
      fontWeight: "500",
   },
   activeTabHeaderText: {
      color: "#007AFF",
      fontWeight: "bold",
   },
   tabContent: {
      flex: 1,
      paddingHorizontal: 20,
   },
});
