import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { useNavigation } from '@react-navigation/native'; // ✅ Importante para navegación

export default function EmergencyCallsHistoryScreen() {
  const navigation = useNavigation();

  const cases = [
    { date: '15/08/2025', name: 'Mara Lopez', injury: 'Fractura', route: 'Río caliente', severity: 'Moderada' },
    { date: '16/08/2025', name: 'Yael Sosa', injury: 'Raspón', route: 'Ruta A', severity: 'Leve' },
    { date: '16/08/2025', name: 'Miguel Yáñez', injury: 'Fractura', route: 'Ruta C', severity: 'Moderada' },
    { date: '16/08/2025', name: 'Sara Valencia', injury: 'Caída', route: 'Río caliente', severity: 'Leve' },
    { date: '16/08/2025', name: 'Lara Ríos', injury: 'Concusión', route: 'Río caliente', severity: 'Severa' },
    { date: '16/08/2025', name: 'Jorge Macías', injury: 'Desgarre', route: 'Ruta A', severity: 'Moderada' },
    { date: '16/08/2025', name: 'Oscar Quiroz', injury: 'Fractura', route: 'Ruta C', severity: 'Moderada' },
    { date: '17/08/2025', name: 'Javier Ruiz', injury: 'Caída', route: 'Ruta C', severity: 'Leve' },
    { date: '17/08/2025', name: 'Natalia Lima', injury: 'Herida', route: 'Ruta A', severity: 'Leve' },
    { date: '18/08/2025', name: 'Sebastián Márquez', injury: 'Concusión', route: 'Ruta A', severity: 'Severa' },
    { date: '20/08/2025', name: 'Larisa Torres', injury: 'Caída', route: 'Ruta C', severity: 'Leve' },
    { date: '24/08/2025', name: 'Raúl Suárez', injury: 'Fractura', route: 'Río caliente', severity: 'Moderada' },
    { date: '24/08/2025', name: 'María Piedra', injury: 'Fractura', route: 'Ruta C', severity: 'Leve' },
    { date: '24/08/2025', name: 'Arturo Huerta', injury: 'Caída', route: 'Ruta C', severity: 'Leve' },
  ];

  return (
    <View style={styles.background}>
      {/* 🔹 Header superior funcional */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.navigate('Home')}>
          <Text style={styles.headerText}>Inicio</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={() => navigation.navigate('ActiveBikers')}>
          <Text style={styles.headerText}>Rutas</Text>
        </TouchableOpacity>

        <Text style={[styles.headerText, styles.activeTab]}>Historial</Text>
      </View>

      {/* 🔹 Contenido principal */}
      <View style={styles.container}>
        <Text style={styles.title}>
          Historial de <Text style={styles.bold}>casos</Text> (53)
        </Text>

        {/* Filtros */}
        <View style={styles.filters}>
          <Text style={styles.filter}>Fecha</Text>
          <Text style={styles.filter}>Nombre</Text>
          <Text style={styles.filter}>Tipo de herida</Text>
          <Text style={styles.filter}>Ruta</Text>
          <Text style={styles.filter}>Gravedad</Text>
        </View>

        {/* Lista de casos */}
        <ScrollView contentContainerStyle={styles.scrollContainer}>
          {cases.map((item, index) => (
            <View key={index} style={styles.caseCard}>
              <Text style={styles.caseText}>
                {item.date} | {item.name} | {item.injury} | {item.route} | {item.severity}
              </Text>
            </View>
          ))}
        </ScrollView>

        {/* Botón inferior */}
        <TouchableOpacity style={styles.button}>
          <Text style={styles.buttonText}>Aplicar búsqueda</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  background: {
    flex: 1,
    backgroundColor: '#F5F7F4',
  },

  /* HEADER */
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

  /* CONTENIDO */
  container: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 25,
  },
  title: {
    fontSize: 22,
    color: '#1C3B28',
    fontWeight: '600',
    marginBottom: 15,
  },
  bold: {
    fontWeight: 'bold',
  },

  /* FILTROS */
  filters: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    flexWrap: 'wrap',
    marginBottom: 10,
  },
  filter: {
    fontSize: 13,
    backgroundColor: '#E8EDE7',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 6,
    color: '#333',
    marginBottom: 6,
  },

  /* LISTA DE CASOS */
  scrollContainer: {
    paddingBottom: 100,
  },
  caseCard: {
    backgroundColor: '#3C6E47',
    borderRadius: 8,
    paddingVertical: 10,
    paddingHorizontal: 12,
    marginBottom: 8,
  },
  caseText: {
    color: '#fff',
    fontSize: 13,
  },

  /* BOTÓN INFERIOR */
  button: {
    backgroundColor: '#3C6E47',
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 15,
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 15,
  },
});
