
import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useAuth } from '../context/AuthContext';

// 🔹 Screens principales
import LoginScreen from '../screens/LoginScreen';
import RegisterScreen from '../screens/RegisterScreen';
import SuccessScreen from '../screens/SucessScreen';
import HomeScreen from '../screens/HomeScreen';

// 🔹 Pantallas del paramédico (tuyas)
import ActiveBikersScreen from '../screens/paramedic/ActiveBikersScreen';
import EmergencyCallsHistoryScreen from '../screens/paramedic/EmergencyCallsHistoryScreen';

// Tabs para roles
import AdminTabNavigator from './AdminTabNavigator';
import BikerTabNavigator from './BikerTabNavigator';
import ParamedicTabNavigator from './ParamedicTabNavigator';

const Stack = createNativeStackNavigator();

export default function AppNavigator() {
  const { user, profile, loading } = useAuth();

  if (loading) return null;

  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
        {/* 🔸 Si el usuario no está autenticado */}
        {!user ? (
          <>
            <Stack.Screen name="Login" component={LoginScreen} />
            <Stack.Screen name="Register" component={RegisterScreen} />
            <Stack.Screen name="Success" component={SuccessScreen} />
          </>
        ) : (
          <>
            {/* 🔹 Pantalla principal según el rol del usuario */}
            <Stack.Screen name="RoleTabs" component={RoleTabs} />
          </>
        )}
      </Stack.Navigator>
  );
}

// 🔧 Manejo de roles (mantiene la lógica de tus compañeros)
function RoleTabs({ navigation }) {
  const { profile } = useAuth();

  // Si no hay profile todavía, mostrar loading o null
  if (!profile) {
    return null;
  }

  // Navegar según el rol del usuario
  if (profile.role === 'biker') {
    return <BikerTabNavigator navigation={navigation} />;
  } else if (profile.role === 'paramedic') {
    return <ParamedicTabNavigator navigation={navigation} />;
  } else if (profile.role === 'admin') {
    return <AdminTabNavigator navigation={navigation} />;
  }

  // Si el role no es reconocido, return null o un screen de error
  return null;
}
