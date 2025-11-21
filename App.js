import React, { useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { AuthProvider } from './app/view/context/AuthContext';
import AppNavigator from './app/view/navigation/AppNavigator';
import { initLocalDB } from './app/view/lib/initLocalDB';

export default function App() {
  useEffect(() => {
    initLocalDB(); //inicializa SQLite y crea las tablas si no existen
  }, []);

  return (
    <AuthProvider>
      <NavigationContainer>
        <AppNavigator />
      </NavigationContainer>
    </AuthProvider>
  );
}
