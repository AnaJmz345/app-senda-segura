import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, ActivityIndicator } from 'react-native';
import { Ionicons, FontAwesome5 } from '@expo/vector-icons';
import TopMenu from '../../components/TopMenu';
import { executeSql } from '../../lib/sqlite';

export default function BikerMapScreen({ navigation }) {
  const [routes, setRoutes] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
  const fetchRoutes = async () => {
    try {
      //intentar leer rutas desde SQLite
      const result = await executeSql(
        "SELECT * FROM routes WHERE is_active = 1"
      );

      //Validación segura
      if (!result || !result.rows) {
        console.log("Tabla routes vacía o SQLite aún no está lista");
        setRoutes([]);
        setLoading(false);
        return;
      }

      //Si hay rutas, asignarlas
      setRoutes(result.rows._array || []);
    } catch (error) {
      //Manejo seguro del error sin crashear la app
      console.error("Error al leer rutas locales:", error);
      setRoutes([]);
    }

    setLoading(false);
  };

  fetchRoutes();
}, []);

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.content}>
        <TopMenu navigation={navigation} />
        <Text style={styles.title}>Rutas disponibles</Text>
        {loading && (
          <ActivityIndicator size="large" color="#D19761" style={{ marginTop: 35 }} />
        )}
        {!loading && routes.length === 0 && (
          <Text style={styles.empty}>No hay rutas descargadas.</Text>
        )}
        {!loading && routes.map(route => (
          <View style={styles.routeCard} key={route.id}>
            <View style={styles.cardHeader}>
              <Ionicons name="bicycle" size={28} color="#388e3c" />
              <Text style={styles.routeName}>{route.name}</Text>
              {route.difficulty && (
                <View style={[styles.difficulty, styles[`diff_${route.difficulty}`]]}>
                  <Text style={styles.diffText}>{route.difficulty}</Text>
                </View>
              )}
            </View>
            <View style={styles.detailsRow}>
              <FontAwesome5 name="map-marker-alt" size={15} color="#D19761" />
              <Text style={styles.detailText}>Distancia: {route.distance_km ?? '--'} km</Text>
              <FontAwesome5 name="clock" size={15} color="#D19761" style={{ marginLeft: 18 }} />
              <Text style={styles.detailText}>Duración: {route.duration_min ?? '--'} min</Text>
            </View>
            {/* Puedes agregar más detalles, mapa, botón, etc. */}
          </View>
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F3F3F1',
  },
  content: {
    alignItems: 'center',
    paddingVertical: 24,
    paddingBottom: 40,
    minHeight: 500,
  },
  title: {
    fontSize: 21,
    fontWeight: 'bold',
    color: '#388e3c',
    marginTop: 12,
    marginBottom: 12,
    letterSpacing: 0.5,
  },
  routeCard: {
    width: 330,
    backgroundColor: '#fff',
    borderRadius: 17,
    padding: 20,
    marginBottom: 18,
    elevation: 2,
    shadowColor: '#aaa',
    shadowOpacity: 0.16,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 2 },
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 11,
  },
  routeName: {
    fontSize: 17,
    fontWeight: 'bold',
    marginLeft: 10,
    flex: 1,
    color: '#333',
  },
  difficulty: {
    backgroundColor: '#eee',
    borderRadius: 6,
    paddingHorizontal: 8,
    paddingVertical: 3,
    marginLeft: 6,
  },
  diffText: {
    fontSize: 13,
    fontWeight: 'bold',
    color: '#666',
  },
  diff_easy: { backgroundColor: '#B7F8C2' },
  diff_medium: { backgroundColor: '#FFE9A7' },
  diff_hard: { backgroundColor: '#FFD7D7' },
  detailsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 5,
    marginBottom: 1,
  },
  detailText: {
    fontSize: 14,
    color: '#666',
    marginLeft: 5,
    marginRight: 2,
  },
  empty: {
    color: '#888',
    marginTop: 50,
    fontSize: 16,
  },
});

