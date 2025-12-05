import React, { createContext, useContext, useState, useCallback } from 'react';
import { BikerSessionModel } from '../../models/BikerSessionModel';

const BikerSessionContext = createContext(null);

export function BikerSessionProvider({ children }) {
  const [activeSession, setActiveSession] = useState(null);
  const [checkingSession, setCheckingSession] = useState(true);

  // Función para verificar la sesión activa
  const checkSession = useCallback(async (userId) => {
    if (!userId) {
      setActiveSession(null);
      setCheckingSession(false);
      return;
    }

    try {
      const session = await BikerSessionModel.getActiveSession(userId);
      setActiveSession(session);
    } catch (err) {
      console.log('Error al verificar sesión activa:', err);
    } finally {
      setCheckingSession(false);
    }
  }, []);

  // Función para notificar que se inició una ruta
  const sessionStarted = useCallback((session) => {
    setActiveSession(session);
  }, []);

  // Función para notificar que se finalizó una ruta
  const sessionEnded = useCallback(() => {
    setActiveSession(null);
  }, []);

  const value = {
    activeSession,
    checkingSession,
    checkSession,
    sessionStarted,
    sessionEnded,
  };

  return (
    <BikerSessionContext.Provider value={value}>
      {children}
    </BikerSessionContext.Provider>
  );
}

export const useBikerSession = () => {
  const context = useContext(BikerSessionContext);
  if (!context) {
    throw new Error('useBikerSession debe usarse dentro de BikerSessionProvider');
  }
  return context;
};
