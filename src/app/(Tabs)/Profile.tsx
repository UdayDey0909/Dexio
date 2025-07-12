import { StyleSheet, Text, View, ScrollView } from "react-native";
import React from "react";
import { useTheme } from "@/Theme";
import { SafeAreaView } from "react-native-safe-area-context";
import { Fonts } from "@/Theme/Fonts";

export default function Profile() {
   const { theme } = useTheme();

   return (
      <SafeAreaView
         style={[
            styles.container,
            { backgroundColor: theme.background.primary },
         ]}
      >
         <ScrollView style={styles.scrollView}>
            <View style={styles.header}>
               <Text style={[styles.title, { color: theme.text.primary }]}>
                  Trainer Profile
               </Text>
            </View>

            <View style={styles.section}>
               <Text
                  style={[styles.sectionTitle, { color: theme.text.primary }]}
               >
                  About
               </Text>
               <View
                  style={[
                     styles.aboutCard,
                     { backgroundColor: theme.background.card },
                  ]}
               >
                  <Text
                     style={[styles.aboutText, { color: theme.text.secondary }]}
                  >
                     Dexio - Your ultimate Pokémon companion app. Discover,
                     explore, and learn about Pokémon with our comprehensive
                     database.
                  </Text>
               </View>
            </View>
         </ScrollView>
      </SafeAreaView>
   );
}

const styles = StyleSheet.create({
   container: {
      flex: 1,
   },
   scrollView: {
      flex: 1,
      paddingHorizontal: 20,
   },
   header: {
      paddingVertical: 20,
      alignItems: "center",
   },
   title: {
      fontSize: 28,
      fontWeight: "bold",
      fontFamily: Fonts.headingBold, // Poppins-Bold
   },
   section: {
      marginBottom: 30,
   },
   sectionTitle: {
      fontSize: 20,
      fontWeight: "600",
      marginBottom: 15,
      fontFamily: Fonts.headingSemiBold, // Poppins-SemiBold
   },

   aboutCard: {
      padding: 16,
      borderRadius: 12,
   },
   aboutText: {
      fontSize: 14,
      lineHeight: 20,
      fontFamily: Fonts.primaryRegular, // Roboto-Regular
   },
});
