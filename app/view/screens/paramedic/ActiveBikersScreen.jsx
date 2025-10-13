import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import colors from '../../constants/colors';

export default function ActiveBikersScreen({ navigation }) {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Bikers activos</Text>
      <Text style={styles.subtitle}>Actualmente en ruta</Text>
      <Text style={styles.date}>Martes, 16 de Agosto 2025</Text>

      <View style={styles.grid}>
        <View style={[styles.card, { backgroundColor: '#B9D8C2' }]}>
          <Text style={styles.cardTitle}>Nivel: principiante</Text>
          <Text style={styles.cardText}>16 activos</Text>
        </View>

        <View style={[styles.card, { backgroundColor: '#A0C4FF' }]}>
          <Text style={styles.cardTitle}>Nivel: intermedio</Text>
          <Text style={styles.cardText}>20 activos</Text>
        </View>

        <View style={[styles.card, { backgroundColor: '#FFD6A5' }]}>
          <Text style={styles.cardTitle}>Nivel: avanzado</Text>
          <Text style={styles.cardText}>4 activos</Text>
        </View>

        <View style={[styles.card, { backgroundColor: '#FFF0F0' }]}>
          <Text style={styles.cardTitle}>Llamadas de emergencia</Text>
          <Text style={styles.emergencyCount}>3</Text>

          <TouchableOpacity
            style={styles.emergencyButton}
            onPress={() => navigation.navigate('EmergencieTable')}
          >
            <Text style={styles.emergencyButtonText}>Atender</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
    padding: 20,
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    color: colors.text,
  },
  subtitle: {
    fontSize: 18,
    color: colors.darkGreen,
    fontWeight: 'bold',
  },
  date: {
    color: colors.textGray,
    marginBottom: 20,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  card: {
    width: '48%',
    padding: 16,
    borderRadius: 12,
    marginBottom: 15,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  cardTitle: {
    fontWeight: 'bold',
    fontSize: 16,
    marginBottom: 6,
    textAlign: 'center',
  },
  cardText: {
    fontSize: 14,
    color: colors.text,
  },
  emergencyCount: {
    fontSize: 28,
    fontWeight: 'bold',
    color: colors.alertRed,
    marginVertical: 8,
  },
  emergencyButton: {
    backgroundColor: '#9a1d1dff',
    paddingVertical: 8,
    paddingHorizontal: 20,
    borderRadius: 20,
  },
  emergencyButtonText: {
    color: '#ffffffff',
    fontWeight: 'bold',
    fontSize: 15,
  },
});
