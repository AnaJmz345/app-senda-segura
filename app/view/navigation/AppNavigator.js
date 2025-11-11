import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useAuth } from '../context/AuthContext';

// Screens principales
import LoginScreen from '../screens/LoginScreen';
import RegisterScreen from '../screens/RegisterScreen';
import SuccessScreen from '../screens/SucessScreen';
import HomeScreen from '../screens/HomeScreen';

// 🔹 Pantallas del paramédico
import ActiveBikersScreen from '../screens/paramedic/ActiveBikersScreen';
import EmergencyCallsHistoryScreen from '../screens/paramedic/EmergencyCallsHistoryScreen';

const Stack = createNativeStackNavigator();

export default function AppNavigator() {
  const { user, profile, loading } = useAuth();

  if (loading) return null;

  return (
    // ⚠️ Ya no agregamos NavigationContainer aquí, porque ya está en App.js
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      {/* 🔹 Pantalla inicial temporal */}
      <Stack.Screen name="ActiveBikers" component={ActiveBikersScreen} />
      {/* 🔹 Pantalla del historial */}
      <Stack.Screen name="History" component={EmergencyCallsHistoryScreen} />
      {/* 🔹 Puedes agregar más rutas si las necesitas */}
      <Stack.Screen name="Home" component={HomeScreen} />

      {/* Login / Register (si los usas más adelante) */}
      <Stack.Screen name="Login" component={LoginScreen} />
      <Stack.Screen name="Register" component={RegisterScreen} />
      <Stack.Screen name="Success" component={SuccessScreen} />
    </Stack.Navigator>
  );
}
