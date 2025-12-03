import React, { useEffect, useState, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
  Dimensions,
  Animated
} from 'react-native';
import MapView, { Polyline, Marker, PROVIDER_GOOGLE } from 'react-native-maps';
import { Ionicons, FontAwesome5, MaterialIcons } from '@expo/vector-icons';
import TopMenu from '../../components/TopMenu';
import { executeSql } from '../../lib/sqlite';
import { MapMarkerController } from '../../../controllers/MapMarkerController';

const { width, height } = Dimensions.get('window');

export default function BikerMapScreen({ navigation }) {
  const [routes, setRoutes] = useState([]);
  const [filteredRoutes, setFilteredRoutes] = useState([]);
  const [selectedDifficulty, setSelectedDifficulty] = useState('all');
  const [loading, setLoading] = useState(true);
  const [selectedRoute, setSelectedRoute] = useState(null);
  const [dbStatus, setDbStatus] = useState('checking');
  const [markers, setMarkers] = useState([]);
  const mapRef = useRef(null);
  const fadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 800,
      useNativeDriver: true,
    }).start();
  }, []);

  useEffect(() => {
    loadMarkers();
  }, []);

  const loadMarkers = async () => {
    const result = await MapMarkerController.getAllMarkers();
    if (result.success) {
      setMarkers(result.data);
    }
  };

  useEffect(() => {
    const fetchRoutes = async () => {
      try {
        setDbStatus('checking');

        let result = null;

        // Intentar cargar desde SQLite
        try {
          result = await executeSql(
            "SELECT * FROM routes WHERE is_active = 1"
          );
        } catch (err) {
          result = null;
        }

        if (result && result.rows && result.rows.length > 0) {
          const routesData = result.rows._array || [];

          const processed = routesData.map(route => {
            let coords = [];

            try {
              if (
                route.geojson &&
                typeof route.geojson === "string" &&
                route.geojson.trim().startsWith("[") &&
                route.geojson.trim().endsWith("]")
              ) {
                coords = JSON.parse(route.geojson.trim());
              }
            } catch (e) {
              coords = [];
            }

            return {
              id: route.id,
              name: route.name,
              difficulty: route.difficulty,
              distance_km: route.distance_km || '--',
              duration_min: route.duration_min || '--',
              description: route.description || '',
              coordinates: coords
            };
          });

          setRoutes(processed);
          setFilteredRoutes(processed);
          setDbStatus('success');
        }

      } catch (error) {
        setDbStatus('error');
      }

      setLoading(false);
    };

    fetchRoutes();
  }, []);

  const filterRoutes = (difficulty) => {
    setSelectedDifficulty(difficulty);

    if (difficulty === 'all') {
      setFilteredRoutes(routes);
    } else {
      const filtered = routes.filter(route => route.difficulty === difficulty);
      setFilteredRoutes(filtered);
    }
  };

  const getDifficultyColor = (difficulty) => {
    switch (difficulty) {
      case 'easy': return '#4CAF50';
      case 'medium': return '#FF9800';
      case 'hard': return '#F44336';
      default: return '#757575';
    }
  };

  const getDifficultyIcon = (difficulty) => {
    switch (difficulty) {
      case 'easy': return 'trending-flat';
      case 'medium': return 'terrain';
      case 'hard': return 'landscape';
      default: return 'directions-bike';
    }
  };

  const handleRoutePress = (route) => {
    setSelectedRoute(route);

    if (route.coordinates && route.coordinates.length > 0 && mapRef.current) {
      const firstCoord = route.coordinates[0];
      mapRef.current.animateToRegion({
        latitude: firstCoord.latitude,
        longitude: firstCoord.longitude,
        latitudeDelta: 0.02,
        longitudeDelta: 0.02,
      }, 1000);
    }
  };

  const navigateToRouteDetail = (route) => {
    navigation.navigate('BikerRouteDetail', { 
      routeId: route.id,
      routeName: route.name 
    });
  };

  const getMarkerColor = (type) => {
    return type === 'first_aid' ? '#FF4444' : '#4CAF50';
  };

  const getMarkerTitle = (marker) => {
    if (marker.name) return marker.name;
    return marker.type === 'first_aid' ? 'Botiquín' : 'Zona con Señal';
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#388e3c" />
        <Text style={styles.loadingText}>Cargando rutas...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <TopMenu />

      <View style={styles.mapContainer}>
        <MapView
          ref={mapRef}
          style={styles.map}
          provider={PROVIDER_GOOGLE}
          initialRegion={{
            latitude: 20.60612,
            longitude: -103.58203,
            latitudeDelta: 0.05,
            longitudeDelta: 0.05,
          }}
          showsUserLocation={true}
          showsMyLocationButton={true}
        >
          {filteredRoutes.map((route) => (
            <React.Fragment key={route.id}>
              {route.coordinates && route.coordinates.length > 0 && (
                <Polyline
                  coordinates={route.coordinates}
                  strokeColor={getDifficultyColor(route.difficulty)}
                  strokeWidth={5}
                  opacity={0.8}
                />
              )}

              {route.coordinates && route.coordinates.length > 0 && (
                <Marker
                  coordinate={route.coordinates[0]}
                  onPress={() => handleRoutePress(route)}
                >
                  <View style={[styles.marker, { backgroundColor: getDifficultyColor(route.difficulty) }]}>
                    <MaterialIcons 
                      name={getDifficultyIcon(route.difficulty)} 
                      size={16} 
                      color="white" 
                    />
                  </View>
                </Marker>
              )}
            </React.Fragment>
          ))}

          {/* Marcadores de botiquines y señal */}
          {markers.map((marker) => (
            <Marker
              key={marker.id}
              coordinate={{
                latitude: parseFloat(marker.latitude),
                longitude: parseFloat(marker.longitude)
              }}
              title={getMarkerTitle(marker)}
              description={marker.description || ''}
            >
              <View style={[
                styles.customMarker,
                { backgroundColor: getMarkerColor(marker.type) }
              ]}>
                {marker.type === 'first_aid' ? (
                  <FontAwesome5 name="first-aid" size={18} color="#FFF" />
                ) : (
                  <MaterialIcons name="signal-cellular-4-bar" size={18} color="#FFF" />
                )}
              </View>
            </Marker>
          ))}
        </MapView>

        {/* Estado DB */}
        <View style={styles.dbStatus}>
          <Text style={[
            styles.dbStatusText,
            dbStatus === 'success' && styles.dbStatusSuccess,
            dbStatus === 'error' && styles.dbStatusError
          ]}>
            {dbStatus === 'success' ? 'Base de datos' :
             dbStatus === 'error' ? 'Error' :
             'Cargando'}
          </Text>
        </View>

        {/* Tarjeta de ruta */}
        {selectedRoute && (
          <Animated.View style={[styles.routeCard, { opacity: fadeAnim }]}>
            <View style={styles.routeHeader}>
              <View style={styles.routeTitleContainer}>
                <Text style={styles.routeName}>{selectedRoute.name}</Text>
                <View style={[
                  styles.difficultyBadge,
                  { backgroundColor: getDifficultyColor(selectedRoute.difficulty) }
                ]}>
                  <Text style={styles.difficultyText}>
                    {selectedRoute.difficulty === 'easy' ? 'Fácil' : 
                     selectedRoute.difficulty === 'medium' ? 'Medio' : 'Difícil'}
                  </Text>
                </View>
              </View>
              <TouchableOpacity 
                style={styles.detailButton}
                onPress={() => navigateToRouteDetail(selectedRoute)}
              >
                <Text style={styles.detailButtonText}>Ver detalles</Text>
              </TouchableOpacity>
            </View>

            <View style={styles.routeDetails}>
              <View style={styles.detailItem}>
                <FontAwesome5 name="route" size={14} color="#666" />
                <Text style={styles.detailText}>{selectedRoute.distance_km} km</Text>
              </View>
              <View style={styles.detailItem}>
                <FontAwesome5 name="clock" size={14} color="#666" />
                <Text style={styles.detailText}>{selectedRoute.duration_min} min</Text>
              </View>
            </View>

            {selectedRoute.description && (
              <Text style={styles.routeDescription}>{selectedRoute.description}</Text>
            )}

            <View style={styles.coordinatesInfo}>
              <Text style={styles.coordinatesText}>
                {selectedRoute.coordinates.length} puntos cargados
              </Text>
            </View>
          </Animated.View>
        )}

        {/* Info */}
        <View style={styles.mapInfo}>
          <Text style={styles.mapInfoText}>
            {filteredRoutes.length} rutas • {
              selectedDifficulty === 'all' ? 'Todas' :
              selectedDifficulty === 'easy' ? 'Fáciles' :
              selectedDifficulty === 'medium' ? 'Intermedias' : 'Difíciles'
            }
          </Text>
        </View>
      </View>

      {/* Filtros */}
      <Animated.View style={[styles.filterContainer, { opacity: fadeAnim }]}>
        <Text style={styles.filterTitle}>Filtrar por dificultad:</Text>
        <ScrollView 
          horizontal 
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.filterScrollContent}
        >
          {/* All */}
          <TouchableOpacity
            style={[
              styles.filterButton,
              selectedDifficulty === 'all' && styles.filterButtonActive
            ]}
            onPress={() => filterRoutes('all')}
          >
            <Ionicons 
              name="filter" 
              size={16} 
              color={selectedDifficulty === 'all' ? '#fff' : '#666'} 
            />
            <Text style={[
              styles.filterButtonText,
              selectedDifficulty === 'all' && styles.filterButtonTextActive
            ]}>
              Todas
            </Text>
          </TouchableOpacity>

          {/* Easy */}
          <TouchableOpacity
            style={[
              styles.filterButton,
              styles.filterEasy,
              selectedDifficulty === 'easy' && styles.filterButtonActive
            ]}
            onPress={() => filterRoutes('easy')}
          >
            <MaterialIcons 
              name="trending-flat" 
              size={16} 
              color={selectedDifficulty === 'easy' ? '#fff' : '#4CAF50'} 
            />
            <Text style={[
              styles.filterButtonText,
              selectedDifficulty === 'easy' && styles.filterButtonTextActive
            ]}>
              Fáciles
            </Text>
          </TouchableOpacity>

          {/* Medium */}
          <TouchableOpacity
            style={[
              styles.filterButton,
              styles.filterMedium,
              selectedDifficulty === 'medium' && styles.filterButtonActive
            ]}
            onPress={() => filterRoutes('medium')}
          >
            <MaterialIcons 
              name="terrain" 
              size={16} 
              color={selectedDifficulty === 'medium' ? '#fff' : '#FF9800'} 
            />
            <Text style={[
              styles.filterButtonText,
              selectedDifficulty === 'medium' && styles.filterButtonTextActive
            ]}>
              Intermedias
            </Text>
          </TouchableOpacity>

          {/* Hard */}
          <TouchableOpacity
            style={[
              styles.filterButton,
              styles.filterHard,
              selectedDifficulty === 'hard' && styles.filterButtonActive
            ]}
            onPress={() => filterRoutes('hard')}
          >
            <MaterialIcons 
              name="landscape" 
              size={16} 
              color={selectedDifficulty === 'hard' ? '#fff' : '#F44336'} 
            />
            <Text style={[
              styles.filterButtonText,
              selectedDifficulty === 'hard' && styles.filterButtonTextActive
            ]}>
              Difíciles
            </Text>
          </TouchableOpacity>
        </ScrollView>
      </Animated.View>

    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#F3F3F1" },

  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#F3F3F1",
  },
  loadingText: { marginTop: 10, color: "#666", fontSize: 16 },

  mapContainer: { flex: 1, position: "relative" },
  map: { width: "100%", height: "100%" },

  dbStatus: {
    position: "absolute",
    top: 10,
    left: 10,
    backgroundColor: "rgba(255,255,255,0.9)",
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 10,
  },
  dbStatusText: { fontSize: 12, fontWeight: "600" },
  dbOK: { color: "#4CAF50" },
  dbFallback: { color: "#FF9800" },
  dbError: { color: "#F44336" },

  filterContainer: {
    position: "absolute",
    top: 120,
    left: 0,
    right: 0,
    backgroundColor: "rgba(243,243,241,0.95)",
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderBottomLeftRadius: 15,
    borderBottomRightRadius: 15,
  },
  filterTitle: {
    fontSize: 12,
    color: "#666",
    marginBottom: 5,
    marginLeft: 5,
    fontWeight: "500",
  },
  filterScrollContent: { paddingVertical: 5 },
  filterButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "white",
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 25,
    marginRight: 10,
    elevation: 3,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  filterButtonActive: { backgroundColor: "#388e3c" },
  filterButtonText: {
    marginLeft: 6,
    fontSize: 14,
    fontWeight: "600",
    color: "#666",
  },
  filterButtonTextActive: { color: "#fff" },

  marker: {
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 2,
    borderColor: "#fff",
    elevation: 4,
  },

  customMarker: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#FFF',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 3,
    elevation: 5,
  },

  routeCard: {
    position: "absolute",
    bottom: 20,
    left: 20,
    right: 20,
    backgroundColor: "white",
    borderRadius: 15,
    padding: 16,
    elevation: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
  },
  routeName: { fontSize: 18, fontWeight: "bold", color: "#333" },

  difficultyBadge: {
    alignSelf: "flex-start",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    marginTop: 6,
  },
  difficultyText: { color: "#fff", fontSize: 12, fontWeight: "bold" },

  routeDetails: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginVertical: 12,
  },
  detailItem: { flexDirection: "row", alignItems: "center" },
  detailText: {
    marginLeft: 6,
    fontSize: 14,
    color: "#666",
    fontWeight: "500",
  },

  routeDescription: {
    fontSize: 13,
    color: "#888",
    fontStyle: "italic",
    marginTop: 8,
    textAlign: "center",
  },

  showAllButton: {
    backgroundColor: "#388e3c",
    paddingVertical: 8,
    borderRadius: 10,
    marginTop: 14,
  },
  showAllButtonText: {
    color: "white",
    textAlign: "center",
    fontSize: 14,
    fontWeight: "600",
  },
});