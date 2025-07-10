import React from "react";
import { View, Text, StyleSheet, Platform, Dimensions } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { lightThemeColors } from "@/Theme/Core/Variants";
import { Fonts } from "@/Theme/Fonts";

interface AppHeaderProps {
   title: string;
}

/**
 * Dimensions and padding adjustments for the header based on screen height.
 * This ensures the header looks good on both small and large screens.
 */
const { height: screenHeight } = Dimensions.get("window");
const paddingTop = screenHeight < 700 ? 12 : 16;
const paddingBottom = screenHeight < 700 ? 12 : 0;

/**
 * AppHeader component to display the application title.
 */
const AppHeader: React.FC<AppHeaderProps> = ({ title }) => {
   return (
      <SafeAreaView style={styles.safeArea}>
         <View style={styles.header}>
            <Text style={styles.title}>{title}</Text>
         </View>
      </SafeAreaView>
   );
};

const styles = StyleSheet.create({
   safeArea: {
      backgroundColor: lightThemeColors.background.primary,
   },
   header: {
      backgroundColor: lightThemeColors.background.primary,
      paddingTop: paddingTop,
      paddingBottom: paddingBottom,
      paddingHorizontal: 16,
      alignItems: "center",
   },
   title: {
      fontSize: 42,
      fontFamily: Fonts.headingBold,
      color: lightThemeColors.text.primary,
      textAlign: "center",
   },
});

export default AppHeader;
