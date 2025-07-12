import React from "react";
import { View, Text, StyleSheet } from "react-native";
import AnimatedPokeball from "@/Assets/SVG/AnimatedPokeBall";
import { useTheme, ThemeToggle } from "@/Theme";
import { SafeAreaView } from "react-native-safe-area-context";
import { Fonts } from "@/Theme/Fonts";

export default function AppHeader() {
   const { theme, isDark } = useTheme();
   const bottomColor = isDark ? "#FFFFFF" : "#F3F4F6"; // white in dark, light gray in light
   const strokeColor = isDark ? "#D1D5DB" : "#D1D5DB"; // subtle outline for both
   return (
      <SafeAreaView
         edges={["top"]}
         style={{ backgroundColor: theme.background.primary }}
      >
         <View style={styles.header}>
            <AnimatedPokeball
               size={36}
               style={styles.icon}
               topColor="#3571C6" // Great Ball blue
               bottomColor={bottomColor}
               middleColor="#FFFFFF" // Great Ball white
               bandColor="#E04A4A" // Great Ball red
               strokeColor={strokeColor}
            />
            <Text style={styles.title}>
               <Text style={[styles.dex, { color: isDark ? "#fff" : "#222" }]}>
                  Dex
               </Text>
               <Text style={styles.accent}>io</Text>
            </Text>
            <ThemeToggle style={styles.themeToggle} />
         </View>
      </SafeAreaView>
   );
}

const styles = StyleSheet.create({
   header: {
      flexDirection: "row",
      alignItems: "center",
      paddingTop: 18,
      paddingBottom: 12,
      paddingHorizontal: 20,
      borderBottomWidth: 1,
      borderBottomColor: "#ececec",
   },
   icon: {
      marginRight: 10,
   },
   title: {
      fontSize: 32,
      fontWeight: "bold",
      color: "#222",
      letterSpacing: 1,
      fontFamily: Fonts.headingBold, // Poppins-Bold
   },
   dex: {
      fontWeight: "bold",
      fontFamily: Fonts.headingBold, // Poppins-Bold
   },
   accent: {
      color: "#6390F0",
      fontWeight: "bold",
      fontFamily: Fonts.headingSemiBold, // Poppins-SemiBold
   },
   themeToggle: {
      marginLeft: "auto",
      marginRight: 0,
      width: 32,
      height: 32,
      padding: 0,
      alignItems: "center",
      justifyContent: "center",
   },
});
