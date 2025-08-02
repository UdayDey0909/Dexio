# Design System

[← Back to README](../README.md)

## Overview

Dexio's design system is built around Pokémon aesthetics, providing a cohesive and accessible user experience across all platforms. The system includes comprehensive theming, component libraries, and design tokens.

## Theme Features

### Light/Dark Mode

- **Automatic Switching**: System-based theme detection
- **Manual Override**: User preference settings
- **Smooth Transitions**: Animated theme switching
- **Consistent Colors**: Maintained contrast ratios

### Pokémon Colors

- **Authentic Type Colors**: Official Pokémon type color palette
- **Dynamic Theming**: Type-based color schemes
- **Accessibility**: WCAG compliant color combinations
- **Brand Consistency**: Pokémon universe aesthetics

### Responsive Design

- **Cross-Platform**: Optimized for iOS, Android, and Web
- **Screen Adaptability**: Responsive layouts for all screen sizes
- **Orientation Support**: Portrait and landscape layouts
- **Device Optimization**: Platform-specific optimizations

## Color System

### Primary Colors

```typescript
// src/Theme/Core/Colors.ts
export const Colors = {
  // Primary brand colors
  primary: '#FF6B6B',
  secondary: '#4ECDC4',
  accent: '#45B7D1',
  
  // Background colors
  background: {
    light: '#FFFFFF',
    dark: '#1A1A1A',
    card: {
      light: '#F8F9FA',
      dark: '#2D2D2D',
    },
  },
  
  // Text colors
  text: {
    light: {
      primary: '#2C3E50',
      secondary: '#6C757D',
      disabled: '#ADB5BD',
    },
    dark: {
      primary: '#F8F9FA',
      secondary: '#CED4DA',
      disabled: '#6C757D',
    },
  },
  
  // Status colors
  status: {
    success: '#28A745',
    warning: '#FFC107',
    error: '#DC3545',
    info: '#17A2B8',
  },
};
```

### Pokémon Type Colors

```typescript
// Pokémon type color palette
export const TypeColors = {
  normal: '#A8A878',
  fire: '#F08030',
  water: '#6890F0',
  electric: '#F8D030',
  grass: '#78C850',
  ice: '#98D8D8',
  fighting: '#C03028',
  poison: '#A040A0',
  ground: '#E0C068',
  flying: '#A890F0',
  psychic: '#F85888',
  bug: '#A8B820',
  rock: '#B8A038',
  ghost: '#705898',
  dragon: '#7038F8',
  dark: '#705848',
  steel: '#B8B8D0',
  fairy: '#EE99AC',
};
```

## Typography

### Font System

```typescript
// src/Theme/Fonts.ts
export const Fonts = {
  // Font families
  family: {
    regular: 'Poppins-Regular',
    medium: 'Poppins-Medium',
    semiBold: 'Poppins-SemiBold',
    bold: 'Poppins-Bold',
    light: 'Lato-Light',
    lightItalic: 'Lato-LightItalic',
  },
  
  // Font sizes
  size: {
    xs: 12,
    sm: 14,
    base: 16,
    lg: 18,
    xl: 20,
    '2xl': 24,
    '3xl': 30,
    '4xl': 36,
    '5xl': 48,
  },
  
  // Line heights
  lineHeight: {
    tight: 1.25,
    normal: 1.5,
    relaxed: 1.75,
  },
  
  // Font weights
  weight: {
    light: '300',
    normal: '400',
    medium: '500',
    semiBold: '600',
    bold: '700',
  },
};
```

### Text Styles

```typescript
// Predefined text styles
export const TextStyles = {
  heading: {
    fontFamily: Fonts.family.bold,
    fontSize: Fonts.size['3xl'],
    lineHeight: Fonts.lineHeight.tight,
  },
  
  subheading: {
    fontFamily: Fonts.family.semiBold,
    fontSize: Fonts.size.xl,
    lineHeight: Fonts.lineHeight.normal,
  },
  
  body: {
    fontFamily: Fonts.family.regular,
    fontSize: Fonts.size.base,
    lineHeight: Fonts.lineHeight.relaxed,
  },
  
  caption: {
    fontFamily: Fonts.family.light,
    fontSize: Fonts.size.sm,
    lineHeight: Fonts.lineHeight.normal,
  },
};
```

