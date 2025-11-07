import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import AdminProfileScreen from '../screens/admin/AdminProfileScreen';
import AdminMapScreen from '../screens/admin/AdminMapScreen';
const Stack = createNativeStackNavigator();


export default function AdminTabNavigator({ navigation }) {
  return (
    
    <Stack.Navigator screenOptions={{ headerShown: false }} >
        <Stack.Screen
          name="AdminMap" 
          component={AdminMapScreen}
        />
        <Stack.Screen
          name="AdminProfile" 
          component={AdminProfileScreen}
        />

    </Stack.Navigator>
  );
}
