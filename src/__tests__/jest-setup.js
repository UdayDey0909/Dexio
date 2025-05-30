// This file runs before the test environment is set up

// Prevent window redefinition error by ensuring clean global state
if (typeof global.window !== "undefined") {
   delete global.window;
}

// Set up basic globals that React Native expects
global.__DEV__ = true;
global.__REACT_DEVTOOLS_GLOBAL_HOOK__ = {};
global.__BUNDLE_START_TIME__ = Date.now();
global.__EXPO_WEB__ = false;

// Mock console methods to avoid noise in tests
const originalConsole = console;
global.console = {
   ...originalConsole,
   warn: jest.fn(),
   error: jest.fn(),
   log: jest.fn(),
   info: jest.fn(),
   debug: jest.fn(),
};

// Ensure timers are clean
if (typeof jest !== "undefined") {
   jest.useFakeTimers();
}
