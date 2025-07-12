import React from "react";
import { View, Text, StyleSheet, Image, TouchableOpacity } from "react-native";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { usePokemonTypeColors } from "../Hooks/usePokemonDetail";
import type { Pokemon } from "pokenode-ts";
import Pokeball from "@/Assets/SVG/PokeBall";
import { getPokeballColors } from "@/Theme/Utils/PokeBallBG";
import { Animated, Easing } from "react-native";
import { useTheme } from "@/Theme/ThemeContext";

interface PokemonDetailHeaderProps {
   pokemon: Pokemon;
   backgroundColor: string;
   currentSprite: string;
   isShiny: boolean;
   hasShinySprite: boolean;
   onToggleShiny: () => void;
}

export const PokemonDetailHeader: React.FC<PokemonDetailHeaderProps> = ({
   pokemon,
   backgroundColor,
   currentSprite,
   isShiny,
   hasShinySprite,
   onToggleShiny,
}) => {
   const router = useRouter();
   const { getTypeColor: getTypeColorHook } = usePokemonTypeColors();
   const { theme, isDark } = useTheme();

   // Animated Pokéball - Continuous infinite rotation
   const spinAnim = React.useRef(new Animated.Value(0)).current;

   React.useEffect(() => {
      const animation = Animated.loop(
         Animated.timing(spinAnim, {
            toValue: 1,
            duration: 6000,
            easing: Easing.linear,
            useNativeDriver: true,
         }),
         {
            iterations: -1, // Infinite iterations
            resetBeforeIteration: true, // Reset to start before each iteration
         }
      );

      animation.start();

      return () => {
         animation.stop();
      };
   }, [spinAnim]);

   const spin = spinAnim.interpolate({
      inputRange: [0, 1],
      outputRange: ["0deg", "360deg"],
   });

   // Pokéball color setup using the new dual-type logic
   const pokeballColors = getPokeballColors(
      pokemon.types.map((type) => type.type.name)
   );

   const [pressed, setPressed] = React.useState(false);
   const scaleAnim = React.useRef(new Animated.Value(1)).current;

   const handlePressIn = () => {
      setPressed(true);
      Animated.spring(scaleAnim, {
         toValue: 1.15,
         useNativeDriver: true,
      }).start();
   };
   const handlePressOut = () => {
      setPressed(false);
      Animated.spring(scaleAnim, {
         toValue: 1,
         friction: 4,
         useNativeDriver: true,
      }).start();
      onToggleShiny();
   };

   return (
      <View style={[styles.headerContainer, { backgroundColor }]}>
         {/* Navigation Header */}
         <View style={styles.header}>
            <TouchableOpacity
               style={styles.backButton}
               onPress={() => router.back()}
            >
               <Ionicons name="arrow-back" size={24} color="#fff" />
            </TouchableOpacity>
            <View style={{ flex: 1 }} />
         </View>
         {/* Pokemon Image with Animated Pokéball */}
         <View style={styles.imageContainer}>
            <Animated.View
               style={[
                  styles.pokeballBg,
                  {
                     transform: [{ rotate: spin }],
                     position: "absolute",
                     left: "50%",
                     top: "50%",
                     marginLeft: -140,
                     marginTop: -140,
                     zIndex: 0,
                  },
               ]}
               pointerEvents="none"
            >
               <Pokeball
                  size={280}
                  topColor={pokeballColors.topColor}
                  bandColor={pokeballColors.bandColor}
                  middleColor={pokeballColors.middleColor}
                  bottomColor={pokeballColors.bottomColor}
               />
            </Animated.View>
            <Image
               source={{ uri: currentSprite }}
               style={styles.pokemonImage}
               resizeMode="contain"
            />
            {/* Shiny button */}
            {hasShinySprite && (
               <Animated.View
                  style={[
                     styles.shinyButtonMinimal,
                     isShiny
                        ? {
                             backgroundColor: "rgba(255,215,0,0.18)",
                             borderColor: "#FFD700",
                          }
                        : {
                             backgroundColor: isDark
                                ? "rgba(255,255,255,0.10)"
                                : "rgba(0,0,0,0.10)",
                             borderColor: isDark
                                ? "rgba(255,255,255,0.18)"
                                : "rgba(0,0,0,0.12)",
                          },
                     { transform: [{ scale: scaleAnim }] },
                  ]}
               >
                  <TouchableOpacity
                     activeOpacity={0.85}
                     onPressIn={handlePressIn}
                     onPressOut={handlePressOut}
                     accessibilityRole="button"
                     accessibilityLabel={
                        isShiny
                           ? "Show normal Pokémon sprite"
                           : "Show shiny Pokémon sprite"
                     }
                     style={{
                        borderRadius: 20,
                        overflow: "hidden",
                        width: 40,
                        height: 40,
                        alignItems: "center",
                        justifyContent: "center",
                     }}
                  >
                     <Ionicons
                        name={isShiny ? "sparkles" : "sparkles-outline"}
                        size={22}
                        color={isShiny ? "#C28800" : isDark ? "#fff" : "#222"}
                        style={{}}
                     />
                  </TouchableOpacity>
               </Animated.View>
            )}
         </View>
      </View>
   );
};

