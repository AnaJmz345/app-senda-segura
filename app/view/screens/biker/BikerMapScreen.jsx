import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
} from 'react-native';
import RouteCard from '../../components/RouteCard';
import SOSButton from '../../components/SOSButton';

const BikerMapScreen = ({ navigation }) => {
  const [showRouteCard, setShowRouteCard] = useState(false);

  const handleMapPress = () => {
    setShowRouteCard(true);
  };

  const handleCloseRouteCard = () => {
    setShowRouteCard(false);
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Header Simple */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Biker Mapa</Text>
      </View>

      {/* un mapa simple por mientras - con un clic abre RouteCard */}
      <TouchableOpacity 
        style={styles.mapContainer} 
        onPress={handleMapPress}
        activeOpacity={0.8}
      >
        <View style={styles.mapPlaceholder}>
          <Text style={styles.mapText}>🗺️ Mapa del Bosque</Text>
          <Text style={styles.mapSubText}>Toca para ver rutas disponibles</Text>
        </View>
      </TouchableOpacity>

      {/* para el SOSButton */}
      <SOSButton navigation={navigation} />

      {/* RouteCard Modal/Overlay */}
      {showRouteCard && (
        <RouteCard 
          onClose={handleCloseRouteCard}
          navigation={navigation}
        />
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#DAD7CD',
  },
  header: {
    paddingHorizontal: 20,
    paddingVertical: 15,
    backgroundColor: '#A3B18A',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#344E41',
  },
  mapContainer: {
    flex: 1,
    margin: 20,
  },
  mapPlaceholder: {
    flex: 1,
    backgroundColor: '#ffffff',
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  mapText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#344E41',
    marginBottom: 10,
  },
  mapSubText: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
  },
});

export default BikerMapScreen;
