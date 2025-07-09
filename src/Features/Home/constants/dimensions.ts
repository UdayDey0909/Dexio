import { Dimensions } from "react-native";

/**
 * Dimensions for the Pokémon card.
 * These dimensions are calculated based on the device's window width.
 */
const { width } = Dimensions.get("window");

/**
 * Constants for Pokémon card dimensions and timing.
 * These constants are used to define the size of the Pokémon card,
 * the image, and the Pokéball background.
 */
export const CARD_DIMENSIONS = {
   width: (width - 48) / 2,
   height: 130,
   imageSize: 105,
   pokeballSize: 90,
   imageContainerSize: 80,
};

/**
 * Timing constants used in the application.
 * These constants define various timing-related values,
 * such as delays for double-tap detection.
 */
export const TIMING = {
   doublePressDelay: 300,
};
