import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { AuthProvider } from './app/view/context/AuthContext';
import AppNavigator from './app/view/navigation/AppNavigator';

export default function App() {
  return (
    <AuthProvider>
      {/* 🔹 Este contenedor es esencial para que la navegación funcione */}
      <NavigationContainer>
        <AppNavigator />
      </NavigationContainer>
    </AuthProvider>
  );
}
