# 🎮 Dexio - Modern Pokémon Encyclopedia

<div align="center">
  <img src="src/Assets/Previews/icon.png" alt="Dexio Logo" width="200"/>
</div>

<div align="center">

[![React Native](https://img.shields.io/badge/React%20Native-0.79.5-61DAFB?logo=react&logoColor=white)](https://reactnative.dev/)
[![Expo](https://img.shields.io/badge/Expo-53.0.20-000020?logo=expo&logoColor=white)](https://expo.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.8.3-3178C6?logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Jest](https://img.shields.io/badge/Jest-29.7.0-C21325?logo=jest&logoColor=white)](https://jestjs.io/)
[![Expo Router](https://img.shields.io/badge/Expo%20Router-5.1.4-000020?logo=expo&logoColor=white)](https://docs.expo.dev/router/introduction/)
[![PokéAPI](https://img.shields.io/badge/PokéAPI-v2-FFCB05?logo=pokemon&logoColor=white)](https://pokeapi.co/)
[![License](https://img.shields.io/badge/License-MIT-green.svg?logo=open-source-initiative&logoColor=white)](LICENSE)
[![Version](https://img.shields.io/badge/Version-1.0.0-orange?logo=semantic-release&logoColor=white)]()

</div>

> A modern, cross-platform Pokémon encyclopedia app built with React Native and Expo, featuring comprehensive Pokémon data, beautiful UI, and a modular, scalable architecture.

## 📋 Table of Contents

- [✨ Features](#-features)
- [🛠️ Tech Stack](#️-tech-stack)
- [🚀 Quick Start](#-quick-start)
- [📱 Usage](#-usage)
- [🏗️ Project Structure](#️-project-structure)
- [⚙️ Configuration](#️-configuration)
- [🧪 Testing](#-testing)
- [🤝 Contributing](#-contributing)
- [📄 License](#-license)

## ✨ Features

### 🎯 Core Features
- **📱 Cross-Platform**: Built with React Native & Expo for iOS, Android, and Web
- **🎨 Modern UI/UX**: Beautiful, responsive design with light/dark themes
- **⚡ High Performance**: Optimized with FlashList, React Query, and intelligent caching
- **📊 Comprehensive Data**: Detailed stats, abilities, evolutions, and type effectiveness
- **🎭 Animated Graphics**: Smooth animations and interactive elements
- **🔄 Smooth Loading States**: Skeleton loaders with shimmer effects for seamless UX
- **🛡️ Graceful Error Handling**: Inline retry functionality with user-friendly messages

### 🚧 Development Status
- **✅ Backend Complete**: All 13 API service modules fully implemented
- **✅ Core Features**: Pokémon list, details, and basic navigation working
- **🔄 Frontend Features**: Explore, Search, Battle, and Profile screens in development
- **🎨 UX Improvements**: Loading states, error handling, and empty states implemented

### 🏗️ Technical Excellence
- **🧩 Modular Architecture**: Feature-based folder structure with clear separation of concerns
- **🔧 TypeScript**: Full type safety and excellent developer experience
- **📡 API Integration**: Complete PokeAPI integration with 13 service modules
- **🔄 State Management**: React Query for server state management
- **🧪 Testing**: Comprehensive Jest setup with testing utilities
- **🎨 Theme System**: Dynamic theming with Pokémon type colors

### 🎨 UX Improvements
- **🔄 Skeleton Loaders**: Smooth loading states with shimmer effects
- **🛡️ Error Recovery**: Inline retry functionality for failed requests
- **📱 Empty States**: Informative placeholders for upcoming features
- **🎭 Smooth Transitions**: Fade-in animations when content loads
- **♿ Accessibility**: ARIA support and reduced motion preferences

### 🚀 Performance Features
- **⚡ Infinite Scroll**: Smooth pagination with FlashList and skeleton loaders
- **💾 Intelligent Caching**: Multi-layer caching strategy
- **🖼️ Image Optimization**: Optimized image loading and caching
- **📱 Memory Management**: Efficient memory usage and cleanup
- **🔄 Error Handling**: Robust error handling with inline retry functionality
- **🎭 Loading UX**: Skeleton loaders with shimmer effects prevent layout shifts

## 🛠️ Tech Stack

### Frontend
- **React Native** 0.79.5 - Cross-platform mobile development
- **Expo** 53.0.20 - Development platform and tools
- **TypeScript** 5.8.3 - Type safety and developer experience
- **Expo Router** 5.1.4 - File-based navigation

### UI & Animation
- **FlashList** 1.7.6 - High-performance list rendering
- **React Native Reanimated** 3.17.4 - Smooth animations
- **React Native SVG** 15.11.2 - Vector graphics support
- **Expo Linear Gradient** 14.1.5 - Gradient effects

### State Management & Data
- **React Query** 5.76.1 - Server state management and caching
- **Async Storage** 2.1.2 - Local data persistence
- **MMKV** 3.2.0 - High-performance key-value storage

### API & Networking
- **Pokenode-ts** 1.20.0 - TypeScript SDK for PokeAPI
- **Axios** - HTTP client for API requests
- **NetInfo** 11.4.1 - Network connectivity monitoring

### Development Tools
- **Jest** 29.7.0 - Testing framework
- **React Native Testing Library** 13.2.0 - Component testing
- **ESLint & Prettier** - Code quality and formatting

## 🚀 Quick Start

### Prerequisites

- Node.js 16+ 
- Yarn or npm
- Expo CLI (`npm install -g @expo/cli`)
- iOS Simulator / Android Emulator (optional)

### Installation

```bash
# Clone the repository
git clone https://github.com/UdayDey0909/Dexio.git
cd Dexio

# Install dependencies
yarn install
# or
npm install

# Start the development server
yarn start
# or
npm start
```

### Running the App

```bash
# Start Expo development server
yarn start

# Run on specific platforms
yarn ios      # iOS Simulator
yarn android  # Android Emulator
yarn web      # Web browser
```

### Building for Production

```bash
# Build Android APK
yarn build:android-apk

# Build Android AAB
yarn build:android-aab

# Build iOS
yarn build:ios
```

## 📱 Usage

### Core Functionality

1. **Pokémon List**: Browse all 898+ Pokémon with infinite scroll and skeleton loading
2. **Detailed Views**: View comprehensive stats, abilities, and evolution chains
3. **Smooth Loading**: Skeleton loaders with shimmer effects for seamless transitions
4. **Error Recovery**: Inline retry functionality for failed network requests
5. **Empty States**: Informative placeholder screens for upcoming features

### 🚧 Upcoming Features

- **🔍 Advanced Search**: Search Pokémon by name, type, generation, and stats
- **🗺️ Explore**: Browse by generation, region, and categories
- **⚔️ Battle**: Team builder, battle simulation, and damage calculator
- **👤 Profile**: User settings, favorites, and preferences

### API Services

The app includes 13 comprehensive API service modules:

| Service       | Description        | Endpoints                      |
| ------------- | ------------------ | ------------------------------ |
| **Pokemon**   | Core Pokémon data  | 898+ Pokémon, stats, sprites   |
| **Ability**   | Pokémon abilities  | 327+ abilities with effects    |
| **Type**      | Type effectiveness | 18 types, matchups, damage     |
| **Move**      | Battle moves       | 1000+ moves with details       |
| **Evolution** | Evolution chains   | Complete evolution trees       |
| **Item**      | Held items         | 1600+ items with effects       |
| **Berry**     | Berry data         | 64 berries with flavors        |
| **Location**  | Game locations     | Regions, areas, encounters     |
| **Game**      | Game versions      | Generations, versions, Pokedex |
| **Machine**   | TMs/HMs            | Technical machines data        |
| **Contest**   | Contest data       | Contest types and effects      |
| **Encounter** | Encounter methods  | How Pokémon are found          |
| **Utility**   | Helper functions   | Resource utilities             |

## 🏗️ Project Structure

```
src/
├── 📁 app/                 # Expo Router app directory
├── 📁 Features/            # Feature-based modules
│   ├── Home/              # Pokémon list with infinite scroll
│   ├── PokemonDetails/    # Comprehensive detail views
│   └── Common/            # Shared components and utilities
├── 📁 Services/           # API and business logic
│   ├── API/               # 13 PokeAPI service modules
│   ├── Client/            # HTTP client with caching
│   └── Hooks/             # Custom React Query hooks
├── 📁 Components/         # Reusable UI components
├── 📁 Theme/              # Design system and theming
├── 📁 Assets/             # Images, fonts, and static resources
├── 📁 Utils/              # Utility functions and helpers
├── 📁 Screens/            # Screen components
├── 📁 Guide/              # User guide and documentation
└── 📁 __tests__/          # Test files
```

### Key Directories

- **`src/Features/`**: Feature-based architecture with self-contained modules
- **`src/Services/API/`**: Complete PokeAPI integration with TypeScript
- **`src/Theme/`**: Design system with Pokémon type colors and theming
- **`src/Components/`**: Reusable UI components with TypeScript
- **`src/Utils/`**: Helper functions and utilities

## ⚙️ Configuration

### Environment Setup

The app uses Expo's configuration system. Key configuration files:

- **`app.json`**: Expo app configuration
- **`package.json`**: Dependencies and scripts
- **`tsconfig.json`**: TypeScript configuration
- **`jest.config.js`**: Testing configuration

### Platform-Specific Settings

```json
{
  "ios": {
    "supportsTablet": true,
    "bundleIdentifier": "com.dexio.app"
  },
  "android": {
    "package": "com.dexio.app",
    "permissions": ["INTERNET", "ACCESS_NETWORK_STATE"]
  },
  "web": {
    "bundler": "metro",
    "favicon": "./src/Assets/Previews/icon.png"
  }
}
```

### API Configuration

The app integrates with PokeAPI using the `pokenode-ts` SDK:

```typescript
// Automatic caching and error handling
const pokemon = await pokemonAPI.getPokemonByName('pikachu');
const abilities = await abilityAPI.getAbilityByName('lightning-rod');
```

## 🧪 Testing

### Test Coverage

The project maintains comprehensive test coverage with Jest and React Native Testing Library.

### Running Tests

```bash
# Run all tests
yarn test

# Run tests with coverage
yarn test:coverage

# Run tests in watch mode
yarn test:watch

# Run tests in CI mode
yarn test:ci

# Debug tests
yarn test:debug
```

### Test Structure

- **Unit Tests**: Individual component and function testing
- **Integration Tests**: API service and data flow testing
- **Component Tests**: UI component validation
- **Performance Tests**: Memory and performance monitoring

## 🗺️ Development Roadmap

### ✅ Completed (Phase 1)
- [x] **Backend API**: Complete PokeAPI integration with 13 service modules
- [x] **Core Navigation**: Tab-based navigation with Expo Router
- [x] **Pokémon List**: Infinite scroll with FlashList optimization
- [x] **Pokémon Details**: Comprehensive detail views with stats
- [x] **Loading UX**: Skeleton loaders with shimmer effects
- [x] **Error Handling**: Graceful error states with retry functionality
- [x] **Empty States**: Informative placeholder screens

### 🔄 In Progress (Phase 2)
- [ ] **Advanced Search**: Filters, history, voice search
- [ ] **Explore Screen**: Generation/region browsing
- [ ] **Battle Features**: Type calculator, move effectiveness
- [ ] **Profile Enhancement**: Settings, preferences, favorites

### 📋 Planned (Phase 3)
- [ ] **Team Builder**: Create and analyze teams
- [ ] **Battle Simulation**: Damage calculation engine
- [ ] **Social Features**: User accounts, sharing
- [ ] **Advanced Tools**: IV/EV calculators

### 🚀 Future (Phase 4)
- [ ] **Offline Support**: Local database, sync
- [ ] **Performance**: Advanced caching, optimization
- [ ] **Testing**: E2E, visual regression
- [ ] **Deployment**: App store preparation

## 🤝 Contributing

We welcome contributions! Please follow these guidelines:

### Development Setup

1. **Fork** the repository
2. **Clone** your fork locally
3. **Install** dependencies: `yarn install`
4. **Create** a feature branch: `git checkout -b feature/amazing-feature`
5. **Make** your changes with tests
6. **Run** tests: `yarn test`
7. **Commit** your changes: `git commit -m 'Add amazing feature'`
8. **Push** to your branch: `git push origin feature/amazing-feature`
9. **Open** a Pull Request

### Code Quality

- **TypeScript**: All code must be properly typed
- **Testing**: New features require corresponding tests
- **Linting**: Code must pass ESLint checks
- **Formatting**: Use Prettier for consistent formatting

### Feature Development

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

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

<div align="center">
  <p>Made with ❤️ by the Dexio Team</p>
  <p>
    <a href="https://github.com/UdayDey0909/Dexio">⭐ Star on GitHub</a> • 
    <a href="https://github.com/UdayDey0909/Dexio/issues">🐛 Report Bug</a> • 
    <a href="https://github.com/UdayDey0909/Dexio/issues">✨ Request Feature</a>
  </p>
</div> 