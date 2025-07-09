import React from "react";
import { View, Text, StyleSheet, Platform, Dimensions } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { COLORS } from "../../Constants/Colors";

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
      backgroundColor: COLORS.background,
   },
   header: {
      backgroundColor: COLORS.background,
      paddingTop: paddingTop,
      paddingBottom: paddingBottom,
      paddingHorizontal: 16,
      alignItems: "center",
   },
   title: {
      fontSize: 42,
      fontWeight: "bold",
      color: COLORS.text.light,
      textAlign: "center",
   },
});

export default AppHeader;
