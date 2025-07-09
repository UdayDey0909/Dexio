import React, { memo, useState, useCallback, useMemo } from "react";
import { getTypeColor, lightenColor } from "@/Theme/Utils/PokeBallBG";
import { CARD_DIMENSIONS } from "../../Constants/Dimensions";
import Pokeball from "@/Assets/SVG/PokeBall";
import { View } from "react-native";
import { Image } from "expo-image";
import { styles } from "./Styles";

interface PokemonCardImageProps {
   id: number;
   image: { uri: string } | number;
   pokeballBGColor: string;
   types: string[];
}

/**
 * Component to render the image of a Pokémon card with a Pokeball background.
 *
 */
const PokemonCardImage: React.FC<PokemonCardImageProps> = ({
   id,
   image,
   types,
}) => {
   const [imageLoaded, setImageLoaded] = useState(false);
   const [hasError, setHasError] = useState(false);

   /**
    * Memoized image source to handle both local and remote images.
    * If the image is a number, it is treated as a local asset ID.
    * If it is an object with a URI, it is treated as a remote image.
    * This allows for flexibility in how images are provided to the component.
    */
   const imageSource = useMemo(() => {
      return typeof image === "number" ? image : image.uri;
   }, [image]);

   /**
    * Memoized colors for the Pokeball based on the Pokémon's types.
    * If types are provided, it uses the first type to determine the colors.
    * If no types are provided, it defaults to neutral colors.
    */
   const pokeballColors = useMemo(() => {
      if (types && types.length > 0) {
         const primaryTypeColor = getTypeColor(types[0]);
         const lightenedColor = lightenColor(primaryTypeColor, 0.15);

         return {
            topColor: lightenedColor,
            bottomColor: lightenedColor,
            middleColor: lightenColor(primaryTypeColor, 0.2),
            bandColor: primaryTypeColor,
         };
      }

      return {
         topColor: "#cccccc",
         bottomColor: "#cccccc",
         middleColor: "#ffffff",
         bandColor: "#999999",
      };
   }, [types]);

   /**
    * Two Callbacks:
    * 1. handleImageLoad: Called when the image loads successfully.
    * 2. handleImageError: Called when there is an error loading the image.
    *
    * These callbacks update the component state to reflect the image loading status.
    */
   const handleImageLoad = useCallback(() => {
      setImageLoaded(true);
      setHasError(false);
   }, []);

   const handleImageError = useCallback(() => {
      setHasError(true);
      setImageLoaded(false);
   }, []);

   /**
    * Fallback image source if the main image fails to load.
    * It uses a local asset from the GitHub repository.
    * This ensures that even if the main image fails, a default image is displayed.
    */
   const fallbackSource = `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${id}.png`;

   return (
      <View style={styles.imageContainerMargin}>
         <View style={styles.imageContainer}>
            {/* Background Pokeball SVG */}
            <View style={styles.backgroundPokeball}>
               <Pokeball
                  size={CARD_DIMENSIONS.pokeballSize}
                  topColor={pokeballColors.topColor}
                  bottomColor={pokeballColors.bottomColor}
                  middleColor={pokeballColors.middleColor}
                  bandColor={pokeballColors.bandColor}
               />
            </View>

            {/* Skeleton placeholder for image loading state 
            //! Add a proper skeleton loading animation later
            */}
            {!imageLoaded && (
               <View style={styles.skeletonPlaceholder}>
                  <View style={styles.skeletonShimmer} />
               </View>
            )}

            {/* Main Pokémon image */}
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

            {/* Fallback image if the main image fails to load */}
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
