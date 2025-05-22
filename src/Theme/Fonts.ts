import * as Font from "expo-font";

export const loadCustomFonts = async () => {
   await Font.loadAsync({
      "Poppins-Bold": require("@/Assets/Fonts/Poppins/Poppins-Bold.ttf"),
      "Poppins-SemiBold": require("@/Assets/Fonts/Poppins/Poppins-SemiBold.ttf"),
      "Poppins-Regular": require("@/Assets/Fonts/Poppins/Poppins-Regular.ttf"),
      "Roboto-Regular": require("@/Assets/Fonts/Roboto/Roboto-Regular.ttf"),
      "Roboto-Medium": require("@/Assets/Fonts/Roboto/Roboto-Medium.ttf"),
      "Roboto-Bold": require("@/Assets/Fonts/Roboto/Roboto-Bold.ttf"),
      "Lato-Light": require("@/Assets/Fonts/Lato/Lato-Light.ttf"),
      "Lato-LightItalic": require("@/Assets/Fonts/Lato/Lato-LightItalic.ttf"),
      "Lato-Regular": require("@/Assets/Fonts/Lato/Lato-Regular.ttf"),
   });
};

export const Fonts = {
   //~ Poppins (Headings) ~//

   //* Main Headings *//
   headingBold: "Poppins-Bold",

   //* Sub Headings *//
   headingSemiBold: "Poppins-SemiBold",

   //* Optional for Consistency *//
   headingRegular: "Poppins-Regular",

   //~ Roboto (Primary Text) ~//

   //* Strong Emphasis or Section Titles *//
   primaryBold: "Roboto-Bold",

   //* Slight Emphasis *//
   primaryMedium: "Roboto-Medium",

   //* Primary Text *//
   primaryRegular: "Roboto-Regular",

   //~ Lato (Light Text) ~//

   //* Optional, Stylized Quotes or Notes *//
   lightRegular: "Lato-Regular",

   //* Light Captions, Descriptions, or Secondary Text *//
   light: "Lato-Light",

   //* Fallback or Mix with Light Text *//
   lightItalic: "Lato-LightItalic",
};
