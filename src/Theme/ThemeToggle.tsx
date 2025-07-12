import React from "react";
import { TouchableOpacity, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useTheme, ThemeMode } from "./ThemeContext";

interface ThemeToggleProps {
   style?: any;
}

export const ThemeToggle: React.FC<ThemeToggleProps> = ({ style }) => {
   const { themeMode, setThemeMode, isDark } = useTheme();

   const getThemeIcon = () => {
      switch (themeMode) {
         case "light":
            return "sunny";
         case "dark":
            return "moon";
         default:
            return "sunny";
      }
   };

   const cycleTheme = () => {
      const themes: ThemeMode[] = ["light", "dark"];
      const currentIndex = themes.indexOf(themeMode);
      const nextIndex = (currentIndex + 1) % themes.length;
      setThemeMode(themes[nextIndex]);
   };

   return (
      <TouchableOpacity
         style={[styles.container, style]}
         onPress={cycleTheme}
         accessibilityRole="button"
         accessibilityLabel={`Current theme: ${themeMode}. Tap to change theme.`}
      >
         <Ionicons
            name={getThemeIcon() as any}
            size={22}
            color={isDark ? "#FFFFFF" : "#1F2937"}
         />
      </TouchableOpacity>
   );
};

const styles = StyleSheet.create({
   container: {
      alignItems: "center",
      justifyContent: "center",
      padding: 10,
      borderRadius: 20,
      backgroundColor: "rgba(0, 0, 0, 0.05)",
      borderWidth: 1,
      borderColor: "rgba(0, 0, 0, 0.1)",
      width: 40,
      height: 40,
   },
});
