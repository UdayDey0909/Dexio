import { StyleSheet, Platform } from "react-native";
import { CARD_DIMENSIONS } from "../../Constants/Dimensions";

export const styles = StyleSheet.create({
   cardContainer: {
      padding: 8,
      borderRadius: 12,
      width: CARD_DIMENSIONS.width,
      height: CARD_DIMENSIONS.height,
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
   cardPressed: {
      opacity: 0.8,
      transform: [{ scale: 0.98 }],
   },
   cardHeader: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      marginBottom: 4,
   },
   name: {
      fontSize: 18,
      fontWeight: "bold",
      color: "#fff",
      textShadowColor: "rgba(0, 0, 0, 0.75)",
      textShadowOffset: { width: 1, height: 1 },
      textShadowRadius: 2,
      flex: 1,
      includeFontPadding: false,
   },
   pokedexNumber: {
      fontSize: 16,
      fontWeight: "400",
      color: "#fff",
      textShadowColor: "rgba(0, 0, 0, 0.75)",
      textShadowOffset: { width: 0.7, height: 0.7 },
      textShadowRadius: 1,
      includeFontPadding: false,
   },
   cardBody: {
      flex: 1,
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
   },
   cardType: {
      flexDirection: "row",
      alignItems: "center",
   },
   cardTypeAlign: {
      flexDirection: "column",
   },
   imageContainerMargin: {
      marginLeft: "auto",
   },
   imageContainer: {
      position: "relative",
      width: CARD_DIMENSIONS.imageContainerSize,
      height: CARD_DIMENSIONS.imageContainerSize,
      justifyContent: "center",
      alignItems: "center",
   },
   // Removed the pokeballBackground style - no longer needed

   // Enhanced background pokeball SVG styling
   backgroundPokeball: {
      position: "absolute",
      width: CARD_DIMENSIONS.pokeballSize,
      height: CARD_DIMENSIONS.pokeballSize,
      justifyContent: "center",
      alignItems: "center",
      zIndex: 0,
   },
   image: {
      width: CARD_DIMENSIONS.imageSize,
      height: CARD_DIMENSIONS.imageSize,
      zIndex: 2,
      position: "absolute",
   },
   skeletonPlaceholder: {
      width: CARD_DIMENSIONS.imageSize,
      height: CARD_DIMENSIONS.imageSize,
      backgroundColor: "rgba(255, 255, 255, 0.1)",
      borderRadius: 8,
      zIndex: 1,
      position: "absolute",
      justifyContent: "center",
      alignItems: "center",
      overflow: "hidden",
   },
   skeletonShimmer: {
      width: "60%",
      height: "60%",
      backgroundColor: "rgba(255, 255, 255, 0.2)",
      borderRadius: 50,
   },
   fallbackImage: {
      width: CARD_DIMENSIONS.imageSize * 0.8,
      height: CARD_DIMENSIONS.imageSize * 0.8,
      zIndex: 2,
      position: "absolute",
   },
});
