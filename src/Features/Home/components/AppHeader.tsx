// components/AppHeader.tsx
import React from "react";
import { View, Text, StyleSheet, Platform } from "react-native";
import { COLORS } from "../Constants/Colors";

interface AppHeaderProps {
   title: string;
}

const AppHeader: React.FC<AppHeaderProps> = ({ title }) => {
   return (
      <View style={styles.header}>
         <Text style={styles.title}>{title}</Text>
      </View>
   );
};

const styles = StyleSheet.create({
   header: {
      backgroundColor: COLORS.background,
      paddingVertical: 20,
      paddingHorizontal: 16,
      alignItems: "center",
      ...Platform.select({
         ios: {
            shadowColor: "#000",
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.25,
            shadowRadius: 3.84,
         },
         android: {
            elevation: 5,
         },
      }),
   },
   title: {
      fontSize: 28,
      fontWeight: "bold",
      color: COLORS.text.light,
      textAlign: "center",
   },
});

export default AppHeader;
