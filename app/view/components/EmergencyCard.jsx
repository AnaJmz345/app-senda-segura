import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { FontAwesome5 } from '@expo/vector-icons';

export default function EmergencyCard({ count, onPress }) {
  return (
    <View style={styles.card}>
      <Text style={styles.title}>Llamadas de{"\n"}emergencia</Text>
      <Text style={styles.number}>{count}</Text>
      <TouchableOpacity style={styles.button} onPress={onPress}>
        <FontAwesome5 name="heart" size={14} color="#fff" />
        <Text style={styles.btnText}> Atender</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    width: '47%',
    borderRadius: 18,
    backgroundColor: '#FCEEEF',
    padding: 14,
    shadowColor: '#000',
    shadowOpacity: 0.18,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 6 },
    elevation: 6,
  },
  title: { color: '#030303ff', fontWeight: '700', textAlign: 'center', fontSize: 16, lineHeight: 20 },
  number: { fontSize: 42, fontWeight: '800', color: '#2E2E2E', marginVertical: 8, textAlign: 'center' },
  button: {
    alignSelf: 'center',
    backgroundColor: '#B3272D',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 16,
    flexDirection: 'row',
    alignItems: 'center',

  },
  btnText: { color: '#fff', fontWeight: '700' },
});
