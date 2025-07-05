// components/PokemonCard.tsx
import React from "react";
import {
   View,
   Text,
   StyleSheet,
   Image,
   Pressable,
   Dimensions,
} from "react-native";
import { PokemonCardData } from "../Types";
import { getTypeColor } from "@/Utils/PokemonTypeColor";

interface PokemonCardProps {
   pokemon: PokemonCardData;
   onPress?: (pokemon: PokemonCardData) => void;
}

const { width } = Dimensions.get("window");
const CARD_WIDTH = (width - 48) / 2;

export const PokemonCard: React.FC<PokemonCardProps> = ({
   pokemon,
   onPress,
}) => {
   const primaryType = pokemon.types[0] || "Normal";
   const cardColor = getTypeColor(primaryType);

   return (
      <Pressable
         style={[styles.card, { backgroundColor: cardColor }]}
         onPress={() => onPress?.(pokemon)}
         android_ripple={{ color: "rgba(255,255,255,0.3)" }}
      >
         <View style={styles.header}>
            <Text style={styles.name}>{pokemon.name}</Text>
            <Text style={styles.id}>
               #{pokemon.id.toString().padStart(3, "0")}
            </Text>
         </View>

         <View style={styles.body}>
            <View style={styles.typesContainer}>
               {pokemon.types.map((type, index) => (
                  <View key={index} style={styles.typeTag}>
                     <Text style={styles.typeText}>{type}</Text>
                  </View>
               ))}
            </View>

            <View style={styles.imageContainer}>
               <Image
                  source={pokemon.image}
                  style={styles.image}
                  resizeMode="contain"
               />
            </View>
         </View>
      </Pressable>
   );
};

const styles = StyleSheet.create({
   card: {
      width: CARD_WIDTH,
      height: 130,
      borderRadius: 12,
      padding: 12,
      marginBottom: 12,
   },
   header: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      marginBottom: 8,
   },
   name: {
      fontSize: 16,
      fontWeight: "bold",
      color: "#fff",
      flex: 1,
   },
   id: {
      fontSize: 14,
      color: "#fff",
      opacity: 0.8,
   },
   body: {
      flex: 1,
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
   },
   typesContainer: {
      flex: 1,
   },
   typeTag: {
      backgroundColor: "rgba(255,255,255,0.3)",
      paddingHorizontal: 8,
      paddingVertical: 4,
      borderRadius: 12,
      marginBottom: 4,
      alignSelf: "flex-start",
   },
   typeText: {
      fontSize: 12,
      color: "#fff",
      fontWeight: "600",
   },
   imageContainer: {
      width: 70,
      height: 70,
      justifyContent: "center",
      alignItems: "center",
   },
   image: {
      width: 60,
      height: 60,
   },
});
