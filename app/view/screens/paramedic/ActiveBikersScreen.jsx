import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { useNavigation } from '@react-navigation/native'; // ✅ Import necesario para navegación

export default function ActiveBikersScreen() {
  const navigation = useNavigation(); // ✅ Hook para navegar entre pantallas

  return (
    <View style={styles.background}>
      {/* 🔹 Header superior */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.navigate('Home')}>
          <Text style={styles.headerText}>Inicio</Text>
        </TouchableOpacity>

        <Text style={[styles.headerText, styles.activeTab]}>Rutas</Text>

        <TouchableOpacity onPress={() => navigation.navigate('History')}>
          <Text style={styles.headerText}>Historial</Text>
        </TouchableOpacity>
      </View>

      {/* Contenido principal */}
      <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.title}>Bikers activos</Text>
        <Text style={styles.subtitle}>Actualmente en ruta</Text>
        <Text style={styles.date}>Martes, 16 de Agosto 2025</Text>

        <View style={styles.grid}>
          {/* Primera fila */}
          <View style={styles.row}>
            <View style={[styles.card, styles.green]}>
              <Text style={styles.level}>Nivel: principiante</Text>
              <Text style={styles.active}>● 16 activos</Text>
            </View>

            <View style={[styles.card, styles.blue]}>
              <Text style={styles.level}>Nivel: intermedio</Text>
              <Text style={styles.active}>● 20 activos</Text>
            </View>
          </View>

          {/* Segunda fila */}
          <View style={styles.row}>
            <View style={[styles.card, styles.orange]}>
              <Text style={styles.level}>Nivel: avanzado</Text>
              <Text style={styles.active}>● 4 activos</Text>
            </View>

            <View style={[styles.card, styles.red]}>
              <Text style={styles.level}>Llamadas de emergencia</Text>
              <Text style={styles.number}>3</Text>
              <TouchableOpacity style={styles.button}>
                <Text style={styles.buttonText}>Atender</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  background: {
    flex: 1,
    backgroundColor: '#E3F0E3',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    backgroundColor: '#CFE6CF',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#A8C8A8',
  },
  headerText: {
    fontSize: 16,
    color: '#1C3B28',
    fontWeight: '500',
    opacity: 0.7,
  },
  activeTab: {
    fontWeight: 'bold',
    opacity: 1,
    textDecorationLine: 'underline',
  },
  container: {
    flexGrow: 1,
    alignItems: 'center',
    justifyContent: 'flex-start',
    paddingVertical: 35,
  },
  title: {
    fontSize: 26,
    fontWeight: 'bold',
    color: '#1C3B28',
    marginBottom: 5,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#1C3B28',
    textAlign: 'center',
  },
  date: {
    fontSize: 14,
    color: '#6B6B6B',
    marginBottom: 25,
    textAlign: 'center',
  },
  grid: {
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 15,
    marginBottom: 10,
  },
  card: {
    width: 150,
    height: 120,
    borderRadius: 18,
    padding: 15,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowRadius: 6,
    elevation: 3,
  },
  green: { backgroundColor: '#CDEAC0' },
  blue: { backgroundColor: '#A8D1FF' },
  orange: { backgroundColor: '#FFD6A5' },
  red: { backgroundColor: '#F8DADA' },
  level: {
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 6,
    fontSize: 15,
    color: '#333',
  },
  active: {
    fontSize: 13,
    color: '#444',
  },
  number: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#B00020',
    marginTop: 3,
  },
  button: {
    backgroundColor: '#B00020',
    paddingHorizontal: 16,
    paddingVertical: 6,
    borderRadius: 12,
    marginTop: 5,
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
});
