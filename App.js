import React, { useEffect, useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { AuthProvider, useAuth } from './app/view/context/AuthContext';
import AppNavigator from './app/view/navigation/AppNavigator';
import { initLocalDB } from './app/view/lib/initLocalDB';
import { downloadProfileFromSupabase, syncPendingProfile } from "./app/view/lib/syncProfile";
import { supabase } from "./app/view/lib/supabase";
import { View, Text, ActivityIndicator } from 'react-native';
import { SafeAreaProvider } from "react-native-safe-area-context";

function AppContent() {
  const { user } = useAuth();
  const [dbInitialized, setDbInitialized] = useState(false);
  const [loading, setLoading] = useState(true);

  {/*useEffect(() => {
    supabase.auth.signOut();
  }, []);*/}

  useEffect(() => {
    const initializeApp = async () => {
      try {
        console.log("Iniciando aplicación...");
        
        // Inicializar base de datos
        console.log("Inicializando base de datos...");
        await initLocalDB();
        setDbInitialized(true);
        console.log("Base de datos inicializada correctamente");

        // Si hay usuario, sincronizar perfil
        if (user) {
          console.log("Sincronizando perfil del usuario...");
          await downloadProfileFromSupabase(user.id);
          await syncPendingProfile(user.id);
          console.log("Perfil sincronizado correctamente");
        }

      } catch (error) {
        console.error("Error inicializando aplicación:", error);
        // Continuamos aunque falle la BD, la app tiene fallback
        setDbInitialized(false);
      } finally {
        setLoading(false);
      }
    };

    initializeApp();
  }, [user]);

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#F3F3F1' }}>
        <ActivityIndicator size="large" color="#388e3c" />
        <Text style={{ marginTop: 10, color: '#666' }}>Inicializando aplicación...</Text>
      </View>
    );
  }

  return (
    <NavigationContainer>
      <AppNavigator />
    </NavigationContainer>
  );
}

export default function App() {
  return (
    <SafeAreaProvider>
    <AuthProvider>
      <AppContent />
    </AuthProvider>
    </SafeAreaProvider>
  );
}