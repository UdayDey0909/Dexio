import { StyleSheet } from "react-native";
import { lightThemeColors } from "@/Theme/Core/Variants";

export const styles = StyleSheet.create({
   container: {
      flex: 1,
      backgroundColor: lightThemeColors.background.primary,
   },
   cardWrapper: {
      flex: 1,
      maxWidth: "50%",
      paddingHorizontal: 4,
      paddingVertical: 6,
   },
   contentContainer: {
      paddingTop: 20,
      paddingHorizontal: 12,
      paddingBottom: 20,
   },
   footerContainer: {
      paddingVertical: 10,
      paddingHorizontal: 12,
      backgroundColor: lightThemeColors.background.primary,
   },
});
