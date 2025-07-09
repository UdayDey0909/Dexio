import React, { useCallback, useRef, useMemo, memo } from "react";
import { getTypeColor, lightenColor } from "@/Theme/Utils/PokeBallBG";
import { TIMING } from "../../Constants/Dimensions";
import PokemonCardHeader from "./PokemonCardHeader";
import PokemonCardImage from "./PokemonCardImage";
import PokemonCardTypes from "./PokemonCardTypes";
import { PokemonCardProps } from "../../Types";
import { Pressable, View } from "react-native";
import { styles } from "./Styles";

const PokemonCard: React.FC<PokemonCardProps> = ({
   name,
   id,
   image,
   types,
   onPress,
}) => {
   /**
    * Determine the card background color and pokeball background color
    * based on the primary type of the Pokémon.
    * If no types are provided, default to light grey.
    */
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

   /*
    * Use a ref to track the last press time for double-tap detection
    * This prevents the need for state updates and re-renders on every press
    * It allows us to handle double-tap detection efficiently.
    */
   const lastPressRef = useRef(0);
   const handlePress = useCallback(() => {
      const currentTime = Date.now();
      if (currentTime - lastPressRef.current > TIMING.doublePressDelay) {
         lastPressRef.current = currentTime;
         onPress?.();
      }
   }, [onPress]);

   /**
    * Memoize the card style to avoid unnecessary recalculations
    * This ensures that the style is only recalculated when the
    * cardBackgroundColor changes, improving performance.
    */
   const cardStyle = useMemo(
      () => [styles.cardContainer, { backgroundColor: cardBackgroundColor }],
      [cardBackgroundColor]
   );

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
         {/* Render the PokemonCardHeader component */}
         <PokemonCardHeader name={name} id={id} />

         {/* Render the card body with types and image */}
         <View style={styles.cardBody}>
            <PokemonCardTypes types={types} />
            <PokemonCardImage
               id={id}
               image={image}
               pokeballBGColor={pokeballBGColor}
               types={types} // Pass types to PokemonCardImage
            />
         </View>
      </Pressable>
   );
};

/**
 * Memoize the PokemonCard component to prevent unnecessary re-renders
 */
export default memo(PokemonCard, (prevProps, nextProps) => {
   return (
      prevProps.id === nextProps.id &&
      prevProps.name === nextProps.name &&
      prevProps.types.length === nextProps.types.length &&
      prevProps.types.every((type, index) => type === nextProps.types[index])
   );
});
