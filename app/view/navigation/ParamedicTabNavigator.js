import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import ParamedicProfileScreen from '../screens/paramedic/ParamedicProfileScreen';
import ActiveBikersScreen from '../screens/paramedic/ActiveBikersScreen';
import CasesHistory from '../screens/paramedic/CasesHistory';
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

    </Stack.Navigator>
  );
}
