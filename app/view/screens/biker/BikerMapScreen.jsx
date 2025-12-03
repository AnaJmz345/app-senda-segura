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
import StartRouteButton from "./StartRouteButton";
import SOSEmergencyButton from "./SOSEmergencyButton";
import { useAuth } from '../../context/AuthContext';
import { useBikerSession } from '../../context/BikerSessionContext';


const { width, height } = Dimensions.get('window');

export default function BikerMapScreen({ navigation }) {
  const { user } = useAuth();
  const { activeSession, checkingSession, checkSession } = useBikerSession();
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

        try {
          result = await executeSql("SELECT * FROM routes WHERE is_active = 1");
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

  // Verificar sesión activa al montar
  useEffect(() => {
    if (!user?.id) return;

    checkSession(user.id);
  }, [user?.id, checkSession]);

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

  //ONLY SHOW ONE ROUTE
  const handleRoutePress = (route) => {
    setSelectedRoute(route);
    setFilteredRoutes([route]);

    if (route.coordinates && route.coordinates.length > 0 && mapRef.current) {
      const firstCoord = route.coordinates[0];
      mapRef.current.animateToRegion(
        {
          latitude: firstCoord.latitude,
          longitude: firstCoord.longitude,
          latitudeDelta: 0.015,
          longitudeDelta: 0.015,
        },
        800
      );
    }
  };

 const navigateToRouteDetail = (route) => {
  navigation.navigate("BikerRouteDetail", {
    routeId: route.id,
    routeName: route.name,
    difficulty: route.difficulty,
    distance_km: route.distance_km,
    duration_min: route.duration_min,
    description: route.description,
  });
};


  // RESET VIEW TO SHOW ALL ROUTES
  const resetRoutes = () => {
    setSelectedRoute(null);
    setFilteredRoutes(routes);

    mapRef.current?.animateToRegion(
      {
        latitude: 20.60612,
        longitude: -103.58203,
        latitudeDelta: 0.05,
        longitudeDelta: 0.05,
      },
      800
    );
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

        {/* STATE OF DB */}
        <View style={styles.dbStatus}>
          <Text
            style={[
              styles.dbStatusText,
              dbStatus === 'success' && styles.dbOK,
              dbStatus === 'error' && styles.dbError,
            ]}
          >
            {dbStatus === 'success'
              ? 'Base de datos'
              : dbStatus === 'error'
              ? 'Error'
              : 'Cargando'}
          </Text>
        </View>

        {/*CLOSE BUTTON WHEN VIEWING ONE ROUTE*/}
        {selectedRoute && (
          <TouchableOpacity style={styles.closeButton} onPress={resetRoutes}>
            <Ionicons name="close" size={24} color="#fff" />
          </TouchableOpacity>
        )}

      
        {selectedRoute && (
          <Animated.View style={[styles.routeCardNew, { opacity: fadeAnim }]}>
            <View style={styles.routeCardHeader}>
              <Text style={styles.routeCardTitle}>{selectedRoute.name}</Text>

              <View
                style={[
                  styles.difficultyPill,
                  {
                    backgroundColor: getDifficultyColor(
                      selectedRoute.difficulty
                    ),
                  },
                ]}
              >
                <Text style={styles.difficultyPillText}>
                  {selectedRoute.difficulty === 'easy'
                    ? 'Fácil'
                    : selectedRoute.difficulty === 'medium'
                    ? 'Medio'
                    : 'Difícil'}
                </Text>
              </View>
            </View>

            <View style={styles.metricRow}>
              <View style={styles.metricItem}>
                <FontAwesome5 name="route" size={20} color="#4CAF50" />
                <Text style={styles.metricLabel}>Distancia</Text>
                <Text style={styles.metricValue}>
                  {selectedRoute.distance_km} km
                </Text>
              </View>

              <View style={styles.metricSeparator} />

              <View style={styles.metricItem}>
                <FontAwesome5 name="clock" size={20} color="#FFC107" />
                <Text style={styles.metricLabel}>Duración</Text>
                <Text style={styles.metricValue}>
                  {selectedRoute.duration_min} min
                </Text>
              </View>
            </View>

            {selectedRoute.description ? (
              <Text style={styles.routeDescriptionNew}>
                {selectedRoute.description}
              </Text>
            ) : null}

            <TouchableOpacity
              style={styles.detailButtonNew}
              onPress={() => navigateToRouteDetail(selectedRoute)}
            >
              <Text style={styles.detailButtonNewText}>Ver detalles</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.showAllButton} onPress={resetRoutes}>
              <Text style={styles.showAllButtonText}>
                Mostrar todas las rutas
              </Text>
            </TouchableOpacity>
          </Animated.View>
        )}

    
        {!selectedRoute && (
          <View style={styles.mapInfo}>
            <Text style={styles.mapInfoText}>
              {filteredRoutes.length} rutas •{' '}
              {selectedDifficulty === 'all'
                ? 'Todas'
                : selectedDifficulty === 'easy'
                ? 'Fáciles'
                : selectedDifficulty === 'medium'
                ? 'Intermedias'
                : 'Difíciles'}
            </Text>
          </View>
        )}
      </View>

    
      {!selectedRoute && (
        <Animated.View style={[styles.filterContainer, { opacity: fadeAnim }]}>
          <Text style={styles.filterTitle}>Filtrar por dificultad:</Text>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.filterScrollContent}
          >

         
            <TouchableOpacity
              style={[
                styles.filterButton,
                selectedDifficulty === 'all' && styles.filterButtonActive,
              ]}
              onPress={() => filterRoutes('all')}
            >
              <Ionicons
                name="filter"
                size={16}
                color={selectedDifficulty === 'all' ? '#fff' : '#666'}
              />
              <Text
                style={[
                  styles.filterButtonText,
                  selectedDifficulty === 'all' &&
                    styles.filterButtonTextActive,
                ]}
              >
                Todas
              </Text>
            </TouchableOpacity>

          
            <TouchableOpacity
              style={[
                styles.filterButton,
                styles.filterEasy,
                selectedDifficulty === 'easy' && styles.filterButtonActive,
              ]}
              onPress={() => filterRoutes('easy')}
            >
              <MaterialIcons
                name="trending-flat"
                size={16}
                color={selectedDifficulty === 'easy' ? '#fff' : '#4CAF50'}
              />
              <Text
                style={[
                  styles.filterButtonText,
                  selectedDifficulty === 'easy' && styles.filterButtonTextActive,
                ]}
              >
                Fáciles
              </Text>
            </TouchableOpacity>

            {/* Medium */}
            <TouchableOpacity
              style={[
                styles.filterButton,
                styles.filterMedium,
                selectedDifficulty === 'medium' && styles.filterButtonActive,
              ]}
              onPress={() => filterRoutes('medium')}
            >
              <MaterialIcons
                name="terrain"
                size={16}
                color={selectedDifficulty === 'medium' ? '#fff' : '#FF9800'}
              />
              <Text
                style={[
                  styles.filterButtonText,
                  selectedDifficulty === 'medium' &&
                    styles.filterButtonTextActive,
                ]}
              >
                Intermedias
              </Text>
            </TouchableOpacity>

            {/* Hard */}
            <TouchableOpacity
              style={[
                styles.filterButton,
                styles.filterHard,
                selectedDifficulty === 'hard' && styles.filterButtonActive,
              ]}
              onPress={() => filterRoutes('hard')}
            >
              <MaterialIcons
                name="landscape"
                size={16}
                color={selectedDifficulty === 'hard' ? '#fff' : '#F44336'}
              />
              <Text
                style={[
                  styles.filterButtonText,
                  selectedDifficulty === 'hard' &&
                    styles.filterButtonTextActive,
                ]}
              >
                Difíciles
              </Text>
            </TouchableOpacity>
          </ScrollView>
          <SOSEmergencyButton navigation={navigation}
        currentRoute={selectedRoute} />
        </Animated.View>
      )}
      aqui cual es la diferencia entre ambos botones
      <StartRouteButton navigation={navigation} styleOverride={{
      bottom: selectedRoute ? 290 : 110
}} />

    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#F3F3F1" },

  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  loadingText: { marginTop: 10, fontSize: 16, color: "#666" },

  mapContainer: { flex: 1 },
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
  dbError: { color: "#F44336" },

  
  closeButton: {
    position: "absolute",
    top: 90,
    right: 20,
    backgroundColor: "rgba(0,0,0,0.7)",
    borderRadius: 30,
    padding: 8,
    zIndex: 20,
  },


  routeCardNew: {
    position: "absolute",
    bottom: 20,
    left: 20,
    right: 20,
    padding: 22,
    borderRadius: 20,
    backgroundColor: "rgba(255,255,255,0.97)",
    shadowColor: "#000",
    shadowOpacity: 0.25,
    shadowRadius: 10,
    elevation: 12,
  },

  routeCardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },

  routeCardTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#2C2C2C",
  },

  difficultyPill: {
    paddingHorizontal: 12,
    paddingVertical: 5,
    borderRadius: 30,
  },
  difficultyPillText: {
    color: "#fff",
    fontSize: 12,
    fontWeight: "700",
  },

  metricRow: {
    flexDirection: "row",
    justifyContent: "space-evenly",
    marginBottom: 14,
    marginTop: 4,
  },

  metricItem: {
    alignItems: "center",
    width: "40%",
  },

  metricLabel: {
    marginTop: 6,
    color: "#777",
    fontSize: 12,
  },

  metricValue: {
    marginTop: 3,
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
  },

  metricSeparator: {
    width: 1,
    backgroundColor: "#E6E6E6",
  },

  routeDescriptionNew: {
    textAlign: "center",
    fontSize: 14,
    color: "#666",
    marginVertical: 10,
  },

  detailButtonNew: {
    backgroundColor: "#388e3c",
    paddingVertical: 12,
    borderRadius: 12,
    marginTop: 8,
  },

  detailButtonNewText: {
    textAlign: "center",
    color: "#fff",
    fontWeight: "600",
    fontSize: 15,
  },

  showAllButton: {
    backgroundColor: "#4CAF50",
    paddingVertical: 10,
    borderRadius: 12,
    marginTop: 12,
  },

  showAllButtonText: {
    color: "white",
    fontWeight: "600",
    fontSize: 14,
    textAlign: "center",
  },


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
  },

  filterButtonActive: {
    backgroundColor: "#388e3c",
  },

  filterButtonText: {
    marginLeft: 6,
    fontSize: 14,
    fontWeight: "600",
    color: "#666",
  },

  filterButtonTextActive: {
    color: "#fff",
  },

  mapInfo: {
    position: "absolute",
    bottom: 10,
    left: 10,
    backgroundColor: "rgba(255,255,255,0.9)",
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 10,
  },
  mapInfoText: {
    fontSize: 12,
    fontWeight: "500",
    color: "#555",
  },

  marker: {
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 2,
    borderColor: "#fff",
  },
});