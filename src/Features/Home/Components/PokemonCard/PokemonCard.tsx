import React, { useCallback, useRef, useMemo, memo } from "react";
import { Pressable, View } from "react-native";
import { styles } from "./Styles";
import { PokemonCardProps } from "../../Types";
import PokemonCardImage from "./PokemonCardImage";
import PokemonCardTypes from "./PokemonCardTypes";
import { TIMING } from "../../Constants/Dimensions";
import PokemonCardHeader from "./PokemonCardHeader";
import { getTypeColor, lightenColor } from "../../Utils/colorUtils";

const PokemonCard: React.FC<PokemonCardProps> = ({
   name,
   id,
   image,
   types,
   onPress,
}) => {
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

   const lastPressRef = useRef(0);
   const handlePress = useCallback(() => {
      const currentTime = Date.now();
      if (currentTime - lastPressRef.current > TIMING.doublePressDelay) {
         lastPressRef.current = currentTime;
         onPress?.();
      }
   }, [onPress]);

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
         <PokemonCardHeader name={name} id={id} />

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

export default memo(PokemonCard, (prevProps, nextProps) => {
   return (
      prevProps.id === nextProps.id &&
      prevProps.name === nextProps.name &&
      prevProps.types.length === nextProps.types.length &&
      prevProps.types.every((type, index) => type === nextProps.types[index])
   );
});
