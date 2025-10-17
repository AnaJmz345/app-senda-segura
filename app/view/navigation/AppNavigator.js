<<<<<<< HEAD
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import ParamedicProfileScreen from '../screens/paramedic/ParamedicProfileScreen';
import { createStackNavigator } from '@react-navigation/stack'; // nav
import { NavigationContainer } from '@react-navigation/native';// nav
import ActiveBikersScreen from '../screens/paramedic/ActiveBikersScreen';
import EmergencieTable from '../screens/paramedic/EmergencieTable';
import { _Image } from 'react-native';

const Stack = createNativeStackNavigator();

export default function AppNavigator() {
  return (
    <Stack.Navigator>
      <Stack.Screen name="ParamedicProfileScreen" component={ParamedicProfileScreen}/>
      <Stack.Screen name="ActiveBikersScreen" component={ActiveBikersScreen}/>
      <Stack.Screen name="EmergencieTable" component={EmergencieTable}/>
       <Stack.Screen name="Home" component={HomeScreen} />
        <Stack.Screen name="Login" component={LoginScreen} />
        <Stack.Screen name="Register" component={RegisterScreen} />
        <Stack.Screen name="Success" component={SuccessScreen} />
        <Stack.Screen name="Map" component={BikerMapScreen} />
        <Stack.Screen name="Profile" component={BikerProfileScreen} />
        <Stack.Screen name="BikerMedicalDataForm" component={BikerMedicalDataForm} />
    </Stack.Navigator>
  );
}
