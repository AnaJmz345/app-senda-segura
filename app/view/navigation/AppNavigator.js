import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { NavigationContainer } from '@react-navigation/native';

import BikerMapScreen from '../screens/biker/BikerMapScreen';
import BikerProfileScreen from '../screens/biker/BikerProfileScreen';
import BikerMedicalDataForm from '../screens/biker/BikerMedicalDataForm';
const Stack = createStackNavigator();

export default function AppNavigator() {
  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen name="Map" component={BikerMapScreen} />
        <Stack.Screen name="Profile" component={BikerProfileScreen} />
        <Stack.Screen name="BikerMedicalDataForm" component={BikerMedicalDataForm} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
