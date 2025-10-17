
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import AppNavigator from './app/view/navigation/AppNavigator';


export default function App() {
  return (

     <NavigationContainer>
      <AppNavigator />
    </NavigationContainer>
  );
}
