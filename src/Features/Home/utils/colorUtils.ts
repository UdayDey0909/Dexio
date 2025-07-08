// utils/colorUtils.ts
import { POKEMON_TYPE_COLORS } from "../Constants/Colors";

/**
 * Get color based on Pokemon type
 * @param type Pokemon type string
 * @returns Color hex code
 */
export const getTypeColor = (type: string): string => {
   return (
      POKEMON_TYPE_COLORS[
         type.toLowerCase() as keyof typeof POKEMON_TYPE_COLORS
      ] || POKEMON_TYPE_COLORS.normal
   );
};

/**
 * Validates a hex color format
 * @param hexColor Color in hex format
 * @returns Boolean indicating if format is valid
 */
const isValidHex = (hexColor: string): boolean => {
   return /^#?[0-9A-Fa-f]{6}$/.test(hexColor);
};

/**
 * Lightens a hex color by a specified percentage
 * @param color Color in hex format
 * @param percent Percentage to lighten (0-100)
 * @returns Lightened color hex code
 */
export const lightenColor = (color: string, percent: number): string => {
   if (!isValidHex(color)) return "#cccccc";

   const num = parseInt(color.replace("#", ""), 16);
   const amt = Math.round(2.55 * percent * 100);
   const R = (num >> 16) + amt;
   const G = ((num >> 8) & 0x00ff) + amt;
   const B = (num & 0x0000ff) + amt;

   return (
      "#" +
      (
         0x1000000 +
         (R < 255 ? (R < 1 ? 0 : R) : 255) * 0x10000 +
         (G < 255 ? (G < 1 ? 0 : G) : 255) * 0x100 +
         (B < 255 ? (B < 1 ? 0 : B) : 255)
      )
         .toString(16)
         .slice(1)
   );
};

/**
 * Darkens a hex color by a specified amount
 * @param hexColor Color in hex format
 * @param amount Amount to darken (0-1)
 * @returns Darkened color hex code
 */
export const darkenColor = (hexColor: string, amount: number = 0.2): string => {
   if (!isValidHex(hexColor)) return "#333333";

   const color = hexColor.replace("#", "");
   let r = parseInt(color.substring(0, 2), 16);
   let g = parseInt(color.substring(2, 4), 16);
   let b = parseInt(color.substring(4, 6), 16);

   r = Math.round(r * (1 - amount));
   g = Math.round(g * (1 - amount));
   b = Math.round(b * (1 - amount));

   const rHex = r.toString(16).padStart(2, "0");
   const gHex = g.toString(16).padStart(2, "0");
   const bHex = b.toString(16).padStart(2, "0");

   return `#${rHex}${gHex}${bHex}`;
};

/**
 * Converts hex color to RGBA format
 * @param hex Color in hex format
 * @param alpha Alpha/opacity value (0-1)
 * @returns RGBA color string
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
 * Checks if a color is light or dark
 * @param hexColor Color in hex format
 * @returns Boolean indicating if color is light (true) or dark (false)
 */
export const isLightColor = (hexColor: string): boolean => {
   if (!isValidHex(hexColor)) return false;

   const color = hexColor.replace("#", "");
   const r = parseInt(color.substring(0, 2), 16);
   const g = parseInt(color.substring(2, 4), 16);
   const b = parseInt(color.substring(4, 6), 16);

   // Calculate perceived brightness using the formula: (R*0.299 + G*0.587 + B*0.114)
   const brightness = r * 0.299 + g * 0.587 + b * 0.114;

   // Return true if brightness is greater than 128 (out of 255)
   return brightness > 128;
};

/**
 * Gets appropriate text color (light/dark) based on background color
 * @param backgroundColor Background color in hex format
 * @returns Text color (light or dark)
 */
export const getTextColorForBackground = (backgroundColor: string): string => {
   const textColors = {
      light: "#ffffff",
      dark: "#000000",
   };

   return isLightColor(backgroundColor) ? textColors.dark : textColors.light;
};

/**
 * Alternative lighten function that matches the original implementation
 * @param hexColor Color in hex format
 * @param amount Amount to lighten (0-1)
 * @returns Lightened color hex code
 */
export const lightenColorAlt = (
   hexColor: string,
   amount: number = 0.6
): string => {
   if (!isValidHex(hexColor)) return "#cccccc";

   const color = hexColor.replace("#", "");
   let r = parseInt(color.substring(0, 2), 16);
   let g = parseInt(color.substring(2, 4), 16);
   let b = parseInt(color.substring(4, 6), 16);

   r = Math.round(r + (255 - r) * amount);
   g = Math.round(g + (255 - g) * amount);
   b = Math.round(b + (255 - b) * amount);

   const rHex = r.toString(16).padStart(2, "0");
   const gHex = g.toString(16).padStart(2, "0");
   const bHex = b.toString(16).padStart(2, "0");

   return `#${rHex}${gHex}${bHex}`;
};
