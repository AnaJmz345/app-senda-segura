import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import colors from '../../constants/colors';

export default function ActiveBikersScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Bikers activos</Text>
      <Text style={styles.subtitle}>Actualmente en ruta</Text>

      <View style={styles.cardContainer}>
        <View style={[styles.card, { backgroundColor: colors.lightGreen }]}>
          <Text style={styles.cardTitle}>Nivel: Principiante</Text>
          <Text>16 activos</Text>
        </View>
        <View style={[styles.card, { backgroundColor: '#A0C4FF' }]}>
          <Text style={styles.cardTitle}>Nivel: Intermedio</Text>
          <Text>20 activos</Text>
        </View>
        <View style={[styles.card, { backgroundColor: '#FFADAD' }]}>
          <Text style={styles.cardTitle}>Nivel: Avanzado</Text>
          <Text>4 activos</Text>
        </View>
      </View>

      <View style={[styles.card, { backgroundColor: '#FFD6A5' }]}>
        <Text style={styles.cardTitle}>Llamadas de emergencia</Text>
        <Text style={{ fontSize: 26, fontWeight: 'bold', color: colors.alertRed }}>3</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: colors.background,
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    color: colors.text,
  },
  subtitle: {
    color: colors.textGray,
    marginBottom: 20,
  },
  cardContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  card: {
    width: '48%',
    padding: 15,
    borderRadius: 10,
    marginVertical: 8,
    alignItems: 'center',
  },
  cardTitle: {
    fontWeight: 'bold',
    marginBottom: 5,
  },
});
