// jest.config.js
module.exports = {
   preset: "react-native",
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
      "node_modules/(?!(react-native|@react-native|@tanstack|pokenode-ts)/)",
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
   moduleNameMapping: {
      "^@/(.*)$": "<rootDir>/src/$1",
   },
};

// src/__tests__/setup.ts
import "react-native-gesture-handler/jestSetup";

// Mock React Native modules that aren't available in Jest
jest.mock("react-native/Libraries/EventEmitter/NativeEventEmitter");

// Mock AsyncStorage
jest.mock("@react-native-async-storage/async-storage", () =>
   require("@react-native-async-storage/async-storage/jest/async-storage-mock")
);

// Mock console methods for cleaner test output
global.console = {
   ...console,
   warn: jest.fn(),
   error: jest.fn(),
   log: jest.fn(),
};

// Silence React Query dev tools warning
global.__DEV__ = false;

// Mock timers for testing
beforeEach(() => {
   jest.clearAllTimers();
});

// package.json test scripts section
/*
{
  "scripts": {
    "test": "jest",
    "test:watch": "jest --watch",
    "test:coverage": "jest --coverage",
    "test:ci": "jest --ci --coverage --watchAll=false"
  },
  "devDependencies": {
    "@types/jest": "^29.5.0",
    "jest": "^29.5.0",
    "babel-jest": "^29.5.0"
  }
}
*/
