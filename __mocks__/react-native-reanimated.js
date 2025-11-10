// Mock for react-native-reanimated.
// This mock is forced by 'moduleNameMapper' in package.json to prevent 
// React Navigation from crashing Jest tests due to missing native code.

module.exports = {
  // Required by @react-navigation/elements
  createAnimatedComponent: (Component) => Component, 

  // Basic mock for common Reanimated hooks/functions
  useSharedValue: (init) => ({ value: init }),
  useAnimatedStyle: (style) => style,
  useDerivedValue: (callback) => ({ value: callback() }),
  withTiming: (toValue) => toValue,
  
  // Mock Animated Components
  View: 'View',
  Text: 'Text',
  ScrollView: 'ScrollView',
};