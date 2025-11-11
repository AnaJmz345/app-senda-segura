
import React from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, ScrollView } from 'react-native';
export default function Mapa() {
  return (
    <View style={styles.container}>
        <Image
              
          source={require('../../../assets/mapaEjemplo.png')} 
          style={styles.map}
          resizeMode="cover"
        />
     
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F8F8',
  },
  map:{
    flex: 1,
    width: '100%',
    
    
  }
  
});