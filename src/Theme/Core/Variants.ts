import { baseColors } from "./Colors";

export const lightThemeColors = {
   background: {
      primary: baseColors.white, // #FFFFFF - Main screen backgrounds
      secondary: baseColors.lightGray, // #F3F4F6 - Section backgrounds, sidebars
      card: baseColors.white, // #FFFFFF - Card/item backgrounds
      overlay: baseColors.slate, // #0F172A - Modal overlays, tooltips
   },
   text: {
      primary: baseColors.charcoal, // #1F2937 - Main text (headings, body)
      secondary: baseColors.darkGray, // #4B5563 - Less important text
      muted: baseColors.mediumGray, // #9CA3AF - Placeholder text, captions
      inverse: baseColors.white, // #FFFFFF - Text on dark backgrounds
      light: baseColors.white, // #FFFFFF - Text on colored backgrounds
      dark: baseColors.black, // #000000 - High contrast text when needed
   },
   border: {
      light: "#E5E7EB", // Subtle borders, dividers
      medium: "#D1D5DB", // More prominent borders, input fields
   },
   primary: baseColors.types.water, // #6390F0 - Main brand color (buttons, links)
   accent: baseColors.system.accent, // #22D3EE - Highlights, notifications
   types: baseColors.types, // All 18 Pokemon type colors
   system: baseColors.system, // Error, warning, success, info colors
} as const;

export const darkThemeColors = {
   background: {
      primary: baseColors.slate, // #0F172A - Main screen backgrounds
      secondary: baseColors.charcoal, // #1F2937 - Section backgrounds, sidebars
      card: baseColors.charcoal, // #1F2937 - Card/item backgrounds
      overlay: baseColors.slate, // #0F172A - Modal overlays, tooltips
   },
   text: {
      primary: baseColors.white, // #FFFFFF - Main text (headings, body)
      secondary: baseColors.lightGray, // #F3F4F6 - Less important text
      muted: baseColors.mediumGray, // #9CA3AF - Placeholder text, captions
      inverse: baseColors.charcoal, // #1F2937 - Text on light backgrounds
      light: baseColors.white, // #FFFFFF - Text on colored backgrounds
      dark: baseColors.black, // #000000 - High contrast text when needed
   },
   border: {
      light: "#374151", // Subtle borders, dividers
      medium: "#4B5563", // More prominent borders, input fields
   },
   primary: baseColors.types.water, // #6390F0 - Main brand color (buttons, links)
   accent: baseColors.system.accent, // #22D3EE - Highlights, notifications
   types: baseColors.types, // All 18 Pokemon type colors
   system: baseColors.system, // Error, warning, success, info colors
} as const;
