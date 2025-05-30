// metro.config.js
const { getDefaultConfig } = require("expo/metro-config");

/** @type {import('expo/metro-config').MetroConfig} */
const config = getDefaultConfig(__dirname);

// Add your alias configuration
config.resolver.alias = {
   "@": "./src", // This makes @ point to the src directory
};

module.exports = config;
