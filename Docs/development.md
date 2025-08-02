# Development Guide

[← Back to README](../README.md)

## Development Setup

### Prerequisites

- **Node.js** 16+ (LTS recommended)
- **Yarn** or **npm**
- **Expo CLI** (`npm install -g @expo/cli`)
- **Git** for version control
- **iOS Simulator** / **Android Emulator** (optional)

### Environment Setup

```bash
# Clone the repository
git clone https://github.com/UdayDey0909/Dexio.git
cd Dexio

# Install dependencies
yarn install

# Start the development server
yarn start
```

### Platform-Specific Setup

#### iOS Development

```bash
# Install Xcode (macOS only)
# Install iOS Simulator
yarn ios
```

#### Android Development

```bash
# Install Android Studio
# Set up Android SDK
# Create Android Virtual Device
yarn android
```

#### Web Development

```bash
# No additional setup required
yarn web
```

## Development Workflow

### Code Quality Standards

#### TypeScript

- **Strict Mode**: All TypeScript strict checks enabled
- **Type Safety**: 100% typed codebase
- **Interface Definitions**: All APIs properly typed
- **Generic Types**: Reusable type definitions

#### Code Style

```typescript
// Component naming: PascalCase
const PokemonCard = () => {};

// File naming: PascalCase for components, camelCase for utilities
// PokemonCard.tsx, usePokemon.ts

// Import order: React, third-party, internal
import React from 'react';
import { View, Text } from 'react-native';
import { useQuery } from '@tanstack/react-query';
import { PokemonCard } from '../Components/PokemonCard';
```

#### ESLint Configuration

```javascript
// .eslintrc.js
module.exports = {
  extends: [
    '@react-native',
    '@typescript-eslint/recommended',
    'prettier',
  ],
  rules: {
    '@typescript-eslint/no-unused-vars': 'error',
    'react-hooks/exhaustive-deps': 'warn',
    'prefer-const': 'error',
  },
};
```

### Git Workflow

#### Branch Naming Convention

``` bash
feature/amazing-feature     # New features
bugfix/fix-navigation       # Bug fixes
hotfix/critical-issue       # Critical fixes
docs/update-readme          # Documentation updates
refactor/improve-performance # Code refactoring
```

#### Commit Message Format

``` bash
type(scope): description

feat(pokemon): add evolution chain display
fix(navigation): resolve tab switching issue
docs(readme): update installation instructions
refactor(api): optimize Pokemon service queries
test(components): add PokemonCard unit tests
```

### Feature Development

#### Creating a New Feature

```bash
# 1. Create feature branch
git checkout -b feature/new-feature

# 2. Create feature directory structure
mkdir -p src/Features/NewFeature/{Components,Hooks,Types,__tests__}

# 3. Add feature files
touch src/Features/NewFeature/index.ts
touch src/Features/NewFeature/Components/NewFeatureComponent.tsx
touch src/Features/NewFeature/Hooks/useNewFeature.ts
touch src/Features/NewFeature/Types/index.ts

# 4. Add tests
touch src/Features/NewFeature/__tests__/NewFeatureComponent.test.tsx
```

#### Feature Structure Template

```typescript
// src/Features/NewFeature/index.ts
export { NewFeatureComponent } from './Components/NewFeatureComponent';
export { useNewFeature } from './Hooks/useNewFeature';
export type { NewFeatureType } from './Types';

// src/Features/NewFeature/Components/NewFeatureComponent.tsx
import React from 'react';
import { View, Text } from 'react-native';
import { useNewFeature } from '../Hooks/useNewFeature';
import { NewFeatureType } from '../Types';

interface Props {
  data: NewFeatureType;
}

export const NewFeatureComponent: React.FC<Props> = ({ data }) => {
  const { result, isLoading } = useNewFeature(data);
  
  if (isLoading) return <LoadingSpinner />;
  
  return (
    <View>
      <Text>{result.title}</Text>
    </View>
  );
};
```

### Testing Strategy

#### Test Requirements

- **Unit Tests**: 80%+ coverage for all new code
- **Integration Tests**: API service and data flow testing
- **Component Tests**: UI component validation
- **Performance Tests**: Memory and performance monitoring

#### Running Tests

```bash
# Run all tests
yarn test

# Run with coverage
yarn test:coverage

# Run specific test suites
yarn test src/Features/NewFeature/

# Debug tests
yarn test:debug
```

### Code Review Process

#### Pull Request Checklist

