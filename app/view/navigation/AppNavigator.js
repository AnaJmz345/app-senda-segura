import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useAuth } from '../context/AuthContext';

//These screens will be in the main stack navigator
import LoginScreen from '../screens/LoginScreen';
import RegisterScreen from '../screens/RegisterScreen';
import SuccessScreen from '../screens/SucessScreen';
import HomeScreen from '../screens/HomeScreen';

//This will call the tabs navigators accordong to the profile role
import AdminTabNavigator from './AdminTabNavigator'; //Tabs específicas para admin
import BikerTabNavigator from './BikerTabNavigator'; // Tabs específicos para bikers
import ParamedicTabNavigator from './ParamedicTabNavigator'; // Tabs específicos para paramédicos
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
          <>
            <Stack.Screen name="Home" component={HomeScreen} />

            {/* Cuando el usuario presiona "Ahora todo comienza" en HomeScreen, lo redirige a los tabs según su rol */}
            <Stack.Screen name="RoleTabs" component={RoleTabs} />
          </>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
}

// Componente para manejar la lógica de redirección según el rol
function RoleTabs({navigation}) {
  const { profile } = useAuth();

  if (!profile) {
    return <BikerTabNavigator navigation={navigation}/>; // O puedes poner un loading mientras el perfil se carga
  }

  // Redirigir al Tab correspondiente según el rol
  if (profile.role === 'biker') {
    return <BikerTabNavigator navigation={navigation}/>;
  } else if (profile.role === 'paramedic') {
    return <ParamedicTabNavigator navigation={navigation}/>;
  } else {
    return <AdminTabNavigator navigation={navigation}/>; // Default tabs si no hay un rol específico
  }
}