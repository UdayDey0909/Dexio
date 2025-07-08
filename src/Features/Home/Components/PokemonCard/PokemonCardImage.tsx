import React, { memo, useState, useCallback, useMemo } from "react";
import { View } from "react-native";
import { Image } from "expo-image";
import { CARD_DIMENSIONS } from "../../Constants/Dimensions";
import { styles } from "./Styles";
import Pokeball from "@/Assets/SVG/PokeBall";
import { getTypeColor, lightenColor, hexToRGBA } from "../../Utils/colorUtils";

interface PokemonCardImageProps {
   id: number;
   image: { uri: string } | number;
   pokeballBGColor: string;
   types: string[]; // Add types prop to determine pokeball color
}

const PokemonCardImage: React.FC<PokemonCardImageProps> = ({
   id,
   image,
   pokeballBGColor,
   types,
}) => {
   const [imageLoaded, setImageLoaded] = useState(false);
   const [hasError, setHasError] = useState(false);

   const imageSource = useMemo(() => {
      return typeof image === "number" ? image : image.uri;
   }, [image]);

   // Calculate pokeball colors based on primary type
   const pokeballColors = useMemo(() => {
      if (types && types.length > 0) {
         const primaryTypeColor = getTypeColor(types[0]);
         const lightenedColor = lightenColor(primaryTypeColor, 0.8);
         const veryLightColor = lightenColor(primaryTypeColor, 0.9);

         return {
            topColor: hexToRGBA(lightenedColor, 0.3),
            bottomColor: hexToRGBA(lightenedColor, 0.2),
            middleColor: hexToRGBA(veryLightColor, 0.4),
            bandColor: hexToRGBA(lightenedColor, 0.25),
         };
      }

      // Default neutral colors if no types
      return {
         topColor: hexToRGBA("#cccccc", 0.3),
         bottomColor: hexToRGBA("#cccccc", 0.2),
         middleColor: hexToRGBA("#ffffff", 0.4),
         bandColor: hexToRGBA("#cccccc", 0.25),
      };
   }, [types]);

   const handleImageLoad = useCallback(() => {
      setImageLoaded(true);
      setHasError(false);
   }, []);

   const handleImageError = useCallback(() => {
      setHasError(true);
      setImageLoaded(false);
   }, []);

   const pokeballStyle = useMemo(
      () => [styles.pokeballBackground, { backgroundColor: pokeballBGColor }],
      [pokeballBGColor]
   );

   const fallbackSource = `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${id}.png`;

   return (
      <View style={styles.imageContainerMargin}>
         <View style={styles.imageContainer}>
            {/* Original background circle */}
            <View style={pokeballStyle} />

            {/* Background Pokeball SVG */}
            <View style={styles.backgroundPokeball}>
               <Pokeball
                  size={CARD_DIMENSIONS.pokeballSize * 0.8}
                  topColor={pokeballColors.topColor}
                  bottomColor={pokeballColors.bottomColor}
                  middleColor={pokeballColors.middleColor}
                  bandColor={pokeballColors.bandColor}
               />
            </View>

            {!imageLoaded && (
               <View style={styles.skeletonPlaceholder}>
                  <View style={styles.skeletonShimmer} />
               </View>
            )}

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
   );
};

export default memo(PokemonCardImage);
