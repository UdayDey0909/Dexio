import { baseColors } from "../Core/Index";

/**
 * Get the color associated with a Pokémon type.
 * Falls back to mediumGray if the type is not found.
 *
 * @param type - A Pokémon type (e.g., "fire", "water")
 * @returns The hex color string for the type
 */
export const getTypeColor = (
   type: keyof typeof baseColors.types | string
): string => {
   // Normalize input to lowercase and get type color from baseColors
   const normalizedType = type.toLowerCase() as keyof typeof baseColors.types;
   return baseColors.types[normalizedType] || baseColors.mediumGray;
};

/**
 * Checks if a string is a valid 6-digit hex color code (with or without '#').
 *
 * @param hexColor - The color string to validate
 * @returns true if valid hex, false otherwise
 */
export const isValidHex = (hexColor: string): boolean => {
   return /^#?[0-9A-Fa-f]{6}$/.test(hexColor);
};

/**
 * Lightens a given hex color by blending it toward white.
 *
 * @param hexColor - The base hex color
 * @param amount - How much to lighten (default is 0.6)
 * @returns The lightened hex color
 */
export const lightenColor = (
   hexColor: string,
   amount: number = 0.6
): string => {
   if (!isValidHex(hexColor)) return "#CCCCCC";

   // Remove '#' if present
   hexColor = hexColor.replace("#", "");

   // Extract R, G, B values
   let r = parseInt(hexColor.substring(0, 2), 16);
   let g = parseInt(hexColor.substring(2, 4), 16);
   let b = parseInt(hexColor.substring(4, 6), 16);

   // Blend each channel toward white (255)
   r = Math.round(r + (255 - r) * amount);
   g = Math.round(g + (255 - g) * amount);
   b = Math.round(b + (255 - b) * amount);

   // Convert back to hex and return the final color
   const rHex = r.toString(16).padStart(2, "0");
   const gHex = g.toString(16).padStart(2, "0");
   const bHex = b.toString(16).padStart(2, "0");

   return `#${rHex}${gHex}${bHex}`;
};

/**
 * Darkens a given hex color by blending it toward black.
 *
 * @param hexColor - The base hex color
 * @param amount - How much to darken (default is 0.2)
 * @returns The darkened hex color
 */
export const darkenColor = (hexColor: string, amount: number = 0.2): string => {
   if (!isValidHex(hexColor)) return "#333333";

   hexColor = hexColor.replace("#", "");

   let r = parseInt(hexColor.substring(0, 2), 16);
   let g = parseInt(hexColor.substring(2, 4), 16);
   let b = parseInt(hexColor.substring(4, 6), 16);

   // Multiply each RGB component by (1 - amount) to darken
   r = Math.round(r * (1 - amount));
   g = Math.round(g * (1 - amount));
   b = Math.round(b * (1 - amount));

   const rHex = r.toString(16).padStart(2, "0");
   const gHex = g.toString(16).padStart(2, "0");
   const bHex = b.toString(16).padStart(2, "0");

   return `#${rHex}${gHex}${bHex}`;
};

/**
 * Converts a hex color to rgba string format with given opacity.
 *
 * @param hex - The hex color code
 * @param alpha - Alpha value between 0 and 1
 * @returns The rgba color string
 */
export const hexToRGBA = (hex: string, alpha: number = 1): string => {
   if (!isValidHex(hex)) return "rgba(204, 204, 204, 1)";

   const hexValue = hex.replace("#", "");

   const r = parseInt(hexValue.substring(0, 2), 16);
   const g = parseInt(hexValue.substring(2, 4), 16);
   const b = parseInt(hexValue.substring(4, 6), 16);

   return `rgba(${r}, ${g}, ${b}, ${alpha})`;
};

/**
 * Determines if a hex color is light based on perceived brightness.
 * Uses the standard formula for luminance perception.
 *
 * @param hexColor - The hex color to analyze
 * @returns true if the color is light, false if dark
 */
export const isLightColor = (hexColor: string): boolean => {
   if (!isValidHex(hexColor)) return false;

   hexColor = hexColor.replace("#", "");

   const r = parseInt(hexColor.substring(0, 2), 16);
   const g = parseInt(hexColor.substring(2, 4), 16);
   const b = parseInt(hexColor.substring(4, 6), 16);

   // Calculate brightness based on luminance formula
   const brightness = r * 0.299 + g * 0.587 + b * 0.114;

   return brightness > 128;
};

/**
 * Picks a suitable text color (black or white) for readability
 * depending on the brightness of the background color.
 *
 * @param backgroundColor - The hex color of the background
 * @returns Hex code for black or white text
 */
export const getTextColorForBackground = (backgroundColor: string): string => {
   return isLightColor(backgroundColor) ? baseColors.black : baseColors.white;
};
