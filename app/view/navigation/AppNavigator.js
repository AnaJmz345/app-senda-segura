import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
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

// 🔹 Tabs para roles (de tus compañeros)
import AdminTabNavigator from './AdminTabNavigator';
import BikerTabNavigator from './BikerTabNavigator';
import ParamedicTabNavigator from './ParamedicTabNavigator';

const Stack = createNativeStackNavigator();

export default function AppNavigator() {
  const { user, profile, loading } = useAuth();

  if (loading) return null;

  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        {/* 🔸 Si el usuario no está autenticado */}
        {!user ? (
          <>
            <Stack.Screen name="Login" component={LoginScreen} />
            <Stack.Screen name="Register" component={RegisterScreen} />
          </>
        ) : (
          <>
            {/* 🔹 Pantallas paramédico personalizadas */}
            <Stack.Screen name="ActiveBikers" component={ActiveBikersScreen} />
            <Stack.Screen name="History" component={EmergencyCallsHistoryScreen} />

            {/* 🔹 Home general y Success */}
            <Stack.Screen name="Success" component={SuccessScreen} />
            <Stack.Screen name="Home" component={HomeScreen} />

            {/* 🔹 Pantalla de tabs por rol */}
            <Stack.Screen name="RoleTabs" component={RoleTabs} />
          </>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
}

// 🔧 Manejo de roles (mantiene la lógica de tus compañeros)
function RoleTabs({ navigation }) {
  const { profile } = useAuth();

  if (!profile) {
    return <ParamedicTabNavigator navigation={navigation} />; // loading default
  }

  if (profile.role === 'biker') {
    return <BikerTabNavigator navigation={navigation} />;
  } else if (profile.role === 'paramedic') {
    return <ParamedicTabNavigator navigation={navigation} />;
  } else {
    return <AdminTabNavigator navigation={navigation} />; // default admin
  }
}
