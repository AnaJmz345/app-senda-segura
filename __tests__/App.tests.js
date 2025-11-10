import React from 'react';
import { render } from '@testing-library/react-native';
import App from '../App';
const { supabase } = require('../__mocks__/supabase');


test('App renders', () => {
  render(<App />);
});
