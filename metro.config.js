const { getDefaultConfig, mergeConfig } = require("@react-native/metro-config");

const config = {
   resolver: {
      alias: {
         "@": "./src", // This makes @ point to the src directory
      },
   },
};

module.exports = mergeConfig(getDefaultConfig(__dirname), config);
