#!/usr/bin/env node

const fs = require("fs");
const path = require("path");

console.log("🎉 Build completed successfully!");

// Create build info file
const buildInfo = {
   timestamp: new Date().toISOString(),
   version: require("../../package.json").version,
   buildType: process.env.BUILD_TYPE || "unknown",
   environment: process.env.NODE_ENV || "development",
};

const buildInfoPath = path.join(__dirname, "../../build-info.json");
fs.writeFileSync(buildInfoPath, JSON.stringify(buildInfo, null, 2));

console.log("📝 Build info saved to build-info.json");

// Display next steps
console.log("\n📋 Next Steps:");
console.log("1. Download the APK/AAB from the EAS dashboard");
console.log("2. Test the build on different devices");
console.log("3. Check all Pokemon data loads correctly");
console.log("4. Verify offline functionality (if implemented)");
console.log("5. Test all navigation flows");

console.log("\n🔗 Useful Commands:");
console.log("- View build status: eas build:list");
console.log("- Download build: eas build:download");
console.log("- Submit to store: eas submit --platform android");
