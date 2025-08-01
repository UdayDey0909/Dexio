# Dexio Build Guide

This directory contains all build-related configurations and scripts for the Dexio Pokemon app.

## Directory Structure

```
build/
├── config/
│   └── build-config.json    # Build configuration settings
├── scripts/
│   ├── pre-build.js         # Pre-build validation script
│   └── post-build.js        # Post-build completion script
└── README.md                # This file
```

## Build Types

### 1. Development Build (APK)
- **Purpose**: Internal testing and development
- **Command**: `npm run build:android-apk`
- **Distribution**: Internal
- **Features**: Development client, debugging enabled

### 2. Preview Build (APK)
- **Purpose**: Testing with team and beta users
- **Command**: `npm run build:android-apk`
- **Distribution**: Internal
- **Features**: Production-like environment

### 3. Production Build (AAB)
- **Purpose**: Google Play Store submission
- **Command**: `npm run build:android-aab`
- **Distribution**: Store
- **Features**: Optimized for production

## Step-by-Step Build Process

### Prerequisites
1. Install EAS CLI: `npm install -g eas-cli`
2. Login to Expo: `eas login`
3. Ensure all dependencies are installed: `npm install`

### Build Commands

#### Quick Build (APK for testing)
```bash
npm run build:android-apk
```

#### Full Build with Validation (APK)
```bash
npm run build:full
```

#### Production Build (AAB for Play Store)
```bash
npm run build:production
```

### Manual Build Steps

1. **Pre-build Validation**
   ```bash
   npm run pre-build
   ```

2. **Build APK**
   ```bash
   eas build --platform android --profile preview
   ```

3. **Build AAB**
   ```bash
   eas build --platform android --profile production
   ```

4. **Post-build Tasks**
   ```bash
   npm run post-build
   ```

## Build Configuration

### Environment Variables
- `NODE_ENV`: Set automatically by build profile
- `API_BASE_URL`: Pokemon API endpoint
- `ENABLE_LOGGING`: Debug logging toggle
- `ENABLE_DEBUG`: Debug mode toggle

### Android Configuration
- **Package**: `com.dexio.app`
- **Version Code**: Auto-incremented
- **Permissions**: Internet, Network State
- **Icon**: `src/Assets/Previews/icon.png`
- **Splash**: `src/Assets/Previews/splash-icon.jpg`

## Troubleshooting

### Common Issues

1. **Build Fails**
   - Check EAS account has build credits
   - Verify all required files exist
   - Run `npm run pre-build` to validate

2. **Large APK Size**
   - Optimize images in `src/Assets/`
   - Remove unused dependencies
   - Enable ProGuard in production builds

3. **Permission Issues**
   - Verify permissions in `app.json`
   - Check Android manifest generation

4. **API Errors**
   - Test network connectivity
   - Verify Pokemon API endpoints
   - Check environment variables

### Useful Commands

```bash
# View build status
eas build:list

# Download build
eas build:download

# View build logs
eas build:view

# Submit to Play Store
eas submit --platform android
```

## Post-Build Checklist

- [ ] Download APK/AAB from EAS dashboard
- [ ] Test on different Android devices
- [ ] Verify Pokemon data loads correctly
- [ ] Test all navigation flows
- [ ] Check offline functionality
- [ ] Validate app permissions
- [ ] Test on different screen sizes
- [ ] Verify image assets display correctly

## Notes

- APK files are for testing and direct distribution
- AAB files are required for Google Play Store
- Builds are processed on Expo's servers
- Build time varies (usually 10-30 minutes)
- Check EAS dashboard for build progress 