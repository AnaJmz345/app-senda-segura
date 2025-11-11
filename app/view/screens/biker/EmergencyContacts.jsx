import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';

export default function EmergencyContacts({ navigation }) {
  return (
    <View style={styles.container}>
     
      <View style={styles.header}>
        <TouchableOpacity style={styles.button} onPress={() => navigation.goBack()}>
          <Ionicons name="chevron-back" size={28} color="black" />
        </TouchableOpacity>
        <Text style={styles.title}>Contactos de emergencia</Text>
      </View>

     
      <View style={styles.content}>
        <Text style={styles.subtitle}>Director de Más Bosque</Text>
        <Text style={styles.info}>Manuel López</Text>
        <Text style={styles.phone}>Tel: 555-123-4567</Text>

        <Text style={styles.subtitle}>Ambulancia</Text>
        <Text style={styles.phone}>Tel: 555-987-6543</Text>

        <Text style={styles.subtitle}>Paramédico Encargado</Text>
        <Text style={styles.info}>Carlos Pérez</Text>
        <Text style={styles.phone}>Cel: 555-246-8109</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    backgroundColor: '#F8F8F8',
    paddingTop: 60, 
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    marginBottom: 30,
  },
  button: {
    backgroundColor: '#D19761',
    padding: 6,
    borderRadius: 6,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 2,
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowRadius: 2,
    shadowOffset: { width: 0, height: 1 },
  },
  title: { 
    fontSize: 24,  
    fontWeight: '700',
    color: 'black',
    marginLeft: 10,
  },
  content: {
    marginTop: 10, 
    paddingHorizontal: 30,
  },
  subtitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#222',
    marginTop: 25,
  },
  info: {
    fontSize: 16,
    color: '#333',
  },
  phone: {
    fontSize: 16,
    color: '#555',
    marginBottom: 10,
  },
});
