import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useAuth } from '../context/AuthContext';

import LoginScreen from '../screens/LoginScreen';
import RegisterScreen from '../screens/RegisterScreen';
import SuccessScreen from '../screens/SucessScreen';

import HomeScreen from '../screens/HomeScreen';
// TODO: importa tus stacks por rol si los tienes
// import BikerStack from '../screens/biker/BikerStack';
// import ParamedicStack from '../screens/paramedic/ParamedicStack';
// import AdminStack from '../screens/admin/AdminStack';

const Stack = createNativeStackNavigator();

export default function AppNavigator() {
  const { user, profile, loading } = useAuth();

  if (loading) return null; // o un Splash

  const isAuth = !!user?.id;

  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        {!isAuth ? (
          <>
            <Stack.Screen name="Login" component={LoginScreen} />
            <Stack.Screen name="Register" component={RegisterScreen} />
            <Stack.Screen name="Success" component={SuccessScreen} />
          </>
        ) : (
          // Routing por rol (temporal: manda a Home si aún no hay profile cargado)
          <>
            {!profile ? (
              <Stack.Screen name="Home" component={HomeScreen} />
            ) : profile.role === 'biker' ? (
              <Stack.Screen name="Home" component={HomeScreen} />
            ) : profile.role === 'paramedic' ? (
              <Stack.Screen name="Home" component={HomeScreen} />
            ) : (
              <Stack.Screen name="Home" component={HomeScreen} />
            )}
          </>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
}
