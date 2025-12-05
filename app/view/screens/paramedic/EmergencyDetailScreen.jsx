import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert,
  ScrollView,
  Linking,
} from 'react-native';
import MapView, { Marker, PROVIDER_GOOGLE } from 'react-native-maps';
import { Ionicons, MaterialIcons } from '@expo/vector-icons';
import { supabase } from '../../lib/supabase';
import { useAuth } from '../../context/AuthContext';

export default function EmergencyDetailScreen({ route, navigation }) {
  const { emergency } = route.params;
  const { user } = useAuth();
  const [updating, setUpdating] = useState(false);

  const handleCallUser = () => {
    if (!emergency.phone || emergency.phone === 'Sin teléfono') {
      Alert.alert('Error', 'No hay número de teléfono disponible');
      return;
    }

    const phoneNumber = emergency.phone.replace(/\s/g, '');
    Linking.openURL(`tel:${phoneNumber}`);
  };

  const handleOpenMaps = () => {
    if (!emergency.coords) {
      Alert.alert('Error', 'No hay coordenadas disponibles');
      return;
    }

    const { latitude, longitude } = emergency.coords;
    const url = `https://www.google.com/maps/dir/?api=1&destination=${latitude},${longitude}`;
    
    Linking.openURL(url).catch(() => {
      Alert.alert('Error', 'No se pudo abrir Google Maps');
    });
  };

  const handleMarkAsAttended = async () => {
    Alert.alert(
      'Confirmar',
      '¿Marcar esta emergencia como atendida?',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Confirmar',
          onPress: async () => {
            try {
              setUpdating(true);

              const { error } = await supabase
                .from('emergencies')
                .update({ 
                  status: 'resolved',
                  attended_by: user.id,
                  updated_at: new Date().toISOString(),
                })
                .eq('id', emergency.emergencyId);

              if (error) throw error;

              Alert.alert(
                'Éxito',
                'La emergencia ha sido marcada como atendida',
                [
                  {
                    text: 'OK',
                    onPress: () => navigation.goBack(),
                  },
                ]
              );
            } catch (err) {
              console.error('Error actualizando emergencia:', err);
              Alert.alert('Error', 'No se pudo actualizar la emergencia');
            } finally {
              setUpdating(false);
            }
          },
        },
      ]
    );
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleString('es-MX', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const initialRegion = emergency.coords
    ? {
        latitude: emergency.coords.latitude,
        longitude: emergency.coords.longitude,
        latitudeDelta: 0.01,
        longitudeDelta: 0.01,
      }
    : {
        latitude: 20.60612,
        longitude: -103.58203,
        latitudeDelta: 0.05,
        longitudeDelta: 0.05,
      };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Ionicons name="arrow-back" size={24} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Detalle de Emergencia</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView style={styles.content}>
        {/* Mapa */}
        <View style={styles.mapContainer}>
          {emergency.coords ? (
            <MapView
              style={styles.map}
              provider={PROVIDER_GOOGLE}
              initialRegion={initialRegion}
            >
              <Marker
                coordinate={{
                  latitude: emergency.coords.latitude,
                  longitude: emergency.coords.longitude,
                }}
                title={emergency.userName}
                description="Ubicación de la emergencia"
              >
                <View style={styles.markerContainer}>
                  <MaterialIcons name="emergency" size={32} color="#FF5252" />
                </View>
              </Marker>
            </MapView>
          ) : (
            <View style={styles.noMapContainer}>
              <MaterialIcons name="location-off" size={48} color="#999" />
              <Text style={styles.noMapText}>Sin ubicación disponible</Text>
            </View>
          )}
        </View>

        {/* Información del usuario */}
        <View style={styles.infoCard}>
          <View style={styles.infoHeader}>
            <MaterialIcons name="person" size={24} color="#388e3c" />
            <Text style={styles.infoTitle}>Información del Usuario</Text>
          </View>

          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Nombre:</Text>
            <Text style={styles.infoValue}>{emergency.userName}</Text>
          </View>

          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Teléfono:</Text>
            <Text style={styles.infoValue}>{emergency.phone}</Text>
          </View>

          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Ruta:</Text>
            <Text style={styles.infoValue}>{emergency.routeType}</Text>
          </View>

          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Hora:</Text>
            <Text style={styles.infoValue}>{formatDate(emergency.createdAt)}</Text>
          </View>

          {emergency.coords && (
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Coordenadas:</Text>
              <Text style={styles.infoValue}>
                {emergency.coords.latitude.toFixed(6)}, {emergency.coords.longitude.toFixed(6)}
              </Text>
            </View>
          )}
        </View>

        {/* Botones de acción */}
        <View style={styles.actionsContainer}>
          <TouchableOpacity
            style={styles.actionButton}
            onPress={handleCallUser}
            disabled={!emergency.phone || emergency.phone === 'Sin teléfono'}
          >
            <Ionicons name="call" size={20} color="#fff" />
            <Text style={styles.actionButtonText}>Llamar al usuario</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.actionButton, styles.mapsButton]}
            onPress={handleOpenMaps}
            disabled={!emergency.coords}
          >
            <Ionicons name="navigate" size={20} color="#fff" />
            <Text style={styles.actionButtonText}>Abrir en Google Maps</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.actionButton, styles.attendButton]}
            onPress={handleMarkAsAttended}
            disabled={updating}
          >
            <MaterialIcons name="check-circle" size={20} color="#fff" />
            <Text style={styles.actionButtonText}>
              {updating ? 'Actualizando...' : 'Marcar como atendida'}
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F7F4',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#388e3c',
    paddingTop: 50,
    paddingBottom: 15,
    paddingHorizontal: 15,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  backButton: {
    padding: 5,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#fff',
  },
  content: {
    flex: 1,
  },
  mapContainer: {
    height: 250,
    backgroundColor: '#E0E0E0',
  },
  map: {
    width: '100%',
    height: '100%',
  },
  markerContainer: {
    backgroundColor: '#fff',
    padding: 8,
    borderRadius: 50,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 3,
  },
  noMapContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  noMapText: {
    fontSize: 16,
    color: '#999',
    marginTop: 10,
  },
  infoCard: {
    backgroundColor: '#fff',
    margin: 15,
    padding: 15,
    borderRadius: 10,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  infoHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
    paddingBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  infoTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#333',
    marginLeft: 10,
  },
  infoRow: {
    flexDirection: 'row',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#F5F5F5',
  },
  infoLabel: {
    fontSize: 15,
    fontWeight: '600',
    color: '#666',
    width: 100,
  },
  infoValue: {
    flex: 1,
    fontSize: 15,
    color: '#333',
  },
  actionsContainer: {
    padding: 15,
    paddingBottom: 30,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#2196F3',
    paddingVertical: 14,
    paddingHorizontal: 20,
    borderRadius: 8,
    marginBottom: 12,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
  },
  mapsButton: {
    backgroundColor: '#FF9800',
  },
  attendButton: {
    backgroundColor: '#4CAF50',
  },
  actionButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '700',
    marginLeft: 10,
  },
});
