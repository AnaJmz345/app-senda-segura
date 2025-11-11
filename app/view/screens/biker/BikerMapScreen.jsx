import React from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, ScrollView } from 'react-native';
import Mapa from '../../components/Mapa'
import { Ionicons, FontAwesome5 } from '@expo/vector-icons';
import TopMenu from '../../components/TopMenu'
export default function BikerMapScreen({ navigation }) {
  return (
    <View style={styles.container}>

      <ScrollView contentContainerStyle={styles.content}>
        <TopMenu navigation ={navigation}></TopMenu>
        <Mapa
        />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F3F3F1',
  },
  map:{
    flex: 1,
    width: '100%',
    
    
  }
  
});
