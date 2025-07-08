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
         const lightenedColor = lightenColor(primaryTypeColor, 0.6);
         const veryLightColor = lightenColor(primaryTypeColor, 0.8);
         const mediumColor = lightenColor(primaryTypeColor, 0.4);

         return {
            topColor: hexToRGBA(lightenedColor, 0.8),
            bottomColor: hexToRGBA(lightenedColor, 0.8),
            middleColor: hexToRGBA(veryLightColor, 0.9),
            bandColor: hexToRGBA(mediumColor, 0.7),
         };
      }

      // Default neutral colors if no types
      return {
         topColor: hexToRGBA("#cccccc", 0.8),
         bottomColor: hexToRGBA("#cccccc", 0.8),
         middleColor: hexToRGBA("#ffffff", 0.9),
         bandColor: hexToRGBA("#999999", 0.7),
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

   const fallbackSource = `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${id}.png`;

   return (
      <View style={styles.imageContainerMargin}>
         <View style={styles.imageContainer}>
            {/* Background Pokeball SVG - removed the circle background */}
            <View style={styles.backgroundPokeball}>
               <Pokeball
                  size={CARD_DIMENSIONS.pokeballSize}
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
