import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  RefreshControl,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { MaterialIcons, Ionicons } from '@expo/vector-icons';
import { supabase } from '../../lib/supabase';
import TopMenu from '../../components/TopMenu';

export default function EmergencyListScreen({ navigation }) {
  const [emergencies, setEmergencies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  // Cargar emergencias al montar y cada vez que volvemos a la pantalla
  useFocusEffect(
    useCallback(() => {
      loadEmergencies();
    }, [])
  );

  const loadEmergencies = async () => {
    try {
      setLoading(true);

      // Query con JOIN entre emergencies y emergency_events
      const { data, error } = await supabase
        .from('emergencies')
        .select(`
          id,
          trigger_user_id,
          status,
          location,
          created_at,
          emergency_events (
            id,
            event_type,
            payload,
            created_at
          )
        `)
        .eq('status', 'pending')
        .order('created_at', { ascending: false });

      if (error) throw error;

      // Formatear datos
      const formatted = data.map(emergency => {
        const event = emergency.emergency_events?.[0] || {};
        const payload = event.payload || {};

        return {
          emergencyId: emergency.id,
          userId: emergency.trigger_user_id,
          userName: payload.user_name || 'Usuario desconocido',
          phone: payload.phone || 'Sin teléfono',
          routeType: payload.route_type || 'Sin ruta',
          coords: payload.coords || null,
          createdAt: emergency.created_at,
        };
      });

      setEmergencies(formatted);
    } catch (err) {
      console.error('Error cargando emergencias:', err);
      Alert.alert('Error', 'No se pudieron cargar las emergencias');
    } finally {
      setLoading(false);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await loadEmergencies();
    setRefreshing(false);
  };

  const handleGoToEmergency = (emergency) => {
    navigation.navigate('EmergencyDetailScreen', { emergency });
  };

  const getRouteColor = (routeType) => {
    if (!routeType || routeType === 'Sin ruta') return '#9E9E9E';
    
    const lower = routeType.toLowerCase();
    if (lower.includes('principiante') || lower.includes('easy')) return '#4CAF50';
    if (lower.includes('intermedio') || lower.includes('medium')) return '#2196F3';
    if (lower.includes('avanzado') || lower.includes('hard')) return '#FF9800';
    
    return '#9E9E9E';
  };

  const getRouteLevelText = (routeType) => {
    if (!routeType || routeType === 'Sin ruta') return 'Sin ruta';
    
    const lower = routeType.toLowerCase();
    if (lower.includes('principiante') || lower.includes('easy')) return 'Principiante';
    if (lower.includes('intermedio') || lower.includes('medium')) return 'Intermedio';
    if (lower.includes('avanzado') || lower.includes('hard')) return 'Avanzado';
    
    return routeType;
  };

  if (loading) {
    return (
      <View style={styles.container}>
        <TopMenu navigation={navigation} />
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#388e3c" />
          <Text style={styles.loadingText}>Cargando emergencias...</Text>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <TopMenu navigation={navigation} />

      <View style={styles.content}>
        {/* Título y descripción */}
        <View style={styles.header}>
          <Text style={styles.title}>Llamadas de emergencia</Text>
          <Text style={styles.subtitle}>
            Verifica si un paramédico ya tomó el caso antes de dirigirte a una zona.
          </Text>
        </View>

        {/* Contador */}
        <View style={styles.countCard}>
          <MaterialIcons name="emergency" size={24} color="#FF5252" />
          <Text style={styles.countText}>
            {emergencies.length} {emergencies.length === 1 ? 'emergencia activa' : 'emergencias activas'}
          </Text>
        </View>

        {/* Lista de emergencias */}
        {emergencies.length === 0 ? (
          <View style={styles.emptyContainer}>
            <Ionicons name="checkmark-circle-outline" size={64} color="#4CAF50" />
            <Text style={styles.emptyText}>No hay emergencias activas</Text>
            <Text style={styles.emptySubtext}>
              Todas las emergencias han sido atendidas
            </Text>
          </View>
        ) : (
          <ScrollView
            style={styles.scrollView}
            contentContainerStyle={styles.scrollContent}
            refreshControl={
              <RefreshControl
                refreshing={refreshing}
                onRefresh={onRefresh}
                colors={['#388e3c']}
              />
            }
          >
            {/* Header de la tabla */}
            <View style={styles.tableHeader}>
              <Text style={[styles.tableHeaderText, styles.columnUser]}>Usuario</Text>
              <Text style={[styles.tableHeaderText, styles.columnLocation]}>Ubicación</Text>
              <Text style={[styles.tableHeaderText, styles.columnAction]}>Ver ruta</Text>
            </View>

            {/* Filas de la tabla */}
            {emergencies.map((emergency) => (
              <View key={emergency.emergencyId} style={styles.tableRow}>
                <View style={styles.columnUser}>
                  <Text style={styles.userName} numberOfLines={1}>
                    {emergency.userName}
                  </Text>
                </View>

                <View style={styles.columnLocation}>
                  <View
                    style={[
                      styles.routeBadge,
                      { backgroundColor: getRouteColor(emergency.routeType) },
                    ]}
                  >
                    <Text style={styles.routeText}>
                      {getRouteLevelText(emergency.routeType)}
                    </Text>
                  </View>
                </View>

                <View style={styles.columnAction}>
                  <TouchableOpacity
                    style={styles.goButton}
                    onPress={() => handleGoToEmergency(emergency)}
                  >
                    <Text style={styles.goButtonText}>Ir</Text>
                  </TouchableOpacity>
                </View>
              </View>
            ))}
          </ScrollView>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F7F4',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: '#666',
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 10,
  },
  header: {
    marginBottom: 15,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1C3B28',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 14,
    color: '#666',
    lineHeight: 20,
  },
  countCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    padding: 12,
    borderRadius: 8,
    marginBottom: 15,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  countText: {
    marginLeft: 10,
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 60,
  },
  emptyText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#666',
    marginTop: 16,
  },
  emptySubtext: {
    fontSize: 14,
    color: '#999',
    marginTop: 8,
    textAlign: 'center',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 20,
  },
  tableHeader: {
    flexDirection: 'row',
    backgroundColor: '#E8F5E9',
    paddingVertical: 12,
    paddingHorizontal: 15,
    borderRadius: 8,
    marginBottom: 10,
  },
  tableHeaderText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#1C3B28',
  },
  tableRow: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    paddingVertical: 16,
    paddingHorizontal: 15,
    borderRadius: 8,
    marginBottom: 8,
    elevation: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    alignItems: 'center',
  },
  columnUser: {
    flex: 2,
  },
  columnLocation: {
    flex: 2,
    alignItems: 'center',
  },
  columnAction: {
    flex: 1,
    alignItems: 'flex-end',
  },
  userName: {
    fontSize: 15,
    fontWeight: '600',
    color: '#333',
  },
  routeBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
  },
  routeText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#fff',
  },
  goButton: {
    backgroundColor: '#4CAF50',
    paddingHorizontal: 20,
    paddingVertical: 8,
    borderRadius: 6,
  },
  goButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '700',
  },
});
