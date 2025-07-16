import { StyleSheet } from "react-native";
import { Fonts } from "@/Theme/Fonts";

const styles = StyleSheet.create({
   container: {
      flex: 1,
      paddingHorizontal: 20,
   },
   nameNumberRow: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      marginBottom: 8,
   },
   nameText: {
      fontSize: 26,
      fontWeight: "bold",
      color: "#388e3c",
      textTransform: "capitalize",
      textAlign: "left",
   },
   numberText: {
      fontSize: 18,
      color: "#333",
      fontWeight: "bold",
      opacity: 0.7,
      marginRight: 12,
      marginBottom: 2,
   },
   description: {
      fontSize: 16,
      marginBottom: 24,
      textAlign: "left",
      lineHeight: 24,
      marginHorizontal: 0,
      fontFamily: Fonts.primaryRegular, // Roboto-Regular
   },
   mainRow: {
      flexDirection: "row",
      marginBottom: 32,
      gap: 12,
      position: "relative",
      borderRightWidth: 0,
   },
   leftCol: {
      flex: 7.5,
      borderRightWidth: 1,
      borderRightColor: "transparent",
      paddingRight: 8,
   },
   rightCol: {
      flex: 3.5,
      marginLeft: 4,
      justifyContent: "flex-start",
   },
   sectionHeader: {
      fontSize: 15,
      fontWeight: "800",
      letterSpacing: 1.5,
      marginBottom: 8, // was 12
      textTransform: "uppercase",
      marginTop: 6, // was 8
      fontFamily: Fonts.headingSemiBold, // Poppins-SemiBold
   },
   statRow: {
      flexDirection: "row",
      alignItems: "center",
      marginBottom: 14,
   },
   statLabel: {
      width: 48,
      fontSize: 13,
      fontWeight: "bold",
      marginRight: 0,
      fontFamily: Fonts.primaryMedium, // Roboto-Medium
   },
   statBarBg: {
      flex: 1,
      height: 14, // taller bar
      borderRadius: 8,
      marginLeft: 0,
      overflow: "hidden",
      marginRight: 0,
   },
   statBar: {
      height: "100%",
      borderRadius: 8,
      position: "absolute",
      left: 0,
      top: 0,
   },
   statValue: {
      width: 32,
      fontSize: 13,
      fontWeight: "bold",
      textAlign: "right",
      marginLeft: 2,
      fontFamily: Fonts.primaryMedium, // Roboto-Medium
   },
   typeChip: {
      flexDirection: "row",
      alignItems: "center",
      marginRight: 0,
      marginBottom: 0,
   },
   typeRow: {
      flexDirection: "row",
      alignItems: "center",
      marginBottom: 8,
   },
   typeIconCircle: {
      width: 28,
      height: 28,
      borderRadius: 14,
      alignItems: "center",
      justifyContent: "center",
      marginRight: 8,
   },
   typeText: {
      fontWeight: "bold",
      fontSize: 14,
   },
   pokemonIdOld: {
      fontSize: 16,
      color: "#888",
      fontWeight: "bold",
      marginBottom: 8,
      marginLeft: 2,
   },
   categoryText: {
      fontWeight: "bold",
      marginBottom: 8,
      fontFamily: Fonts.primaryMedium, // Roboto-Medium
   },
   infoBlock: {
      flexDirection: "row",
      alignItems: "center",
      marginBottom: 0,
   },
   infoBlockColumn: {
      flexDirection: "column",
      alignItems: "flex-start",
      marginBottom: 10,
   },
   infoLabel: {
      fontSize: 13,
      color: "#388e3c",
      fontWeight: "700",
      marginBottom: 4,
      marginLeft: 2,
      letterSpacing: 1,
      textTransform: "uppercase",
      fontFamily: Fonts.primaryMedium, // Roboto-Medium
   },
   infoValue: {
      fontSize: 15,
      fontWeight: "bold",
      fontFamily: Fonts.primaryRegular, // Roboto-Regular
   },
   weaknessRow: {
      flexDirection: "row",
      flexWrap: "wrap",
      alignItems: "center",
      marginTop: 8,
      marginBottom: 16,
      gap: 2, // further decrease spacing between weakness chips
   },
   weaknessChip: {
      flexDirection: "row",
      alignItems: "center",
      borderRadius: 16,
      paddingHorizontal: 14,
      paddingVertical: 5,
      marginRight: 4,
      marginBottom: 4,
      backgroundColor: "#eee",
   },
   weaknessText: {
      color: "#fff",
      fontWeight: "bold",
      fontSize: 14,
      letterSpacing: 1,
      marginRight: 2,
      fontFamily: Fonts.primaryMedium, // Roboto-Medium
   },
   weaknessMult: {
      color: "#fff",
      fontWeight: "bold",
      fontSize: 13,
      marginLeft: 2,
      fontFamily: Fonts.primaryMedium, // Roboto-Medium
   },
   weaknessNone: {
      fontStyle: "italic",
      fontFamily: Fonts.primaryRegular, // Roboto-Regular
   },
   idAbsoluteWrapper: {
      position: "absolute",
      right: 20,
      top: 12,
      zIndex: 20,
      pointerEvents: "none",
      width: 80,
      alignItems: "flex-end",
   },
   pokemonIdTop: {
      fontSize: 17,
      color: "#888",
      fontWeight: "600",
      opacity: 0.92,
      paddingHorizontal: 0,
      paddingVertical: 0,
      borderRadius: 0,
      shadowColor: undefined,
      shadowOffset: undefined,
      shadowOpacity: undefined,
      shadowRadius: undefined,
      elevation: undefined,
   },
   abilitiesRow: {
      flexDirection: "row",
      flexWrap: "wrap",
      gap: 2,
      marginTop: 4,
      marginBottom: 0,
      alignItems: "flex-start",
   },
   abilityPill: {
      flexDirection: "row",
      alignItems: "center",
      borderRadius: 20,
      paddingHorizontal: 18,
      paddingVertical: 7,
      borderWidth: 2,
      marginRight: 2,
      minWidth: 80,
      justifyContent: "center",
   },
   abilityPillNormal: {
      borderColor: "#90caf9",
      backgroundColor: "#f8fbff",
   },
   abilityPillHidden: {
      borderColor: "#ef9a9a",
      backgroundColor: "#fff6f6",
   },
   abilityText: {
      fontWeight: "bold",
      fontSize: 16,
      textTransform: "capitalize",
      fontFamily: Fonts.primaryMedium, // Roboto-Medium
   },
   abilityTextNormal: {
      color: "#1976d2",
   },
   abilityTextHidden: {
      color: "#b71c1c",
   },
   weaknessesHeader: {
      marginTop: 2,
   },
});

export default styles;
