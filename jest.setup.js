import '@testing-library/jest-native/extend-expect';
import 'whatwg-fetch';

jest.mock('@react-native-async-storage/async-storage', () => ({
  setItem: jest.fn(),
  getItem: jest.fn(),
  removeItem: jest.fn(),
  clear: jest.fn(),
}));

jest.spyOn(global, 'alert').mockImplementation(() => {});
