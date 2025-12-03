import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import ParamedicProfileScreen from '../screens/paramedic/ParamedicProfileScreen';
import ActiveBikersScreen from '../screens/paramedic/ActiveBikersScreen';
import CasesHistory from '../screens/paramedic/CasesHistory';
import EmergencyCall from '../screens/paramedic/EmergencyCall';
import RegisterNewCaseScreen from '../screens/paramedic/RegisterNewCaseScreen';
import EditBikerProfile from '../screens/biker/EditBikerProfile';
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
          name="EmergencyCall" 
          component={EmergencyCall}
          navigation={navigation}
        />
        <Stack.Screen 
          name="EditBikerProfile" 
          component={EditBikerProfile} 
        />

    </Stack.Navigator>
  );
}