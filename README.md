# Dexio

A modern, visually rich Pokémon app built with React Native, featuring detailed Pokémon data, beautiful UI, and a modular, scalable codebase.

---

## Table of Contents

- [Dexio](#dexio)
  - [Table of Contents](#table-of-contents)
  - [Overview](#overview)
  - [Features](#features)
  - [Screenshots](#screenshots)
  - [Project Structure](#project-structure)
    - [Key Folders](#key-folders)
  - [Getting Started](#getting-started)
    - [Prerequisites](#prerequisites)
    - [Installation](#installation)
  - [Development](#development)
    - [Folder \& File Conventions](#folder--file-conventions)
    - [Adding a New Feature](#adding-a-new-feature)
    - [Theming](#theming)
  - [Testing](#testing)
  - [Contributing](#contributing)
  - [License](#license)
  - [Credits](#credits)

---

## Overview

Dexio is a cross-platform Pokémon encyclopedia app designed for speed, beauty, and extensibility. It leverages the PokéAPI and modern React Native best practices to deliver a smooth, delightful user experience. The app is modular, with a clear separation of concerns, and is easy to extend with new features or data sources.

---

## Features

- **Pokémon Details:** View comprehensive data for each Pokémon, including stats, types, abilities, evolutions, and more.
- **Modern UI/UX:** Clean, responsive, and visually accurate design inspired by official Pokémon resources.
- **Animated Graphics:** Includes animated Pokéball backgrounds, type icons, and stat bars.
- **Type Effectiveness:** Visualize weaknesses and resistances, supporting dual-types.
- **Search & Explore:** Quickly search for Pokémon and explore by region, type, or other filters.
- **Performance:** Fast data fetching, caching, and smooth navigation.
- **Accessibility:** Designed with accessibility and responsiveness in mind.
- **Extensible:** Modular folder structure for easy feature addition and maintenance.

---

## Screenshots
>
>

---

## Project Structure

```
Dexio/
├── app.json
├── babel.config.js
├── jest.config.js
├── metro.config.js
├── package.json
├── README.md
├── src/
│   ├── Assets/           # Images, SVGs, fonts, and other static assets
│   ├── Features/         # Feature modules (Home, PokemonDetails, etc.)
│   ├── Services/         # API clients, data fetching, and business logic
│   ├── Theme/            # Colors, fonts, and theme utilities
│   ├── Utils/            # Utility functions and helpers
│   ├── Screens/          # Top-level screen components
│   ├── app/              # App entry and navigation layouts
│   └── __tests__/        # Unit and integration tests
├── tsconfig.json
└── ...
```

### Key Folders

- **Features/**: Contains all feature modules, each with its own components, hooks, types, and styles.
- **Services/**: All data fetching and business logic, organized by API resource (e.g., Pokemon, Type, Item).
- **Theme/**: Centralized color palettes, font definitions, and reusable theme utilities.
- **Assets/**: Static assets, including SVG icons, images, and fonts.
- **Utils/**: Shared utility functions (e.g., color helpers, formatters).

---

## Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) (v16+ recommended)
- [Yarn](https://yarnpkg.com/) or npm
- [Expo CLI](https://docs.expo.dev/get-started/installation/)

### Installation

1. **Clone the repository:**

   ```sh
   git clone https://github.com/yourusername/dexio.git
   cd dexio
   ```

2. **Install dependencies:**

   ```sh
   yarn install
   # or
   npm install
   ```

3. **Start the development server:**

   ```sh
   yarn start
   # or
   npm start
   ```

4. **Run on your device or emulator:**
   - Use the Expo Go app (iOS/Android) or an emulator/simulator.

---

## Development

### Folder & File Conventions

- **Feature-first:** Each major feature (e.g., Home, PokemonDetails) has its own folder with components, hooks, and styles.
- **Service layer:** All API/data logic is in `src/Services/`, following the user's preference for separation of concerns.
- **Reusable UI:** Common UI elements (e.g., type chips, stat bars) are modular and styled for consistency.
- **TypeScript:** The project uses TypeScript for type safety and maintainability.

### Adding a New Feature

1. Create a new folder in `src/Features/`.
2. Add components, hooks, and types as needed.
3. Register new screens in the navigation (if applicable).
4. Add data fetching logic in `src/Services/`.

### Theming

- Colors and fonts are defined in `src/Theme/`.
- Use theme utilities for consistent styling.

---

## Testing

- **Unit tests:** Located in `src/__tests__/`.
- **Run tests:**

  ```sh
  yarn test
  # or
  npm test
  ```

- **Jest** is used for testing configuration.

---

## Contributing

1. **Fork the repository** and create your branch from `main`.
2. **Commit your changes** with clear messages.
3. **Open a pull request** describing your changes and why they are needed.
4. **Follow the code style** and add tests for new features.

---

## License

This project is licensed under the MIT License. See [LICENSE](LICENSE) for details.

---

## Credits

- [PokéAPI](https://pokeapi.co/) for Pokémon data
- [Expo](https://expo.dev/) for the React Native platform
- Pokémon and Pokémon character names are trademarks of Nintendo, Game Freak, and The Pokémon Company.
