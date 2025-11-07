// app/view/context/AuthContext.js
import React, { createContext, useContext, useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [session, setSession] = useState(null);
  const [profile, setProfile] = useState(null); // tendrá role y display_name
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      const { data } = await supabase.auth.getSession();
      setSession(data.session ?? null);
      setLoading(false);
      if (data.session?.user?.id) {
        await loadProfile(data.session.user.id);
      }
    })();

    const { data: sub } = supabase.auth.onAuthStateChange(async (_event, newSession) => {
      setSession(newSession);
      if (newSession?.user?.id) {
        await loadProfile(newSession.user.id);
      } else {
        setProfile(null);
      }
    });

    return () => sub.subscription.unsubscribe();
  }, []);

  async function loadProfile(userId) {
    const { data, error } = await supabase
      .from('profiles')
      .select('id, display_name, role, avatar_url, phone')
      .eq('id', userId)
      .maybeSingle();
    if (!error) setProfile(data);
  }

  async function signOut() {
    await supabase.auth.signOut();
    setProfile(null);
  }

  const value = {
    session,
    user: session?.user ?? null,
    profile, // incluye role: 'biker' | 'paramedic' | 'admin'
    loading,
    signOut,
    reloadProfile: () => (session?.user?.id ? loadProfile(session.user.id) : null),
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export const useAuth = () => useContext(AuthContext);
