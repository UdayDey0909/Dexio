import "react-native-gesture-handler/jestSetup";
import "@testing-library/jest-native/extend-expect";

// Mock React Native modules that aren't available in Jest
jest.mock("react-native/Libraries/EventEmitter/NativeEventEmitter");

// Mock AsyncStorage
jest.mock("@react-native-async-storage/async-storage", () =>
   require("@react-native-async-storage/async-storage/jest/async-storage-mock")
);

// Mock MMKV
jest.mock("react-native-mmkv", () => ({
   MMKV: jest.fn(() => ({
      set: jest.fn(),
      getString: jest.fn(),
      getNumber: jest.fn(),
      getBoolean: jest.fn(),
      delete: jest.fn(),
      getAllKeys: jest.fn(() => []),
      clearAll: jest.fn(),
   })),
}));

// Mock React Native Device Info
jest.mock("react-native-device-info", () => ({
   getVersion: jest.fn(() => "1.0.0"),
   getBuildNumber: jest.fn(() => "1"),
   getUniqueId: jest.fn(() => "test-device-id"),
   isEmulator: jest.fn(() => Promise.resolve(false)),
}));

// Mock React Native NetInfo
jest.mock("@react-native-community/netinfo", () => ({
   addEventListener: jest.fn(),
   useNetInfo: jest.fn(() => ({
      isConnected: true,
      isInternetReachable: true,
   })),
}));

// Mock React Native Orientation Locker
jest.mock("react-native-orientation-locker", () => ({
   lockToPortrait: jest.fn(),
   lockToLandscape: jest.fn(),
   unlockAllOrientations: jest.fn(),
   getOrientation: jest.fn(),
}));

// Mock React Native Vector Icons
jest.mock("react-native-vector-icons/Ionicons", () => "Icon");

// Mock React Native Linear Gradient
jest.mock("react-native-linear-gradient", () => "LinearGradient");

// Mock React Native SVG
jest.mock("react-native-svg", () => ({
   Svg: "Svg",
   Path: "Path",
   Circle: "Circle",
   Rect: "Rect",
   G: "G",
}));

// Mock Expo modules
jest.mock("expo-font", () => ({
   loadAsync: jest.fn(),
   isLoaded: jest.fn(() => true),
}));

jest.mock("expo-image", () => ({
   Image: "Image",
}));

jest.mock("expo-linking", () => ({
   openURL: jest.fn(),
   createURL: jest.fn(),
}));

jest.mock("expo-splash-screen", () => ({
   hideAsync: jest.fn(),
   preventAutoHideAsync: jest.fn(),
}));

// Mock React Navigation
jest.mock("@react-navigation/native", () => ({
   useNavigation: jest.fn(() => ({
      navigate: jest.fn(),
      goBack: jest.fn(),
      dispatch: jest.fn(),
   })),
   useRoute: jest.fn(() => ({
      params: {},
   })),
   useFocusEffect: jest.fn(),
   NavigationContainer: ({ children }: { children: React.ReactNode }) =>
      children,
}));

// Clean setup and teardown
beforeEach(() => {
   // Clear all timers and mocks before each test
   jest.clearAllTimers();
   jest.clearAllMocks();
});

afterEach(() => {
   // Restore all mocks after each test
   jest.restoreAllMocks();
});

// Global test timeout (optional)
jest.setTimeout(10000);

// Suppress specific console warnings during tests (optional)
const originalWarn = console.warn;
const originalError = console.error;

beforeAll(() => {
   console.warn = jest.fn();
   console.error = jest.fn();
});

afterAll(() => {
   console.warn = originalWarn;
   console.error = originalError;
});
