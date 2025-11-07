import React from 'react';
import { AuthProvider } from './app/view/context/AuthContext';
import AppNavigator from './app/view/navigation/AppNavigator';

export default function App() {
  return (
    <AuthProvider>
      <AppNavigator />
    </AuthProvider>
  );
}
