// components/PokemonCard.tsx
import React, { useCallback, useRef, useMemo, memo, useState } from "react";
import { View, Text, StyleSheet, Pressable, Platform } from "react-native";
import { Image } from "expo-image";
import { getTypeColor, lightenColor } from "../Utils/ColorUtils";
import { CARD_DIMENSIONS, TIMING } from "../Constants/Dimensions";
import { PokemonCardProps } from "../Types";
import PokemonTypeChip from "./PokemonTypeChip";

const PokemonCard: React.FC<PokemonCardProps> = ({
   name,
   id,
   image,
   types,
   onPress,
}) => {
   // Track image loading state for smooth transitions
   const [imageLoaded, setImageLoaded] = useState(false);
   const [hasError, setHasError] = useState(false);

   // Simplified color calculation - only memoize if types change
   const { cardBackgroundColor, pokeballBGColor } = useMemo(() => {
      if (types && types.length > 0) {
         const baseColor = getTypeColor(types[0]);
         const formattedColor = baseColor.startsWith("#")
            ? baseColor
            : `#${baseColor}`;
         return {
            cardBackgroundColor: baseColor,
            pokeballBGColor: lightenColor(formattedColor, 0.7),
         };
      }
      return {
         cardBackgroundColor: "lightgrey",
         pokeballBGColor: "lightgrey",
      };
   }, [types]);

   // Simplified press handling
   const lastPressRef = useRef(0);
   const handlePress = useCallback(() => {
      const currentTime = Date.now();
      if (currentTime - lastPressRef.current > TIMING.doublePressDelay) {
         lastPressRef.current = currentTime;
         onPress?.();
      }
   }, [onPress]);

   // Memoize type components with simpler key
   const typeComponents = useMemo(() => {
      return types.map((type: string, index: number) => (
         <PokemonTypeChip key={`${type}-${index}`} type={type} />
      ));
   }, [types]);

   // Simplified style memoization
   const cardStyle = useMemo(
      () => [styles.cardContainer, { backgroundColor: cardBackgroundColor }],
      [cardBackgroundColor]
   );

   const pokeballStyle = useMemo(
      () => [styles.pokeballBackground, { backgroundColor: pokeballBGColor }],
      [pokeballBGColor]
   );

   // Optimized image source handling
   const imageSource = useMemo(() => {
      return typeof image === "number" ? image : image.uri;
   }, [image]);

   // Handle image loading states
   const handleImageLoad = useCallback(() => {
      setImageLoaded(true);
      setHasError(false);
   }, []);

   const handleImageError = useCallback(() => {
      setHasError(true);
      setImageLoaded(false);
   }, []);

   // Fallback image source
   const fallbackSource = `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${id}.png`;

   return (
      <Pressable
         style={({ pressed }) => [...cardStyle, pressed && styles.cardPressed]}
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
                  <View style={pokeballStyle} />

                  {/* Skeleton placeholder - always visible until image loads */}
                  {!imageLoaded && (
                     <View style={styles.skeletonPlaceholder}>
                        <View style={styles.skeletonShimmer} />
                     </View>
                  )}

                  {/* Main image */}
                  <Image
                     source={imageSource}
                     style={[
                        styles.image,
                        {
                           opacity: imageLoaded ? 1 : 0,
                        },
                     ]}
                     contentFit="contain"
                     transition={300}
                     cachePolicy="memory-disk"
                     priority="high"
                     recyclingKey={`pokemon-${id}`}
                     onLoad={handleImageLoad}
                     onError={handleImageError}
                  />

                  {/* Fallback image - only if main image fails */}
                  {hasError && !imageLoaded && (
                     <Image
                        source={fallbackSource}
                        style={styles.fallbackImage}
                        contentFit="contain"
                        cachePolicy="memory-disk"
                        transition={200}
                        onLoad={handleImageLoad}
                     />
                  )}
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

// Simplified memo comparison
export default memo(PokemonCard, (prevProps, nextProps) => {
   return (
      prevProps.id === nextProps.id &&
      prevProps.name === nextProps.name &&
      prevProps.types.length === nextProps.types.length &&
      prevProps.types.every((type, index) => type === nextProps.types[index])
   );
});
