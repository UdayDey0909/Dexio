import React, { memo, useState, useCallback, useMemo } from "react";
import { View } from "react-native";
import { Image } from "expo-image";
import { CARD_DIMENSIONS } from "../../Constants/Dimensions";
import { styles } from "./Styles";

interface PokemonCardImageProps {
   id: number;
   image: { uri: string } | number;
   pokeballBGColor: string;
}

const PokemonCardImage: React.FC<PokemonCardImageProps> = ({
   id,
   image,
   pokeballBGColor,
}) => {
   const [imageLoaded, setImageLoaded] = useState(false);
   const [hasError, setHasError] = useState(false);

   const imageSource = useMemo(() => {
      return typeof image === "number" ? image : image.uri;
   }, [image]);

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
            <View style={pokeballStyle} />

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
