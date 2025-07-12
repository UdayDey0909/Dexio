import AsyncStorage from "@react-native-async-storage/async-storage";
import { ThemeMode } from "./ThemeContext";

const THEME_STORAGE_KEY = "@dexio_theme_mode";

export const ThemeStorage = {
   /**
    * Save the theme mode preference to storage
    */
   saveThemeMode: async (themeMode: ThemeMode): Promise<void> => {
      try {
         await AsyncStorage.setItem(THEME_STORAGE_KEY, themeMode);
      } catch (error) {
         console.error("Failed to save theme mode:", error);
      }
   },

   /**
    * Load the theme mode preference from storage
    */
   loadThemeMode: async (): Promise<ThemeMode | null> => {
      try {
         const savedThemeMode = await AsyncStorage.getItem(THEME_STORAGE_KEY);
         return savedThemeMode as ThemeMode | null;
      } catch (error) {
         console.error("Failed to load theme mode:", error);
         return null;
      }
   },

   /**
    * Clear the stored theme mode preference
    */
   clearThemeMode: async (): Promise<void> => {
      try {
         await AsyncStorage.removeItem(THEME_STORAGE_KEY);
      } catch (error) {
         console.error("Failed to clear theme mode:", error);
      }
   },
};
