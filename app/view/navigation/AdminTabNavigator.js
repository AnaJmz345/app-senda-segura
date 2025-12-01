import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import AdminProfileScreen from '../screens/admin/AdminProfileScreen';
import AdminMapScreen from '../screens/admin/AdminMapScreen';
import EditBikerProfile from '../screens/biker/EditBikerProfile';
import ManageParamedicsScreen from '../screens/admin/ManageParamedicsScreen';
import MedicalHistoryRecordsScreen from '../screens/admin/MedicalHistoryRecordsScreen';
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
          name="EditBikerProfile" 
          component={EditBikerProfile} />
        <Stack.Screen 
          name="ManageParamedics"
          component={ManageParamedicsScreen}
        />
        <Stack.Screen 
          name="MedicalHistoryRecords"
          component={MedicalHistoryRecordsScreen}
        />
    </Stack.Navigator>
  );
}