## Spacing System

### Spacing Scale

```typescript
// Consistent spacing scale
export const Spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  '2xl': 48,
  '3xl': 64,
  '4xl': 96,
};
```

### Layout Constants

```typescript
// Layout and dimension constants
export const Layout = {
  // Screen dimensions
  screen: {
    padding: Spacing.md,
    margin: Spacing.sm,
  },
  
  // Component spacing
  component: {
    padding: Spacing.sm,
    margin: Spacing.xs,
    borderRadius: 8,
  },
  
  // Card spacing
  card: {
    padding: Spacing.md,
    margin: Spacing.sm,
    borderRadius: 12,
    shadow: {
      offset: { width: 0, height: 2 },
      opacity: 0.1,
      radius: 4,
    },
  },
};
```

## Component Library

### Button Components

```typescript
// src/Components/Button/Button.tsx
interface ButtonProps {
  variant: 'primary' | 'secondary' | 'outline' | 'ghost';
  size: 'sm' | 'md' | 'lg';
  disabled?: boolean;
  loading?: boolean;
  onPress: () => void;
  children: React.ReactNode;
}

export const Button: React.FC<ButtonProps> = ({
  variant,
  size,
  disabled,
  loading,
  onPress,
  children,
}) => {
  const buttonStyle = getButtonStyle(variant, size, disabled);
  
  return (
    <TouchableOpacity
      style={buttonStyle}
      onPress={onPress}
      disabled={disabled || loading}
    >
      {loading ? <LoadingSpinner /> : children}
    </TouchableOpacity>
  );
};
```

### Card Components

```typescript
// src/Components/Card/Card.tsx
interface CardProps {
  variant: 'default' | 'elevated' | 'outlined';
  padding?: keyof typeof Spacing;
  children: React.ReactNode;
}

export const Card: React.FC<CardProps> = ({
  variant,
  padding = 'md',
  children,
}) => {
  const cardStyle = getCardStyle(variant, padding);
  
  return (
    <View style={cardStyle}>
      {children}
    </View>
  );
};
```

## Animation System

### Transition Animations

```typescript
// Animation constants
export const Animations = {
  duration: {
    fast: 150,
    normal: 300,
    slow: 500,
  },
  
  easing: {
    ease: 'ease',
    easeIn: 'ease-in',
    easeOut: 'ease-out',
    easeInOut: 'ease-in-out',
  },
  
  scale: {
    small: 0.95,
    medium: 0.9,
    large: 0.8,
  },
};
```

### Animation Hooks

```typescript
// Custom animation hooks
export const usePressAnimation = () => {
  const scale = useSharedValue(1);
  
  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));
  
  const handlePressIn = () => {
    scale.value = withSpring(0.95, { duration: 100 });
  };
  
  const handlePressOut = () => {
    scale.value = withSpring(1, { duration: 100 });
  };
  
  return { animatedStyle, handlePressIn, handlePressOut };
};
```

## Theme Context

### Theme Provider

```typescript
// src/Theme/ThemeContext.tsx
interface ThemeContextType {
  theme: Theme;
  isDark: boolean;
  toggleTheme: () => void;
  setTheme: (theme: 'light' | 'dark' | 'system') => void;
}

export const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [themeMode, setThemeMode] = useState<'light' | 'dark' | 'system'>('system');
  const [isDark, setIsDark] = useState(false);
  
  const theme = useMemo(() => getTheme(isDark), [isDark]);
  
  const toggleTheme = useCallback(() => {
    setThemeMode(prev => prev === 'light' ? 'dark' : 'light');
  }, []);
  
  const setTheme = useCallback((mode: 'light' | 'dark' | 'system') => {
    setThemeMode(mode);
  }, []);
  
  return (
    <ThemeContext.Provider value={{ theme, isDark, toggleTheme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};
```

