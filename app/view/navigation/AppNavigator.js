import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { NavigationContainer } from '@react-navigation/native';

 import BikerMapScreen from '../screens/biker/BikerMapScreen';
import BikerProfileScreen from '../screens/biker/BikerProfileScreen';
import BikerMedicalDataForm from '../screens/biker/BikerMedicalDataForm';
import HomeScreen from '../screens/HomeScreen';
import LoginScreen from '../screens/LoginScreen';
import RegisterScreen from '../screens/RegisterScreen';
import SuccessScreen from '../screens/SucessScreen';

const Stack = createStackNavigator();

export default function AppNavigator() {
  return (
    
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        
        <Stack.Screen name="Home" component={HomeScreen} />
        <Stack.Screen name="Login" component={LoginScreen} />
        <Stack.Screen name="Register" component={RegisterScreen} />
        <Stack.Screen name="Success" component={SuccessScreen} />
        <Stack.Screen name="Map" component={BikerMapScreen} />
        <Stack.Screen name="Profile" component={BikerProfileScreen} />
        <Stack.Screen name="BikerMedicalDataForm" component={BikerMedicalDataForm} />
      </Stack.Navigator>
    

  );
}
