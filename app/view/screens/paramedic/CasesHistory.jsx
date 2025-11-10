import React from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, ScrollView } from 'react-native';

import { Ionicons, FontAwesome5 } from '@expo/vector-icons';
import TopMenu from '../../components/TopMenu'
export default function CasesHistory({ navigation }) {
  return (
    <View style={styles.container}>

      <ScrollView contentContainerStyle={styles.content}>
        <TopMenu navigation ={navigation}></TopMenu>
        
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F8F8',
  },
  content: {
    flexGrow: 1,
  },
});