- [ ] **Tests Pass**: All tests passing
- [ ] **Coverage Maintained**: 80%+ test coverage
- [ ] **TypeScript**: No type errors
- [ ] **Linting**: ESLint passes
- [ ] **Formatting**: Prettier formatting applied
- [ ] **Documentation**: Code properly documented
- [ ] **Performance**: No performance regressions

#### Review Guidelines

- **Code Quality**: Clean, readable, maintainable code
- **Architecture**: Follows established patterns
- **Testing**: Adequate test coverage
- **Documentation**: Clear comments and documentation
- **Performance**: No unnecessary performance impacts

## Development Tools

### IDE Configuration

#### VS Code Extensions

```json
{
  "recommendations": [
    "ms-vscode.vscode-typescript-next",
    "bradlc.vscode-tailwindcss",
    "esbenp.prettier-vscode",
    "ms-vscode.vscode-eslint",
    "ms-vscode.vscode-jest"
  ]
}
```

#### VS Code Settings

```json
{
  "typescript.preferences.importModuleSpecifier": "relative",
  "editor.formatOnSave": true,
  "editor.codeActionsOnSave": {
    "source.fixAll.eslint": true
  },
  "jest.autoRun": {
    "watch": false,
    "onSave": "test-file"
  }
}
```

### Debugging

#### React Native Debugger

```bash
# Install React Native Debugger
brew install --cask react-native-debugger

# Start debugger
open "rndebugger://set-debugger-loc?host=localhost&port=8081"
```

#### Flipper Integration

```javascript
// flipper-plugin-network
// flipper-plugin-react-query
// flipper-plugin-async-storage
```

### Performance Monitoring

#### Performance Monitoring Tools

- **React DevTools**: Component inspection
- **Flipper**: Network, storage, and performance monitoring
- **Metro Bundler**: Bundle analysis and optimization
- **Hermes Profiler**: JavaScript performance analysis

## Deployment

### Build Configuration

#### Android Build

```bash
# Build APK
yarn build:android-apk

# Build AAB
yarn build:android-aab

# Build with specific configuration
eas build --platform android --profile production
```

#### iOS Build

```bash
# Build for iOS
yarn build:ios

# Build with EAS
eas build --platform ios --profile production
```

### Environment Configuration

#### Environment Variables

```bash
# .env
API_BASE_URL=https://pokeapi.co/api/v2
ENVIRONMENT=development
DEBUG_MODE=true
```

#### Platform-Specific Config

```json
// app.json
{
  "expo": {
    "ios": {
      "bundleIdentifier": "com.dexio.app"
    },
    "android": {
      "package": "com.dexio.app"
    }
  }
}
```

## Troubleshooting

### Common Issues

#### Metro Bundler Issues

```bash
# Clear Metro cache
yarn start --reset-cache

# Clear watchman cache
watchman watch-del-all
```

#### iOS Build Issues

```bash
# Clear iOS build
cd ios && rm -rf build && cd ..

# Reinstall pods
cd ios && pod install && cd ..
```

#### Android Build Issues

```bash
# Clear Android build
cd android && ./gradlew clean && cd ..

# Clear Gradle cache
rm -rf ~/.gradle/caches/
```

### Performance Issues

#### Memory Leaks

- Use React DevTools Profiler
- Monitor component re-renders
- Check for event listener leaks
- Analyze bundle size impact

#### Slow Rendering

- Use FlashList for large lists
- Implement React.memo for expensive components
- Optimize image loading and caching
- Monitor JavaScript thread performance

## Contributing Guidelines Summary

### Quick Start for Contributors

1. **Fork** the repository
2. **Clone** your fork locally
3. **Install** dependencies: `yarn install`
4. **Create** a feature branch: `git checkout -b feature/amazing-feature`
5. **Make** your changes with tests
6. **Run** tests: `yarn test`
7. **Commit** your changes: `git commit -m 'Add amazing feature'`
8. **Push** to your branch: `git push origin feature/amazing-feature`
9. **Open** a Pull Request

### Code Quality Requirements

- **TypeScript**: All code must be properly typed
- **Testing**: New features require corresponding tests
- **Linting**: Code must pass ESLint checks
- **Formatting**: Use Prettier for consistent formatting

### Feature Development Process

```bash
# Create a new feature
mkdir src/Features/NewFeature
cd src/Features/NewFeature

# Add components, hooks, and tests
touch index.ts
mkdir Components Hooks Types __tests__

# Run tests before committing
yarn test:ci
```

For detailed contributing guidelines, see [CONTRIBUTING.md](../CONTRIBUTING.md).
