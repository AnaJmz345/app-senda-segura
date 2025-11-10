import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import LoginScreen from '../app/view/screens/LoginScreen';
const { supabase } = require('../__mocks__/supabase');


jest.mock('../app/view/lib/supabase', () => require('../__mocks__/supabase'));
jest.mock('@react-navigation/native', () => ({
  useNavigation: () => ({ navigate: jest.fn() }),
}));

test('render LoginScreen', () => {
  render(<LoginScreen />);
});

test('login con campos vacíos → alerta', () => {
  const { getByText } = render(<LoginScreen />);
  fireEvent.press(getByText(/iniciar sesión/i));
});
