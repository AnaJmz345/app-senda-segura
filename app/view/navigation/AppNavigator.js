import { createNativeStackNavigator } from '@react-navigation/native-stack';
import ParamedicProfileScreen from '../screens/paramedic/ParamedicProfileScreen';
import ActiveBikersScreen from '../screens/paramedic/ActiveBikersScreen';
import EmergencieTable from '../screens/paramedic/EmergencieTable';

const Stack = createNativeStackNavigator();

export default function AppNavigator() {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="ParamedicProfileScreen"
        component={ParamedicProfileScreen}
        options={{ title: 'Perfil del Paramédico' }}
      />
      <Stack.Screen
        name="ActiveBikersScreen"
        component={ActiveBikersScreen}
        options={{ title: 'Bikers Activos' }}
      />
      <Stack.Screen
        name="EmergencieTable"
        component={EmergencieTable}
        options={{ title: 'Llamadas de emergencia' }}
      />
    </Stack.Navigator>
  );
}
