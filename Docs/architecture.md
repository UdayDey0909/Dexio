# Architecture

[← Back to README](../README.md)

## Project Structure

``` bash
src/
├── 📁 Features/           # Feature-based modules
│   ├── Home/             # Pokemon list with infinite scroll
│   ├── PokemonDetails/   # Comprehensive detail views
│   ├── Search/           # Advanced search functionality
│   └── Common/           # Shared components
├── 📁 Services/          # API and business logic
│   ├── API/              # 13 PokeAPI service modules
│   ├── Client/           # HTTP client with caching
│   └── Hooks/            # Custom React Query hooks
├── 📁 Theme/             # Design system and theming
├── 📁 Components/        # Reusable UI components
├── 📁 Assets/            # Images, fonts, and static resources
└── 📁 Utils/             # Utility functions and helpers
```

## Key Technologies

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

## Architecture Principles

### Feature-Based Structure

Each feature is self-contained with its own components, hooks, types, and tests:

- **Home**: Pokémon list with infinite scroll and skeleton loading
- **PokemonDetails**: Comprehensive detail views with stats and evolution chains
- **Search**: Advanced search functionality (in development)
- **Common**: Shared components and utilities

### Modular API Services

Complete PokeAPI integration with 13 service modules:

- **Pokemon**: Core Pokémon data (898+ entries)
- **Ability**: Pokémon abilities (327+ abilities)
- **Type**: Type effectiveness and matchups
- **Move**: Battle moves (1000+ moves)
- **Evolution**: Evolution chains and triggers
- **Item**: Held items (1600+ items)
- **Berry**: Berry data and flavors
- **Location**: Game locations and regions
- **Game**: Generations and versions
- **Machine**: TMs and HMs
- **Contest**: Contest types and effects
- **Encounter**: Encounter methods
- **Utility**: Helper functions

### State Management Strategy

- **React Query**: Server state management with intelligent caching
- **Local State**: Component-level state with React hooks
- **Persistence**: Async Storage and MMKV for local data

### Performance Optimization

- **FlashList**: High-performance list rendering
- **Image Caching**: Optimized image loading and storage
- **Code Splitting**: Lazy loading of components
- **Memory Management**: Efficient cleanup and garbage collection

## Development Status

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
