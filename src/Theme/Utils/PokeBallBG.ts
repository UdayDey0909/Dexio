import { baseColors } from "../Core/Index";

export const getTypeColor = (
   type: keyof typeof baseColors.types | string
): string => {
   const normalizedType = type.toLowerCase() as keyof typeof baseColors.types;
   return baseColors.types[normalizedType] || baseColors.mediumGray;
};

export const isValidHex = (hexColor: string): boolean => {
   return /^#?[0-9A-Fa-f]{6}$/.test(hexColor);
};

export const lightenColor = (
   hexColor: string,
   amount: number = 0.6
): string => {
   if (!isValidHex(hexColor)) return "#cccccc";

   hexColor = hexColor.replace("#", "");
   let r = parseInt(hexColor.substring(0, 2), 16);
   let g = parseInt(hexColor.substring(2, 4), 16);
   let b = parseInt(hexColor.substring(4, 6), 16);

   r = Math.round(r + (255 - r) * amount);
   g = Math.round(g + (255 - g) * amount);
   b = Math.round(b + (255 - b) * amount);

   const rHex = r.toString(16).padStart(2, "0");
   const gHex = g.toString(16).padStart(2, "0");
   const bHex = b.toString(16).padStart(2, "0");

   return `#${rHex}${gHex}${bHex}`;
};

export const darkenColor = (hexColor: string, amount: number = 0.2): string => {
   if (!isValidHex(hexColor)) return "#333333";

   hexColor = hexColor.replace("#", "");
   let r = parseInt(hexColor.substring(0, 2), 16);
   let g = parseInt(hexColor.substring(2, 4), 16);
   let b = parseInt(hexColor.substring(4, 6), 16);

   r = Math.round(r * (1 - amount));
   g = Math.round(g * (1 - amount));
   b = Math.round(b * (1 - amount));

   const rHex = r.toString(16).padStart(2, "0");
   const gHex = g.toString(16).padStart(2, "0");
   const bHex = b.toString(16).padStart(2, "0");

   return `#${rHex}${gHex}${bHex}`;
};

export const hexToRGBA = (hex: string, alpha: number = 1): string => {
   if (!isValidHex(hex)) return "rgba(204, 204, 204, 1)";

   const hexValue = hex.replace("#", "");
   const r = parseInt(hexValue.substring(0, 2), 16);
   const g = parseInt(hexValue.substring(2, 4), 16);
   const b = parseInt(hexValue.substring(4, 6), 16);

   return `rgba(${r}, ${g}, ${b}, ${alpha})`;
};

export const isLightColor = (hexColor: string): boolean => {
   if (!isValidHex(hexColor)) return false;

   hexColor = hexColor.replace("#", "");
   const r = parseInt(hexColor.substring(0, 2), 16);
   const g = parseInt(hexColor.substring(2, 4), 16);
   const b = parseInt(hexColor.substring(4, 6), 16);

   const brightness = r * 0.299 + g * 0.587 + b * 0.114;
   return brightness > 128;
};

export const getTextColorForBackground = (backgroundColor: string): string => {
   return isLightColor(backgroundColor) ? baseColors.black : baseColors.white;
};
