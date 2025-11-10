// Mock AsyncStorage para evitar errores nativos
jest.mock('@react-native-async-storage/async-storage', () =>
  require('@react-native-async-storage/async-storage/jest/async-storage-mock')
);

// Mock de expo-constants para evitar undefined en supabase.js
jest.mock('expo-constants', () => ({
  expoConfig: {
    extra: {
      supabaseUrl: 'https://test.supabase.co',
      supabaseAnonKey: 'anon-test-key',
    },
  },
}));

// --- Mocks para React Native APIs y React Navigation ---

// 1. Mock para React Native: Se reemplaza la implementación para evitar que
//    se carguen módulos nativos de desarrollo (como DevMenu) y se resuelven
//    problemas de 'TurboModuleRegistry' y 'getConstants'.
jest.mock('react-native', () => ({
  // Core Components Mocks: Todos los componentes deben ser mockeados
  View: 'View',
  Text: 'Text',
  Image: 'Image',
  Button: 'Button',
  TextInput: 'TextInput',
  FlatList: 'FlatList',
  ScrollView: 'ScrollView',
  SafeAreaView: 'SafeAreaView', // Para resolver la advertencia de deprecación
  
  StyleSheet: { create: jest.fn(obj => obj) },
  
  // Platform Mock
  Platform: {
    OS: 'ios',
    select: jest.fn(obj => obj.ios || obj.default),
  },

  // I18nManager Mock
  I18nManager: {
    isRTL: false,
    allowRTL: jest.fn(),
    forceRTL: jest.fn(),
    swapLeftAndRightInRTL: jest.fn(),
  },
  
  // NativeModules Mock (Crucial para DevMenu, TurboModuleRegistry, y Gestures)
  NativeModules: {
    // Mock para DevMenu (TurboModuleRegistry error)
    DevMenu: { getConstants: jest.fn(() => ({})) }, 
    
    // Mock para RNGestureHandlerModule (Navigation dependency)
    RNGestureHandlerModule: {
      attachHasteEvent: jest.fn(),
      createGestureHandler: jest.fn(),
      dropGestureHandler: jest.fn(),
      updateGestureHandler: jest.fn(),
      get: jest.fn(() => ({})), 
      getConstants: jest.fn(() => ({})),
    },
    
    // Otros módulos problemáticos
    PlatformConstants: { getConstants: jest.fn(() => ({})) },
    UIManager: { getConstants: jest.fn(() => ({})) },
    JSEngine: { getConstants: jest.fn(() => ({})) },
    // Mocks para las advertencias de deprecación
    Clipboard: { getString: jest.fn(), setString: jest.fn() },
    ProgressBarAndroid: { isAvailable: true },
  },
  
}));


// 2. Mock para react-native-safe-area-context, esencial para React Navigation
jest.mock('react-native-safe-area-context', () => ({
  useSafeAreaInsets: () => ({ top: 0, right: 0, bottom: 0, left: 0 }),
  SafeAreaProvider: ({ children }) => children,
}));

// 3. Mock para react-native-screens
// Nota: Aquí NO usamos requireActual para evitar problemas
jest.mock('react-native-screens', () => ({
  enableScreens: jest.fn(),
}));

// 4. Mock para react-native-gesture-handler
jest.mock('react-native-gesture-handler', () => {
  const View = 'View'; 
  return {
    GestureHandlerRootView: View,
  };
});