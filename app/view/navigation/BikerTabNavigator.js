import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import BikerMapScreen from '../screens/biker/BikerMapScreen';
import BikerProfileScreen from '../screens/biker/BikerProfileScreen';

const Stack = createNativeStackNavigator();


export default function BikerTabNavigator({ navigation }) {
  return (
    
    <Stack.Navigator screenOptions={{ headerShown: false }} >
        <Stack.Screen
          name="BikerMapScreen" 
          component={BikerMapScreen }
          navigation={navigation}
        />
        <Stack.Screen
          name="BikerProfileScreen" 
          component={BikerProfileScreen} 
          navigation={navigation}
        />

    </Stack.Navigator>
  );
}
