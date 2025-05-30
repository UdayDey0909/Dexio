// src/__tests__/jest-setup.js
// This file runs before the test environment is set up

// Set up essential globals that React Native expects
global.__DEV__ = true;
global.__REACT_DEVTOOLS_GLOBAL_HOOK__ = {};
global.__BUNDLE_START_TIME__ = Date.now();
global.__EXPO_WEB__ = false;

// Setup fetch polyfill for React Native environment
if (typeof global.fetch === "undefined") {
   const { default: fetch, Request, Response, Headers } = require("node-fetch");
   global.fetch = fetch;
   global.Request = Request;
   global.Response = Response;
   global.Headers = Headers;
}

// Setup TextEncoder/TextDecoder for modern Node.js compatibility
if (typeof global.TextEncoder === "undefined") {
   const { TextEncoder, TextDecoder } = require("util");
   global.TextEncoder = TextEncoder;
   global.TextDecoder = TextDecoder;
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
