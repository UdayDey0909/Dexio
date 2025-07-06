// components/PokemonCard.tsx
import React, { useCallback, useRef, useMemo } from "react";
import {
   View,
   Text,
   StyleSheet,
   Image,
   Pressable,
   Platform,
} from "react-native";
import { getTypeColor, lightenColor } from "../utils/colorUtils";
import { CARD_DIMENSIONS, TIMING } from "../constants/dimensions";
import { PokemonCardProps } from "../types";
import PokemonTypeChip from "./PokemonTypeChip";

const PokemonCard: React.FC<PokemonCardProps> = ({
   name,
   id,
   image,
   types,
   onPress,
}) => {
   const cardBackgroundColor = useMemo(() => {
      if (types && types.length > 0) {
         return getTypeColor(types[0]);
      }
      return "lightgrey";
   }, [types]);

   const pokeballBGColor = useMemo(() => {
      if (types && types.length > 0) {
         const baseColor = getTypeColor(types[0]);
         const formattedColor = baseColor.startsWith("#")
            ? baseColor
            : `#${baseColor}`;
         return lightenColor(formattedColor, 0.7);
      }
      return "lightgrey";
   }, [types]);

   const lastPressRef = useRef(0);
   const handlePress = useCallback(() => {
      const currentTime = new Date().getTime();
      if (currentTime - lastPressRef.current > TIMING.doublePressDelay) {
         lastPressRef.current = currentTime;
         onPress?.();
      }
   }, [onPress]);

   const typeComponents = useMemo(() => {
      return types.map((type: string, index: number) => (
         <PokemonTypeChip key={index} type={type} />
      ));
   }, [types]);

   const imageStyle =
      Platform.OS === "android"
         ? { ...styles.image, overflow: "hidden" as const }
         : styles.image;

   return (
      <Pressable
         style={({ pressed }) => [
            styles.cardContainer,
            { backgroundColor: cardBackgroundColor },
            pressed && styles.cardPressed,
         ]}
         onPress={handlePress}
         android_ripple={{
            color: "rgba(255,255,255,0.3)",
            borderless: false,
            foreground: true,
         }}
         hitSlop={{ top: 5, bottom: 5, left: 5, right: 5 }}
      >
         <View style={styles.cardHeader}>
            <Text style={styles.name} numberOfLines={1} ellipsizeMode="tail">
               {name}
            </Text>
            <Text style={styles.pokedexNumber}>#{id}</Text>
         </View>

         <View style={styles.cardBody}>
            <View style={styles.cardType}>
               <View style={styles.cardTypeAlign}>{typeComponents}</View>
            </View>

            <View style={styles.imageContainerMargin}>
               <View style={styles.imageContainer}>
                  <View
                     style={[
                        styles.pokeballBackground,
                        { backgroundColor: pokeballBGColor },
                     ]}
                  />
                  <Image
                     source={
                        typeof image === "number" ? image : { uri: image.uri }
                     }
                     style={imageStyle}
                     fadeDuration={0}
                     resizeMethod="resize"
                  />
               </View>
            </View>
         </View>
      </Pressable>
   );
};

const styles = StyleSheet.create({
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
   pokeballBackground: {
      position: "absolute",
      width: CARD_DIMENSIONS.pokeballSize,
      height: CARD_DIMENSIONS.pokeballSize,
      borderRadius: CARD_DIMENSIONS.pokeballSize / 2,
      opacity: 0.6,
   },
   image: {
      width: CARD_DIMENSIONS.imageSize,
      height: CARD_DIMENSIONS.imageSize,
      resizeMode: "contain",
      zIndex: 1,
   },
});

export default PokemonCard;
