import React, { useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { AuthProvider, useAuth } from './app/view/context/AuthContext';
import AppNavigator from './app/view/navigation/AppNavigator';
import { initLocalDB } from './app/view/lib/initLocalDB';
import { downloadProfileFromSupabase, syncPendingProfile } from "./app/view/lib/syncProfile";
import { supabase } from "./app/view/lib/supabase";


function AppContent() {
  const { user } = useAuth();

  useEffect(() => {
    supabase.auth.signOut();
  }, []);
  
  useEffect(() => {
    const init = async () => {
      await initLocalDB();

      if (user) {
        await downloadProfileFromSupabase(user.id);
        await syncPendingProfile(user.id)
      }
    };

    init();
  }, [user]);

  return (
    <NavigationContainer>
      <AppNavigator />
    </NavigationContainer>
  );
}


export default function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}
