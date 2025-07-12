import React, { createContext, useContext, useState, useEffect } from "react";
import { lightThemeColors, darkThemeColors } from "./Core/Variants";
import { ThemeStorage } from "./ThemeStorage";

export type ThemeMode = "light" | "dark";

interface ThemeContextType {
   theme: typeof lightThemeColors | typeof darkThemeColors;
   themeMode: ThemeMode;
   setThemeMode: (mode: ThemeMode) => void;
   isDark: boolean;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

interface ThemeProviderProps {
   children: React.ReactNode;
}

export const ThemeProvider: React.FC<ThemeProviderProps> = ({ children }) => {
   const [themeMode, setThemeMode] = useState<ThemeMode>("light");
   const [isLoading, setIsLoading] = useState(true);

   // Load saved theme mode on app start
   useEffect(() => {
      const loadSavedTheme = async () => {
         try {
            const savedThemeMode = await ThemeStorage.loadThemeMode();
            if (
               savedThemeMode &&
               (savedThemeMode === "light" || savedThemeMode === "dark")
            ) {
               setThemeMode(savedThemeMode);
            }
         } catch (error) {
            console.error("Failed to load theme mode:", error);
         } finally {
            setIsLoading(false);
         }
      };

      loadSavedTheme();
   }, []);

   // Determine the actual theme based on mode
   const getActualTheme = () => {
      return themeMode === "dark" ? darkThemeColors : lightThemeColors;
   };

   const theme = getActualTheme();
   const isDark = themeMode === "dark";

   // Save theme mode when it changes
   const handleSetThemeMode = async (mode: ThemeMode) => {
      setThemeMode(mode);
      await ThemeStorage.saveThemeMode(mode);
   };

   // No longer need system color scheme monitoring

   const value: ThemeContextType = {
      theme,
      themeMode,
      setThemeMode: handleSetThemeMode,
      isDark,
   };

   return (
      <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
   );
};

export const useTheme = (): ThemeContextType => {
   const context = useContext(ThemeContext);
   if (context === undefined) {
      throw new Error("useTheme must be used within a ThemeProvider");
   }
   return context;
};
