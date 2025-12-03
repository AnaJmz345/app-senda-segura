import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import ParamedicProfileScreen from '../screens/paramedic/ParamedicProfileScreen';
import ActiveBikersScreen from '../screens/paramedic/ActiveBikersScreen';
import CasesHistory from '../screens/paramedic/CasesHistory';
import RegisterNewCaseScreen from '../screens/paramedic/RegisterNewCaseScreen';
import EditBikerProfile from '../screens/biker/EditBikerProfile';
import EmergencyListScreen from '../screens/paramedic/EmergencyListScreen';
import EmergencyDetailScreen from '../screens/paramedic/EmergencyDetailScreen';
const Stack = createNativeStackNavigator();

export default function ParamedicTabNavigator({ navigation }) {
  return (
    
    <Stack.Navigator screenOptions={{ headerShown: false }} >
        <Stack.Screen
          name="ParamedicProfileScreen" 
          component={ParamedicProfileScreen}
          navigation={navigation}
        />
        <Stack.Screen
          name="ActiveBikersScreen" 
          component={ActiveBikersScreen}
          navigation={navigation}
         />
        <Stack.Screen
          name="CasesHistory" 
          component={CasesHistory}
          navigation={navigation}
        />
        <Stack.Screen
          name="RegisterNewCaseScreen" 
          component={RegisterNewCaseScreen}
          navigation={navigation}
        />

        <Stack.Screen
          name="EmergencyListScreen" 
          component={EmergencyListScreen}
          navigation={navigation}
        />
         <Stack.Screen
          name="EmergencyDetailScreen" 
          component={EmergencyDetailScreen}
          navigation={navigation}
        />
        <Stack.Screen 
          name="EditBikerProfile" 
          component={EditBikerProfile} 
        />

    </Stack.Navigator>
  );
}