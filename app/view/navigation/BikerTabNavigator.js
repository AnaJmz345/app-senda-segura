import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

// Screens biker
import BikerMapScreen from '../screens/biker/BikerMapScreen';
import BikerProfileScreen from '../screens/biker/BikerProfileScreen';
import BikerMedicalDataForm from '../screens/biker/BikerMedicalDataForm';
import EditBikerProfile from '../screens/biker/EditBikerProfile';
import EmergencyContacts from '../screens/biker/EmergencyContacts';
import BikerRouteDetail from '../screens/biker/BikerRouteDetail';
import RateRouteScreen from '../screens/biker/RateRouteScreen';
import RouteReviews from '../screens/biker/RouteReviews';
import EmergencyScreen from "../screens/biker/SOSEmergencyCallScreen";


const Stack = createNativeStackNavigator();

export default function BikerTabNavigator({ navigation }) {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
        animation: 'slide_from_right',
      }}
    >
      <Stack.Screen name="BikerMapScreen" component={BikerMapScreen} />
      <Stack.Screen name="BikerRouteDetail" component={BikerRouteDetail} />
      <Stack.Screen name="RateRouteScreen" component={RateRouteScreen} />
      <Stack.Screen name="RouteReviews" component={RouteReviews} />
      <Stack.Screen name="BikerProfileScreen" component={BikerProfileScreen} />
      <Stack.Screen name="BikerMedicalDataForm" component={BikerMedicalDataForm} />
      <Stack.Screen name="EditBikerProfile" component={EditBikerProfile} />
      <Stack.Screen name="EmergencyContacts" component={EmergencyContacts} />
      <Stack.Screen name="SOSEmergencyCallScreen" component={EmergencyScreen} />

    </Stack.Navigator>
  );
}