const styles = StyleSheet.create({
   headerContainer: {
      paddingBottom: 20,
   },
   header: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      paddingHorizontal: 20,
      paddingVertical: 15,
   },
   backButton: {
      position: "absolute",
      left: 20,
      top: 40,
      padding: 5,
   },
   idContainer: {
      alignItems: "center",
      justifyContent: "center",
   },
   pokemonId: {
      fontSize: 20,
      fontWeight: "700",
      color: "rgba(255, 255, 255, 0.9)",
      letterSpacing: 1,
      textShadowColor: "rgba(0, 0, 0, 0.3)",
      textShadowOffset: { width: 0, height: 1 },
      textShadowRadius: 2,
   },
   headerInfo: {
      flex: 1,
      alignItems: "center",
   },
   nameSection: {
      alignItems: "center",
      marginBottom: 15,
   },
   nameContainer: {
      paddingHorizontal: 20,
      paddingVertical: 8,
      borderRadius: 20,
      // Add subtle shadow for depth
      shadowColor: "#000",
      shadowOffset: {
         width: 0,
         height: 2,
      },
      shadowOpacity: 0.1,
      shadowRadius: 3.84,
      elevation: 5,
   },
   pokemonName: {
      fontSize: 24,
      fontWeight: "bold",
      color: "#fff",
      textTransform: "capitalize",
   },
   pokemonIdOld: {
      fontSize: 16,
      color: "rgba(255, 255, 255, 0.8)",
   },
   shinyButton: {
      padding: 5,
   },
   shinyButtonTop: {
      position: "absolute",
      right: 24,
      top: 18,
      zIndex: 20,
      backgroundColor: "rgba(0,0,0,0.12)",
      borderRadius: 18,
      padding: 4,
   },
   shinyButtonBottom: {
      position: "absolute",
      right: 32,
      bottom: 8,
      zIndex: 20,
      backgroundColor: "rgba(0,0,0,0.18)",
      borderRadius: 20,
      padding: 6,
   },
   imageContainer: {
      alignItems: "center",
      paddingBottom: 8,
      justifyContent: "center",
      position: "relative",
   },
   pokeballBg: {
      width: 280,
      height: 280,
      alignItems: "center",
      justifyContent: "center",
   },
   pokemonImage: {
      width: 300,
      height: 300,
      zIndex: 1,
   },
   typesContainer: {
      flexDirection: "row",
      justifyContent: "center",
      paddingHorizontal: 20,
   },
   typeChip: {
      paddingHorizontal: 16,
      paddingVertical: 8,
      borderRadius: 20,
      marginHorizontal: 5,
   },
   typeText: {
      color: "#fff",
      fontSize: 14,
      fontWeight: "bold",
      textTransform: "capitalize",
   },
   shinyButtonEnhanced: {
      position: "absolute",
      right: 24,
      bottom: 12,
      zIndex: 20,
      borderRadius: 24,
      shadowColor: "#FFD700",
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.25,
      shadowRadius: 8,
      elevation: 8,
   },
   shinyButtonGradient: {
      width: 48,
      height: 48,
      borderRadius: 24,
      alignItems: "center",
      justifyContent: "center",
   },
   shinyButtonMinimal: {
      position: "absolute",
      right: 24,
      bottom: 14,
      zIndex: 20,
      borderRadius: 20,
      borderWidth: 1,
      width: 40,
      height: 40,
      alignItems: "center",
      justifyContent: "center",
   },
});
