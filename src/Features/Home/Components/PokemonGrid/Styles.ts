import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
   container: {
      flex: 1,
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
      paddingVertical: 16,
      paddingHorizontal: 20,
   },
   footerContent: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "center",
      gap: 12,
   },
   footerText: {
      marginTop: 16,
      fontSize: 14,
      fontFamily: "Roboto-Regular",
   },
});
