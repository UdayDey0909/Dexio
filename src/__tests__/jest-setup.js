// This file runs before the test environment is set up

// Set up essential globals that React Native expects
global.__DEV__ = true;
global.__REACT_DEVTOOLS_GLOBAL_HOOK__ = {};
global.__BUNDLE_START_TIME__ = Date.now();
global.__EXPO_WEB__ = false;

// Prevent window redefinition error by ensuring clean global state
if (typeof global.window !== "undefined") {
   delete global.window;
}

// Setup fetch polyfill for React Native environment
if (typeof global.fetch === "undefined") {
   global.fetch = require("node-fetch");
}

// Basic console setup (will be overridden in setup.ts if needed)
const originalConsole = console;
global.console = {
   ...originalConsole,
   // Keep original methods but can be mocked later
   warn: originalConsole.warn,
   error: originalConsole.error,
   log: originalConsole.log,
   info: originalConsole.info,
   debug: originalConsole.debug,
};
