import { baseColors } from "./Colors";

export const lightThemeColors = {
   background: {
      primary: baseColors.white,
      secondary: baseColors.lightGray,
      card: baseColors.white,
      overlay: baseColors.slate,
   },
   text: {
      primary: baseColors.charcoal,
      secondary: baseColors.darkGray,
      muted: baseColors.mediumGray,
      inverse: baseColors.white,
      light: baseColors.white,
      dark: baseColors.black,
   },
   border: {
      light: "#E5E7EB",
      medium: "#D1D5DB",
   },
   primary: baseColors.types.water,
   accent: baseColors.system.accent,
   types: baseColors.types,
   system: baseColors.system,
} as const;

export const darkThemeColors = {
   background: {
      primary: baseColors.slate,
      secondary: baseColors.charcoal,
      card: baseColors.charcoal,
      overlay: baseColors.slate,
   },
   text: {
      primary: baseColors.white,
      secondary: baseColors.lightGray,
      muted: baseColors.mediumGray,
      inverse: baseColors.charcoal,
      light: baseColors.white,
      dark: baseColors.black,
   },
   border: {
      light: "#374151",
      medium: "#4B5563",
   },
   primary: baseColors.types.water,
   accent: baseColors.system.accent,
   types: baseColors.types,
   system: baseColors.system,
} as const;
