# Testing Strategy

[← Back to README](../README.md)

## Overview

Dexio maintains comprehensive test coverage with Jest and React Native Testing Library, ensuring code quality and reliability.

## Test Coverage Requirements

- **Unit Tests**: 80%+ coverage requirement
- **Integration Tests**: API service testing
- **Component Tests**: UI component validation
- **Performance Tests**: Memory and performance monitoring

## Test Structure

``` bash
src/__tests__/
├── Services/
│   ├── API/              # API service tests
│   └── Client/           # HTTP client tests
├── Components/           # UI component tests
├── Hooks/               # Custom hook tests
└── Utils/               # Utility function tests
```

## Running Tests

### Basic Commands

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

### Specific Test Suites

```bash
# Run specific test suites
yarn test Services/
yarn test Components/
yarn test Hooks/

# Run tests for specific files
yarn test Pokemon.test.ts
yarn test PokemonCard.test.tsx
```

## Test Configuration

### Jest Configuration

```javascript
// jest.config.js
module.exports = {
  preset: 'jest-expo',
  setupFilesAfterEnv: ['<rootDir>/src/__tests__/jest-setup.js'],
  collectCoverageFrom: [
    'src/**/*.{ts,tsx}',
    '!src/**/*.d.ts',
    '!src/__tests__/**',
  ],
  coverageThreshold: {
    global: {
      branches: 80,
      functions: 80,
      lines: 80,
      statements: 80,
    },
  },
};
```

### Test Setup

```typescript
// src/__tests__/jest-setup.js
import '@testing-library/jest-native/extend-expect';
import { server } from './mocks/server';

beforeAll(() => server.listen());
afterEach(() => server.resetHandlers());
afterAll(() => server.close());
```

## Testing Patterns

### Component Testing

```typescript
import { render, screen, fireEvent } from '@testing-library/react-native';
import { PokemonCard } from '../PokemonCard';

describe('PokemonCard', () => {
  it('renders pokemon information correctly', () => {
    const mockPokemon = {
      id: 25,
      name: 'pikachu',
      types: ['electric'],
      sprites: { front_default: 'test-url' },
    };

    render(<PokemonCard pokemon={mockPokemon} />);
    
    expect(screen.getByText('Pikachu')).toBeTruthy();
    expect(screen.getByText('Electric')).toBeTruthy();
  });

  it('handles press events', () => {
    const onPress = jest.fn();
    render(<PokemonCard pokemon={mockPokemon} onPress={onPress} />);
    
    fireEvent.press(screen.getByTestId('pokemon-card'));
    expect(onPress).toHaveBeenCalled();
  });
});
```

### API Service Testing

```typescript
import { pokemonAPI } from '../pokemonAPI';
import { server, rest } from '../../__tests__/mocks/server';

describe('PokemonAPI', () => {
  it('fetches pokemon by name', async () => {
    server.use(
      rest.get('https://pokeapi.co/api/v2/pokemon/pikachu', (req, res, ctx) => {
        return res(ctx.json(mockPokemonData));
      })
    );

    const result = await pokemonAPI.getPokemonByName('pikachu');
    expect(result.name).toBe('pikachu');
  });

  it('handles API errors gracefully', async () => {
    server.use(
      rest.get('https://pokeapi.co/api/v2/pokemon/invalid', (req, res, ctx) => {
        return res(ctx.status(404));
      })
    );

    await expect(pokemonAPI.getPokemonByName('invalid')).rejects.toThrow();
  });
});
```

### Hook Testing

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

## Mocking Strategy

### API Mocks

```typescript
// src/__tests__/mocks/handlers.ts
import { rest } from 'msw';

export const handlers = [
  rest.get('https://pokeapi.co/api/v2/pokemon/:name', (req, res, ctx) => {
    const { name } = req.params;
    return res(ctx.json(mockPokemonData[name]));
  }),
];
```

### Component Mocks

```typescript
// Mock external dependencies
jest.mock('react-native-reanimated', () => {
  return {
    ...jest.requireActual('react-native-reanimated/mock'),
  };
});

jest.mock('expo-linear-gradient', () => {
  return 'LinearGradient';
});
```

## Performance Testing

### Memory Leak Detection

```typescript
describe('Memory Management', () => {
  it('cleans up resources properly', () => {
    const { unmount } = render(<PokemonList />);
    
    // Simulate component unmount
    unmount();
    
    // Verify cleanup
    expect(mockCleanup).toHaveBeenCalled();
  });
});
```

### Render Performance

```typescript
describe('Render Performance', () => {
  it('renders large lists efficiently', () => {
    const startTime = performance.now();
    render(<PokemonGrid pokemonList={largePokemonList} />);
    const endTime = performance.now();
    
    expect(endTime - startTime).toBeLessThan(100); // 100ms threshold
  });
});
```

## Continuous Integration

### GitHub Actions

```yaml
# .github/workflows/test.yml
name: Tests
on: [push, pull_request]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - uses: actions/setup-node@v2
        with:
          node-version: '18'
      - run: yarn install
      - run: yarn test:ci
      - run: yarn test:coverage
```

### Coverage Reporting

- **Coverage Reports**: Generated for each PR
- **Coverage Thresholds**: Enforced at 80% minimum
- **Coverage Badges**: Updated automatically
- **Coverage Alerts**: Notifications for coverage drops

## Test Data Management

### Mock Data

```typescript
// src/__tests__/mocks/data/pokemon.ts
export const mockPokemonData = {
  pikachu: {
    id: 25,
    name: 'pikachu',
    types: [
      {
        slot: 1,
        type: { name: 'electric', url: 'https://pokeapi.co/api/v2/type/13/' }
      }
    ],
    sprites: {
      front_default: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/25.png'
    },
    stats: [
      { base_stat: 35, stat: { name: 'hp' } },
      { base_stat: 55, stat: { name: 'attack' } },
      { base_stat: 40, stat: { name: 'defense' } },
      { base_stat: 50, stat: { name: 'special-attack' } },
      { base_stat: 50, stat: { name: 'special-defense' } },
      { base_stat: 90, stat: { name: 'speed' } }
    ]
  }
};
```

### Test Utilities

```typescript
// src/__tests__/utils/test-utils.tsx
import React from 'react';
import { render } from '@testing-library/react-native';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

const createTestQueryClient = () => new QueryClient({
  defaultOptions: {
    queries: { retry: false },
    mutations: { retry: false },
  },
});

export const renderWithProviders = (ui: React.ReactElement) => {
  const queryClient = createTestQueryClient();
  
  return render(
    <QueryClientProvider client={queryClient}>
      {ui}
    </QueryClientProvider>
  );
};
```

## Best Practices

### Test Organization

- **Group related tests**: Use describe blocks for logical grouping
- **Clear test names**: Use descriptive test names that explain the behavior
- **Arrange-Act-Assert**: Follow the AAA pattern for test structure
- **Single responsibility**: Each test should test one specific behavior

### Test Maintenance

- **Keep tests simple**: Avoid complex test logic
- **Use meaningful assertions**: Make assertions that clearly show intent
- **Avoid test interdependence**: Tests should be independent of each other
- **Regular updates**: Keep tests updated with code changes

### Performance Considerations

- **Mock heavy operations**: Mock API calls and expensive operations
- **Use test data**: Create realistic but minimal test data
- **Avoid unnecessary renders**: Only render what's needed for the test
- **Clean up resources**: Properly clean up after tests
