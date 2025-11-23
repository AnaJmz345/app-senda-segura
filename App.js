import React, { useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { AuthProvider } from './app/view/context/AuthContext';
import AppNavigator from './app/view/navigation/AppNavigator';
import { initLocalDB } from './app/view/lib/initLocalDB';
import supabase from './app/view/lib/supabase';
import { useAuth } from "./app/view/context/AuthContext";
import { downloadProfileFromSupabase, syncPendingProfile } from "./app/view/lib/syncProfile";

export default function App() {
  const { user } = useAuth();

  useEffect(() => {
    const init = async () => {
      await initLocalDB();

      if (user) {
        // Descargar perfil si SQLite está vacío
        await downloadProfileFromSupabase(user.id);

        // Subir cambios pendientes
        await syncPendingProfile(user.id);
      }
    };

    init();
  }, [user]);

  return (
    <AuthProvider>
      <NavigationContainer>
        <AppNavigator />
      </NavigationContainer>
    </AuthProvider>
  );
}
