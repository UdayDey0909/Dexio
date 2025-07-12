import { CARD_DIMENSIONS } from "../../Constants/Dimensions";
import { StyleSheet, Platform } from "react-native";
import { Fonts } from "@/Theme/Fonts";
import { baseColors } from "@/Theme/Core/Colors";

export const styles = StyleSheet.create({
   //* ----- PokemonCard ----- */

   //? ----- Card Container ----- */
   cardContainer: {
      paddingTop: 8,
      paddingLeft: 6,
      paddingRight: 8,
      paddingBottom: 4,
      borderRadius: 12,
      overflow: "hidden",
      width: CARD_DIMENSIONS.width,
      height: CARD_DIMENSIONS.height,
      ...Platform.select({
         ios: {
            shadowColor: baseColors.black,
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.25,
            shadowRadius: 3.84,
         },
         android: {
            elevation: 5,
         },
      }),
   },
   //? ----- Card Pressed State ----- */
   cardPressed: {
      opacity: 0.8,
      transform: [{ scale: 0.98 }],
   },

   //* ----- PokemonCardHeader ----- */

   //? ----- Card Header (Name and ID) ----- */
   cardHeader: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      marginBottom: 4,
   },
   name: {
      fontSize: 18,
      fontFamily: Fonts.headingSemiBold, // Poppins-SemiBold
      color: baseColors.white,
      textShadowColor: "rgba(0, 0, 0, 0.75)",
      textShadowOffset: { width: 1, height: 1 },
      textShadowRadius: 2,
      flex: 1,
      includeFontPadding: false,
   },
   pokedexNumber: {
      fontSize: 16,
      fontFamily: Fonts.primaryMedium, // Roboto-Medium
      color: baseColors.white,
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
   backgroundPokeball: {
      position: "absolute",
      width: CARD_DIMENSIONS.pokeballSize,
      height: CARD_DIMENSIONS.pokeballSize,
      justifyContent: "center",
      alignItems: "center",
      zIndex: 0,
      transform: [{ rotate: "-30deg" }],
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
      backgroundColor: `${baseColors.white}1A`,
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
      backgroundColor: `${baseColors.white}33`,
      borderRadius: 50,
   },
   fallbackImage: {
      width: CARD_DIMENSIONS.imageSize * 0.8,
      height: CARD_DIMENSIONS.imageSize * 0.8,
      zIndex: 2,
      position: "absolute",
   },
});
