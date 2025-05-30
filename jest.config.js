module.exports = {
   preset: "jest-expo",
   setupFilesAfterEnv: ["<rootDir>/src/__tests__/setup.ts"],
   testMatch: [
      "**/__tests__/**/*.(test|spec).(js|jsx|ts|tsx)",
      "**/*.(test|spec).(js|jsx|ts|tsx)",
   ],
   moduleFileExtensions: ["ts", "tsx", "js", "jsx", "json", "node"],
   transform: {
      "^.+\\.(js|jsx|ts|tsx)$": "babel-jest",
   },
   transformIgnorePatterns: [
      "node_modules/(?!(react-native|@react-native|@react-navigation|expo|@expo|@tanstack|pokenode-ts|react-native-vector-icons|react-native-linear-gradient|react-native-mmkv|react-native-orientation-locker|react-native-reanimated|react-native-svg)/)",
   ],
   collectCoverageFrom: [
      "src/**/*.{ts,tsx}",
      "!src/**/*.d.ts",
      "!src/**/__tests__/**",
      "!src/**/*.test.{ts,tsx}",
      "!src/**/*.spec.{ts,tsx}",
   ],
   coverageThreshold: {
      global: {
         branches: 80,
         functions: 80,
         lines: 80,
         statements: 80,
      },
   },
   // Use React Native environment instead of jsdom to avoid window conflicts
   testEnvironment: "react-native",
   // Fixed: Use correct property name (was moduleNameMapping)
   moduleNameMapper: {
      "^@/(.*)$": "<rootDir>/src/$1",
   },
   // Globals for React Native testing
   globals: {
      __DEV__: true,
      __REACT_DEVTOOLS_GLOBAL_HOOK__: {},
      __BUNDLE_START_TIME__: 0,
      __EXPO_WEB__: false,
   },
   // Setup files for initial Jest setup (before environment)
   setupFiles: ["<rootDir>/src/__tests__/jest-setup.js"],
   // Timeouts
   testTimeout: 10000,
   // Force exit to prevent hanging
   forceExit: true,
};
