// constants/dimensions.ts
import { Dimensions } from "react-native";

const { width } = Dimensions.get("window");

export const CARD_DIMENSIONS = {
   width: (width - 48) / 2,
   height: 130,
   imageSize: 105,
   pokeballSize: 90,
   imageContainerSize: 80,
};

export const TIMING = {
   doublePressDelay: 300,
};
