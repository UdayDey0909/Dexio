# Contributing to Dexio

[← Back to README](README.md)

Thank you for your interest in contributing to Dexio! This document provides comprehensive guidelines for contributing to the project.

## Table of Contents

- [Getting Started](#getting-started)
- [Development Setup](#development-setup)
- [Code Standards](#code-standards)
- [Git Workflow](#git-workflow)
- [Testing Guidelines](#testing-guidelines)
- [Pull Request Process](#pull-request-process)
- [Code Review Guidelines](#code-review-guidelines)
- [Issue Reporting](#issue-reporting)
- [Feature Requests](#feature-requests)
- [Community Guidelines](#community-guidelines)

## Getting Started

### Prerequisites

Before contributing, ensure you have the following installed:

- **Node.js** 16+ (LTS recommended)
- **Yarn** or **npm**
- **Expo CLI** (`npm install -g @expo/cli`)
- **Git** for version control
- **VS Code** (recommended) with extensions

### Required VS Code Extensions

```json
{
  "recommendations": [
    "ms-vscode.vscode-typescript-next",
    "esbenp.prettier-vscode",
    "ms-vscode.vscode-eslint",
    "ms-vscode.vscode-jest",
    "bradlc.vscode-tailwindcss"
  ]
}
```

## Development Setup

### 1. Fork and Clone

```bash
# Fork the repository on GitHub
# Then clone your fork
git clone https://github.com/YOUR_USERNAME/Dexio.git
cd Dexio

# Add the original repository as upstream
git remote add upstream https://github.com/UdayDey0909/Dexio.git
```

### 2. Install Dependencies

```bash
# Install dependencies
yarn install

# Verify installation
yarn start
```

### 3. Environment Setup

```bash
# Create environment file (if needed)
cp .env.example .env

# Install platform-specific dependencies
# For iOS (macOS only)
cd ios && pod install && cd ..

# For Android
# Ensure Android SDK is properly configured
```

### 4. Verify Setup

```bash
# Run tests to ensure everything works
yarn test

# Start development server
yarn start

# Run on specific platforms
yarn ios      # iOS Simulator
yarn android  # Android Emulator
yarn web      # Web browser
```

## Code Standards

### TypeScript Guidelines

- **Strict Mode**: All TypeScript strict checks must be enabled
- **Type Safety**: 100% typed codebase - no `any` types
- **Interface Definitions**: All APIs must have proper TypeScript interfaces
- **Generic Types**: Use generics for reusable components and functions

```typescript
// ✅ Good
interface PokemonCardProps {
  pokemon: Pokemon;
  onPress?: (pokemon: Pokemon) => void;
  variant?: 'default' | 'compact';
}

// ❌ Bad
interface PokemonCardProps {
  pokemon: any;
  onPress?: any;
  variant?: any;
}
```

### Code Style

#### Naming Conventions

```typescript
// Components: PascalCase
const PokemonCard = () => {};

// Hooks: camelCase with 'use' prefix
const usePokemon = () => {};

// Files: PascalCase for components, camelCase for utilities
// PokemonCard.tsx, usePokemon.ts

// Constants: UPPER_SNAKE_CASE
const API_BASE_URL = 'https://pokeapi.co/api/v2';

// Variables and functions: camelCase
const pokemonList = [];
const fetchPokemon = () => {};
```

#### Import Order

```typescript
// 1. React imports
import React from 'react';
import { View, Text } from 'react-native';

// 2. Third-party libraries
import { useQuery } from '@tanstack/react-query';
import { FlashList } from '@shopify/flash-list';

// 3. Internal imports (relative paths)
import { PokemonCard } from '../Components/PokemonCard';
import { usePokemon } from '../Hooks/usePokemon';

// 4. Type imports
import type { Pokemon } from '../Types';
```

### ESLint Configuration

The project uses strict ESLint rules. Ensure your code passes all linting checks:

```bash
# Check for linting issues
yarn lint

# Auto-fix linting issues
yarn lint:fix
```

### Prettier Formatting

All code must be formatted with Prettier:

```bash
# Format all files
yarn format

# Check formatting
yarn format:check
```

## Git Workflow

### Branch Naming Convention

```bash
# Feature branches
feature/amazing-feature
feature/pokemon-search
feature/battle-calculator

# Bug fix branches
bugfix/fix-navigation
bugfix/resolve-memory-leak
bugfix/api-error-handling

# Hotfix branches
hotfix/critical-crash
hotfix/security-vulnerability

# Documentation branches
docs/update-readme
docs/api-documentation

# Refactoring branches
refactor/improve-performance
refactor/component-structure
```

### Commit Message Format

Follow the [Conventional Commits](https://www.conventionalcommits.org/) specification:

``` bash
type(scope): description

[optional body]

[optional footer(s)]
```

#### Commit Types

- **feat**: A new feature
- **fix**: A bug fix
- **docs**: Documentation only changes
- **style**: Changes that do not affect the meaning of the code
- **refactor**: A code change that neither fixes a bug nor adds a feature
- **perf**: A code change that improves performance
- **test**: Adding missing tests or correcting existing tests
- **chore**: Changes to the build process or auxiliary tools

#### Examples

```bash
# Feature commit
git commit -m "feat(pokemon): add evolution chain display"

# Bug fix commit
git commit -m "fix(navigation): resolve tab switching issue"

# Documentation commit
git commit -m "docs(readme): update installation instructions"

# Refactoring commit
git commit -m "refactor(api): optimize Pokemon service queries"

# Test commit
git commit -m "test(components): add PokemonCard unit tests"
```

### Branch Management

```bash
# Always start from main branch
git checkout main
git pull upstream main

# Create feature branch
git checkout -b feature/amazing-feature

# Make your changes and commit
git add .
git commit -m "feat(scope): description"

# Push to your fork
git push origin feature/amazing-feature
```

## Testing Guidelines

### Test Requirements

- **Unit Tests**: 80%+ coverage for all new code
- **Integration Tests**: API service and data flow testing
- **Component Tests**: UI component validation
- **Performance Tests**: Memory and performance monitoring

### Running Tests

```bash
# Run all tests
yarn test

# Run tests with coverage
yarn test:coverage

# Run specific test suites
yarn test src/Features/NewFeature/

# Run tests in watch mode
yarn test:watch

# Debug tests
yarn test:debug
```

### Writing Tests

#### Component Testing

```typescript
import { render, screen, fireEvent } from '@testing-library/react-native';
import { PokemonCard } from '../PokemonCard';

describe('PokemonCard', () => {
  const mockPokemon = {
    id: 25,
    name: 'pikachu',
    types: ['electric'],
    sprites: { front_default: 'test-url' },
  };

  it('renders pokemon information correctly', () => {
    render(<PokemonCard pokemon={mockPokemon} />);
    
    expect(screen.getByText('Pikachu')).toBeTruthy();
    expect(screen.getByText('Electric')).toBeTruthy();
  });

  it('handles press events', () => {
    const onPress = jest.fn();
    render(<PokemonCard pokemon={mockPokemon} onPress={onPress} />);
    
    fireEvent.press(screen.getByTestId('pokemon-card'));
    expect(onPress).toHaveBeenCalledWith(mockPokemon);
  });
});
```

#### Hook Testing

```typescript
import { renderHook, waitFor } from '@testing-library/react-hooks';
import { usePokemon } from '../usePokemon';

describe('usePokemon', () => {
  it('fetches pokemon data', async () => {
    const { result } = renderHook(() => usePokemon('pikachu'));

    expect(result.current.isLoading).toBe(true);

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    expect(result.current.data?.name).toBe('pikachu');
  });
});
```

## Pull Request Process

### Before Submitting a PR

1. **Ensure tests pass**: Run `yarn test` and ensure all tests pass
2. **Check coverage**: Run `yarn test:coverage` and ensure 80%+ coverage
3. **Lint code**: Run `yarn lint` and fix any issues
4. **Format code**: Run `yarn format` to ensure consistent formatting
5. **Update documentation**: Update relevant documentation if needed

### PR Checklist

- [ ] **Tests Pass**: All tests passing
- [ ] **Coverage Maintained**: 80%+ test coverage
- [ ] **TypeScript**: No type errors
- [ ] **Linting**: ESLint passes
- [ ] **Formatting**: Prettier formatting applied
- [ ] **Documentation**: Code properly documented
- [ ] **Performance**: No performance regressions
- [ ] **Accessibility**: Accessibility features implemented
- [ ] **Cross-platform**: Works on iOS, Android, and Web

### PR Template

```markdown
## Description

Brief description of the changes made.

## Type of Change

- [ ] Bug fix (non-breaking change which fixes an issue)
- [ ] New feature (non-breaking change which adds functionality)
- [ ] Breaking change (fix or feature that would cause existing functionality to not work as expected)
- [ ] Documentation update

## Testing

- [ ] Unit tests added/updated
- [ ] Integration tests added/updated
- [ ] Manual testing completed

## Screenshots (if applicable)

Add screenshots to help explain your changes.

## Checklist

- [ ] My code follows the style guidelines of this project
- [ ] I have performed a self-review of my own code
- [ ] I have commented my code, particularly in hard-to-understand areas
- [ ] I have made corresponding changes to the documentation
- [ ] My changes generate no new warnings
- [ ] I have added tests that prove my fix is effective or that my feature works
- [ ] New and existing unit tests pass locally with my changes
```

## Code Review Guidelines

### Review Process

1. **Automated Checks**: CI/CD pipeline runs tests, linting, and formatting
2. **Code Review**: At least one maintainer must approve the PR
3. **Testing**: Ensure all tests pass and coverage is maintained
4. **Documentation**: Verify documentation is updated if needed

### Review Criteria

- **Code Quality**: Clean, readable, maintainable code
- **Architecture**: Follows established patterns and conventions
- **Testing**: Adequate test coverage and quality
- **Documentation**: Clear comments and documentation
- **Performance**: No unnecessary performance impacts
- **Security**: No security vulnerabilities introduced
- **Accessibility**: Accessibility features implemented

### Review Comments

When reviewing code, use constructive feedback:

```markdown
# ✅ Good feedback
This is a great approach! Consider adding a comment here to explain the logic.

# ❌ Poor feedback
This is wrong. Fix it.
```

## Issue Reporting

### Bug Reports

When reporting bugs, please include:

1. **Clear description**: What happened vs. what was expected
2. **Steps to reproduce**: Detailed steps to reproduce the issue
3. **Environment**: OS, device, app version, etc.
4. **Screenshots**: Visual evidence if applicable
5. **Console logs**: Error messages and stack traces

### Bug Report Template

```markdown
## Bug Description

Brief description of the bug.

## Steps to Reproduce

1. Go to '...'
2. Click on '...'
3. Scroll down to '...'
4. See error

## Expected Behavior

What you expected to happen.

## Actual Behavior

What actually happened.

## Environment

- OS: [e.g. iOS 15, Android 12, Windows 11]
- Device: [e.g. iPhone 13, Samsung Galaxy S21]
- App Version: [e.g. 1.0.0]
- Platform: [e.g. iOS, Android, Web]

## Screenshots

If applicable, add screenshots to help explain your problem.

## Additional Context

Add any other context about the problem here.
```

## Feature Requests

### Feature Request Guidelines

1. **Clear description**: What feature you want and why
2. **Use cases**: How the feature would be used
3. **Mockups**: Visual mockups if applicable
4. **Priority**: How important the feature is

### Feature Request Template

```markdown
## Feature Description

Brief description of the feature request.

## Problem Statement

What problem does this feature solve?

## Proposed Solution

How would you like this feature to work?

## Use Cases

- Use case 1
- Use case 2
- Use case 3

## Mockups/Screenshots

If applicable, add mockups or screenshots.

## Priority

- [ ] High (blocking)
- [ ] Medium (important)
- [ ] Low (nice to have)

## Additional Context

Add any other context or information here.
```

## Community Guidelines

### Code of Conduct

We are committed to providing a welcoming and inclusive environment for all contributors. Please:

- **Be respectful**: Treat all contributors with respect
- **Be constructive**: Provide constructive feedback
- **Be inclusive**: Welcome contributors from all backgrounds
- **Be patient**: Understand that contributors have different experience levels

### Communication

- **GitHub Issues**: Use for bug reports and feature requests
- **GitHub Discussions**: Use for general questions and discussions
- **Pull Requests**: Use for code contributions
- **Discord/Slack**: Use for real-time communication (if available)

### Getting Help

If you need help:

1. **Check documentation**: Review the [README](README.md) and [Docs](Docs/)
2. **Search issues**: Check if your question has been answered before
3. **Create an issue**: If you can't find an answer, create a new issue
4. **Join discussions**: Participate in GitHub Discussions

## Recognition

### Contributors

All contributors will be recognized in:

- **README.md**: Contributors section
- **GitHub**: Contributors tab
- **Release notes**: Credit for significant contributions

### Contribution Levels

- **Bronze**: 1-5 contributions
- **Silver**: 6-15 contributions
- **Gold**: 16+ contributions
- **Platinum**: Core maintainer level

## Questions?

If you have any questions about contributing, please:

1. Check the [documentation](Docs/)
2. Search existing [issues](https://github.com/UdayDey0909/Dexio/issues)
3. Create a new [issue](https://github.com/UdayDey0909/Dexio/issues/new)

Thank you for contributing to Dexio! 🎉
