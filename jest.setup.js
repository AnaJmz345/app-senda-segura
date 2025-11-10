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
