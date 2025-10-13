import React from 'react';
import { View, Text, StyleSheet, FlatList } from 'react-native';
import PrimaryButton from '../../components/PrimaryButton';
import colors from '../../constants/colors';

const DATA = [
  { id: '1', usuario: 'Chicharín_2', ubicacion: 'Intermedio' },
  { id: '2', usuario: 'Raul_Noriega', ubicacion: 'Avanzado' },
  { id: '3', usuario: 'Paulinaz', ubicacion: 'Avanzado' },
  { id: '4', usuario: 'JessicaTeran', ubicacion: 'Principiante' },
];

export default function EmergencieTable() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Llamadas de emergencia</Text>
      <Text style={styles.subtitle}>
        Verifica si un paramédico ya tomó el caso antes de dirigirte a una zona.
      </Text>

      <FlatList
        data={DATA}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.row}>
            <Text style={styles.cell}>{item.usuario}</Text>
            <Text style={[styles.cell, styles.tag(item.ubicacion)]}>{item.ubicacion}</Text>
            <PrimaryButton title="Ir" color={colors.primary} onPress={() => {}} />
          </View>
        )}
      />
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
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginVertical: 8,
  },
  cell: {
    flex: 1,
    fontSize: 16,
  },
  tag: (nivel) => ({
    color:
      nivel === 'Avanzado'
        ? '#a55f3aff'
        : nivel === 'Intermedio'
        ? '#3A7CA5'
        : nivel === 'Principiante'
        ? '#54da73ff'
        : colors.secondary,
    fontWeight: 'bold',
  }),
});