### Theme Hook

```typescript
// Custom theme hook
export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};
```

## Accessibility

### Accessibility Features

```typescript
// Accessibility utilities
export const Accessibility = {
  // Screen reader labels
  labels: {
    pokemonCard: (name: string) => `${name} Pokémon card`,
    typeChip: (type: string) => `${type} type`,
    statBar: (stat: string, value: number) => `${stat}: ${value}`,
  },
  
  // Focus management
  focus: {
    first: 'first',
    last: 'last',
    next: 'next',
    previous: 'previous',
  },
  
  // Reduced motion
  reducedMotion: {
    duration: 0,
    easing: 'linear',
  },
};
```

### Accessibility Components

```typescript
// Accessible button component
export const AccessibleButton: React.FC<ButtonProps> = ({
  accessibilityLabel,
  accessibilityHint,
  ...props
}) => {
  return (
    <TouchableOpacity
      accessible={true}
      accessibilityLabel={accessibilityLabel}
      accessibilityHint={accessibilityHint}
      accessibilityRole="button"
      {...props}
    />
  );
};
```

## Customization

### Theme Customization

```typescript
// Custom theme creation
export const createCustomTheme = (overrides: Partial<Theme>): Theme => {
  return {
    ...defaultTheme,
    ...overrides,
    colors: {
      ...defaultTheme.colors,
      ...overrides.colors,
    },
  };
};

// Usage example
const customTheme = createCustomTheme({
  colors: {
    primary: '#FF0000',
    secondary: '#00FF00',
  },
});
```

### Component Customization

```typescript
// Component style customization
export const createComponentStyles = (
  theme: Theme,
  customStyles?: StyleSheet.NamedStyles<any>
) => {
  return StyleSheet.create({
    ...getDefaultStyles(theme),
    ...customStyles,
  });
};
```

## Design Tokens

### Token System

```typescript
// Design tokens
export const Tokens = {
  // Colors
  colors: {
    brand: {
      primary: '#FF6B6B',
      secondary: '#4ECDC4',
      accent: '#45B7D1',
    },
    semantic: {
      success: '#28A745',
      warning: '#FFC107',
      error: '#DC3545',
      info: '#17A2B8',
    },
  },
  
  // Typography
  typography: {
    fontSizes: [12, 14, 16, 18, 20, 24, 30, 36, 48],
    fontWeights: [300, 400, 500, 600, 700],
    lineHeights: [1.25, 1.5, 1.75],
  },
  
  // Spacing
  spacing: [4, 8, 16, 24, 32, 48, 64, 96],
  
  // Border radius
  borderRadius: [4, 8, 12, 16, 24],
  
  // Shadows
  shadows: {
    small: { offset: { width: 0, height: 1 }, opacity: 0.05, radius: 2 },
    medium: { offset: { width: 0, height: 2 }, opacity: 0.1, radius: 4 },
    large: { offset: { width: 0, height: 4 }, opacity: 0.15, radius: 8 },
  },
};
```

## Best Practices

### Design Principles

- **Consistency**: Use consistent spacing, typography, and colors
- **Accessibility**: Ensure WCAG compliance and screen reader support
- **Performance**: Optimize animations and transitions
- **Scalability**: Design for multiple screen sizes and orientations

### Component Guidelines

- **Single Responsibility**: Each component should have one clear purpose
- **Composition**: Build complex components from simple ones
- **Props Interface**: Define clear and typed props interfaces
- **Default Values**: Provide sensible defaults for optional props

### Theme Guidelines

- **Semantic Naming**: Use semantic names for colors and values
- **Token System**: Use design tokens for consistency
- **Dark Mode**: Ensure proper contrast in both light and dark modes
- **Platform Adaptation**: Adapt to platform-specific design patterns
