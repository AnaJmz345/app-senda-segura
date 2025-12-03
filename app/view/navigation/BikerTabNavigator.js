import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

import BikerMapScreen from "../screens/biker/BikerMapScreen";
import BikerRouteDetail from "../screens/biker/BikerRouteDetail";
import RateRouteScreen from "../screens/biker/RateRouteScreen";
import RouteReviews from "../screens/biker/RouteReviews";
import BikerProfileScreen from "../screens/biker/BikerProfileScreen";
import BikerMedicalDataForm from "../screens/biker/BikerMedicalDataForm";
import EditBikerProfile from "../screens/biker/EditBikerProfile";
import EmergencyContacts from "../screens/biker/EmergencyContacts";
import RideTrackingScreen from "../screens/biker/RideTrackingScreen";
import RideSummaryScreen from "../screens/biker/RideSummaryScreen";
import UserRideHistoryScreen from "../screens/biker/UserRideHistoryScreen";

const Stack = createNativeStackNavigator();

export default function BikerTabNavigator({ navigation }) {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
        animation: "slide_from_right",
      }}
    >
      <Stack.Screen name="BikerMapScreen" component={BikerMapScreen} />
      <Stack.Screen name="RideTrackingScreen" component={RideTrackingScreen} />
      <Stack.Screen name="RideSummaryScreen" component={RideSummaryScreen} />

      <Stack.Screen name="BikerRouteDetail" component={BikerRouteDetail} />
      <Stack.Screen name="RateRouteScreen" component={RateRouteScreen} />
      <Stack.Screen name="RouteReviews" component={RouteReviews} />
      <Stack.Screen name="BikerProfileScreen" component={BikerProfileScreen} />
      <Stack.Screen
        name="BikerMedicalDataForm"
        component={BikerMedicalDataForm}
      />
      <Stack.Screen name="EditBikerProfile" component={EditBikerProfile} />
      <Stack.Screen name="EmergencyContacts" component={EmergencyContacts} />
      <Stack.Screen
        name="UserRideHistoryScreen"
        component={UserRideHistoryScreen}
        options={{ title: "Mis rutas" }}
      />
    </Stack.Navigator>
  );
}
