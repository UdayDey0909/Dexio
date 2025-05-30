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
   testEnvironment: "jsdom",
   moduleNameMapping: {
      "^@/(.*)$": "<rootDir>/src/$1",
   },
   // Add globals for React Native testing
   globals: {
      __DEV__: true,
   },
};
