import React from "react";
import { View, Text, StyleSheet, Platform, Dimensions } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { COLORS } from "../../Constants/Colors";

interface AppHeaderProps {
   title: string;
}

// Get screen height for responsive padding
const { height: screenHeight } = Dimensions.get("window");
const verticalPadding = screenHeight < 700 ? 12 : 20;

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
      paddingVertical: verticalPadding,
      paddingHorizontal: 16,
      alignItems: "center",
   },
   title: {
      fontSize: 28,
      fontWeight: "bold",
      color: COLORS.text.light,
      textAlign: "center",
   },
});

export default AppHeader;
