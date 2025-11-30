import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import AdminProfileScreen from '../screens/admin/AdminProfileScreen';
import AdminMapScreen from '../screens/admin/AdminMapScreen';
import EditAdminProfileScreen from '../screens/admin/EditAdminProfileScreen';
const Stack = createNativeStackNavigator();


export default function AdminTabNavigator() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }} >
        <Stack.Screen
          name="AdminMapScreen" 
          component={AdminMapScreen}
        />
        <Stack.Screen
          name="AdminProfileScreen" 
          component={AdminProfileScreen}
        />
        <Stack.Screen 
          name="EditAdminProfileScreen"
          component={EditAdminProfileScreen}
        />
    </Stack.Navigator>
  );
}
