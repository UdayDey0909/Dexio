# Theme System

This directory contains the complete theme system for the Dexio app, supporting both light and dark modes with system preference detection.

## Features

- 🌓 **Light/Dark Mode Support**: Complete theme switching between light and dark modes
- 🔄 **System Preference**: Automatically follows the device's system theme preference
- 💾 **Persistent Storage**: Theme preferences are saved and restored between app sessions
- 🎨 **Comprehensive Colors**: Full color palette for backgrounds, text, borders, and UI elements
- 🎯 **TypeScript Support**: Fully typed theme system for better development experience

## Usage

### Basic Theme Usage

```tsx
import { useTheme } from '@/Theme';

const MyComponent = () => {
  const { theme, isDark, themeMode, setThemeMode } = useTheme();
  
  return (
    <View style={{ backgroundColor: theme.background.primary }}>
      <Text style={{ color: theme.text.primary }}>
        Hello World
      </Text>
    </View>
  );
};
```

### Theme Toggle Component

```tsx
import { ThemeToggle } from '@/Theme';

const SettingsScreen = () => {
  return (
    <View>
      <ThemeToggle />
    </View>
  );
};
```

### Available Theme Properties

#### Background Colors
- `theme.background.primary` - Main screen backgrounds
- `theme.background.secondary` - Section backgrounds, sidebars
- `theme.background.card` - Card/item backgrounds
- `theme.background.overlay` - Modal overlays, tooltips

#### Text Colors
- `theme.text.primary` - Main text (headings, body)
- `theme.text.secondary` - Less important text
- `theme.text.muted` - Placeholder text, captions
- `theme.text.inverse` - Text on dark backgrounds
- `theme.text.light` - Text on colored backgrounds
- `theme.text.dark` - High contrast text when needed

#### Border Colors
- `theme.border.light` - Subtle borders, dividers
- `theme.border.medium` - More prominent borders, input fields

#### Other Colors
- `theme.primary` - Main brand color (buttons, links)
- `theme.accent` - Highlights, notifications
- `theme.types` - All 18 Pokemon type colors
- `theme.system` - Error, warning, success, info colors

### Theme Modes

- `'light'` - Light mode (default)
- `'dark'` - Dark mode

### Theme Context Properties

- `theme` - Current theme object with all colors
- `isDark` - Boolean indicating if dark mode is active
- `themeMode` - Current theme mode ('light' | 'dark')
- `setThemeMode` - Function to change theme mode

## File Structure

```
src/Theme/
├── Core/
│   ├── Colors.ts          # Base color definitions
│   ├── Variants.ts        # Light and dark theme variants
│   └── Index.ts           # Core exports
├── ThemeContext.tsx       # Theme context and provider
├── ThemeStorage.ts        # AsyncStorage utilities
├── ThemeToggle.tsx        # Theme toggle component
├── Fonts.ts              # Font definitions
└── index.ts              # Main theme exports
```

## Setup

The theme system is automatically set up in the app root layout (`src/app/_layout.tsx`):

```tsx
import { ThemeProvider } from "@/Theme";

export default function RootLayout() {
  return (
    <ThemeProvider>
      <Stack screenOptions={{ headerShown: false }} />
    </ThemeProvider>
  );
}
```

## Best Practices

1. **Always use the theme context**: Don't hardcode colors, use `useTheme()` hook
2. **Use semantic color names**: Use `theme.text.primary` instead of specific hex values
3. **Test both themes**: Ensure your components look good in both light and dark modes
4. **Consider contrast**: Make sure text has sufficient contrast against backgrounds
5. **Use the toggle component**: Provide users with an easy way to change themes

## Migration Guide

To migrate existing components to use the theme system:

1. Import the theme hook: `import { useTheme } from '@/Theme';`
2. Replace hardcoded colors with theme properties
3. Remove static color imports from `@/Theme/Core/Variants`
4. Test in both light and dark modes

Example migration:
```tsx
// Before
import { lightThemeColors } from '@/Theme/Core/Variants';
<View style={{ backgroundColor: lightThemeColors.background.primary }}>

// After  
import { useTheme } from '@/Theme';
const { theme } = useTheme();
<View style={{ backgroundColor: theme.background.primary }}>
``` 