// jest.config.js
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
      "node_modules/(?!(react-native|@react-native|@react-navigation|expo|@expo|expo-modules-core|@tanstack|pokenode-ts|react-native-vector-icons|react-native-linear-gradient|react-native-mmkv|react-native-orientation-locker|react-native-reanimated|react-native-svg|@babel)/)",
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
   testEnvironment: "node",
   moduleNameMapper: {
      "^@/(.*)$": "<rootDir>/src/$1",
   },
   setupFiles: ["<rootDir>/src/__tests__/jest-setup.js"],
   testTimeout: 10000,
   clearMocks: true,
   resetMocks: true,
   restoreMocks: true,
   // Additional options to handle potential issues
   verbose: false,
   silent: false,
   // Handle module resolution issues
   resolver: undefined,
   // Ensure proper handling of async operations
   detectOpenHandles: false,
};
