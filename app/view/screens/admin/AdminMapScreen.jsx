import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Alert, TouchableOpacity, ScrollView } from 'react-native';
import MapView, { Marker, PROVIDER_GOOGLE } from 'react-native-maps';
import { FontAwesome5, MaterialIcons } from '@expo/vector-icons';
import TopMenu from '../../components/TopMenu';
import AddMarkerModal from '../../components/AddMarkerModal';
import { MapMarkerController } from '../../../controllers/MapMarkerController';
import { useAuth } from '../../context/AuthContext';
import { COLORS } from '../../constants/colors';

const INITIAL_REGION = {
  latitude: 20.6050,
  longitude: -103.5820,
  latitudeDelta: 0.02,
  longitudeDelta: 0.02,
};

export default function AdminMapScreen({ navigation }) {
  const { user } = useAuth();
  const [markers, setMarkers] = useState([]);
  const [addMode, setAddMode] = useState(false);
  const [selectedCoords, setSelectedCoords] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadMarkers();
  }, []);

  const loadMarkers = async () => {
    setLoading(true);
    const result = await MapMarkerController.getAllMarkers();
    if (result.success) {
      setMarkers(result.data);
    }
    setLoading(false);
  };

  const handleMapPress = (event) => {
    if (!addMode) return;

    const { latitude, longitude } = event.nativeEvent.coordinate;
    setSelectedCoords({ latitude, longitude });
    setModalVisible(true);
  };

  const handleSaveMarker = async (markerData) => {
    const result = await MapMarkerController.createMarker(user.id, markerData);

    if (result.success) {
      Alert.alert(
        'Éxito',
        'Marcador agregado correctamente',
        [{ text: 'OK' }]
      );
      await loadMarkers();
      setAddMode(false);
      return true;
    } else {
      Alert.alert(
        'Error',
        result.error || 'No se pudo agregar el marcador',
        [{ text: 'OK' }]
      );
      return false;
    }
  };

  const handleDeleteMarker = (marker) => {
    Alert.alert(
      'Eliminar Marcador',
      `¿Estás seguro de eliminar "${marker.name || 'este marcador'}"?`,
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Eliminar',
          style: 'destructive',
          onPress: async () => {
            const result = await MapMarkerController.deleteMarker(marker.id);
            if (result.success) {
              Alert.alert('Éxito', 'Marcador eliminado');
              await loadMarkers();
            } else {
              Alert.alert('Error', 'No se pudo eliminar el marcador');
            }
          }
        }
      ]
    );
  };

  const toggleAddMode = () => {
    setAddMode(!addMode);
    if (addMode) {
      Alert.alert('Modo agregar desactivado', 'Ya no puedes agregar marcadores');
    } else {
      Alert.alert(
        'Modo agregar activado',
        'Toca en el mapa donde quieras agregar un marcador'
      );
    }
  };

  const getMarkerIcon = (type) => {
    return type === 'first_aid' ? 'first-aid' : 'signal-cellular-4-bar';
  };

  const getMarkerColor = (type) => {
    return type === 'first_aid' ? '#FF4444' : '#4CAF50';
  };

  const getMarkerTitle = (marker) => {
    if (marker.name) return marker.name;
    return marker.type === 'first_aid' ? 'Botiquín' : 'Zona con Señal';
  };

  return (
    <View style={styles.container}>
      <TopMenu navigation={navigation} />

      <View style={styles.mapContainer}>
        <MapView
          provider={PROVIDER_GOOGLE}
          style={styles.map}
          initialRegion={INITIAL_REGION}
          onPress={handleMapPress}
        >
          {markers.map((marker) => (
            <Marker
              key={marker.id}
              coordinate={{
                latitude: parseFloat(marker.latitude),
                longitude: parseFloat(marker.longitude)
              }}
              title={getMarkerTitle(marker)}
              description={marker.description || ''}
              onCalloutPress={() => handleDeleteMarker(marker)}
            >
              <View style={[
                styles.customMarker,
                { backgroundColor: getMarkerColor(marker.type) }
              ]}>
                {marker.type === 'first_aid' ? (
                  <FontAwesome5 name="first-aid" size={20} color="#FFF" />
                ) : (
                  <MaterialIcons name="signal-cellular-4-bar" size={20} color="#FFF" />
                )}
              </View>
            </Marker>
          ))}
        </MapView>

        {/* Botón flotante para activar modo agregar */}
        <TouchableOpacity
          style={[
            styles.addButton,
            addMode && styles.addButtonActive
          ]}
          onPress={toggleAddMode}
        >
          {addMode ? (
            <MaterialIcons name="close" size={28} color="#FFF" />
          ) : (
            <MaterialIcons name="add-location" size={28} color="#FFF" />
          )}
        </TouchableOpacity>

        {/* Indicador de modo agregar */}
        {addMode && (
          <View style={styles.modeIndicator}>
            <MaterialIcons name="touch-app" size={20} color="#FFF" />
            <Text style={styles.modeText}>Toca el mapa para agregar</Text>
          </View>
        )}

        {/* Stats card */}
        <View style={styles.statsCard}>
          <View style={styles.statItem}>
            <FontAwesome5 name="first-aid" size={18} color="#FF4444" />
            <Text style={styles.statNumber}>
              {markers.filter(m => m.type === 'first_aid').length}
            </Text>
            <Text style={styles.statLabel}>Botiquines</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statItem}>
            <MaterialIcons name="signal-cellular-4-bar" size={18} color="#4CAF50" />
            <Text style={styles.statNumber}>
              {markers.filter(m => m.type === 'cell_signal').length}
            </Text>
            <Text style={styles.statLabel}>Zonas Señal</Text>
          </View>
        </View>
      </View>

      {/* Modal para agregar marcador */}
      <AddMarkerModal
        visible={modalVisible}
        onClose={() => {
          setModalVisible(false);
          setSelectedCoords(null);
        }}
        onSave={handleSaveMarker}
        coordinates={selectedCoords}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F8F8',
  },
  mapContainer: {
    flex: 1,
    position: 'relative',
  },
  map: {
    flex: 1,
  },
  customMarker: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 3,
    borderColor: '#FFF',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 3,
    elevation: 5,
  },
  addButton: {
    position: 'absolute',
    bottom: 140,
    right: 20,
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: COLORS.mediumGreen,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5,
  },
  addButtonActive: {
    backgroundColor: '#FF6B6B',
  },
  modeIndicator: {
    position: 'absolute',
    top: 20,
    left: 20,
    right: 20,
    backgroundColor: COLORS.darkGreen,
    padding: 12,
    borderRadius: 10,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
    elevation: 3,
  },
  modeText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
  },
  statsCard: {
    position: 'absolute',
    bottom: 20,
    left: 20,
    right: 20,
    backgroundColor: '#FFF',
    borderRadius: 12,
    padding: 16,
    flexDirection: 'row',
    justifyContent: 'space-around',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  statItem: {
    alignItems: 'center',
    flex: 1,
  },
  statNumber: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginTop: 4,
  },
  statLabel: {
    fontSize: 12,
    color: '#666',
    marginTop: 2,
  },
  statDivider: {
    width: 1,
    backgroundColor: '#E0E0E0',
  },
});