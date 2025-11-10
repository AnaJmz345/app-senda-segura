import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import BikerMapScreen from '../screens/biker/BikerMapScreen';
import BikerProfileScreen from '../screens/biker/BikerProfileScreen';
import BikerMedicalDataForm from '../screens/biker/BikerMedicalDataForm';
import EditBikerProfile from '../screens/biker/EditBikerProfile';
import EmergencyContacts from '../screens/biker/EmergencyContacts';
const Stack = createNativeStackNavigator();


export default function BikerTabNavigator({ navigation }) {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="BikerMapScreen" component={BikerMapScreen} navigation={navigation} />
      <Stack.Screen name="BikerProfileScreen" component={BikerProfileScreen} navigation={navigation} />
      <Stack.Screen name="BikerMedicalDataForm" component={BikerMedicalDataForm} navigation={navigation}/>
      <Stack.Screen name="EditBikerProfile" component={EditBikerProfile} navigation={navigation}/>
      <Stack.Screen name="EmergencyContacts" component={EmergencyContacts} navigation={navigation}/>
    </Stack.Navigator>

  );
}
