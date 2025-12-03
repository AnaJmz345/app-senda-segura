import React, { useEffect, useRef } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Animated,
} from "react-native";
import MapView, { Polyline, PROVIDER_GOOGLE } from "react-native-maps";

export default function RideSummaryScreen({ route, navigation }) {
  const { distance, time, path } = route.params;
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const mapRef = useRef(null);

  // Smooth UI
  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 900,
      useNativeDriver: true,
    }).start();
  }, []);

  // Center zoom on route nicely
  useEffect(() => {
    if (path.length > 0 && mapRef.current) {
      setTimeout(() => {
        mapRef.current.fitToCoordinates(path, {
          edgePadding: { top: 80, bottom: 80, left: 80, right: 80 },
          animated: true,
        });
      }, 300);
    }
  }, []);

  const formatTime = (sec) => {
    const m = Math.floor(sec / 60);
    const s = sec % 60;
    return `${m}:${s.toString().padStart(2, "0")}`;
  };

  return (
    <View style={styles.container}>
      <MapView
        ref={mapRef}
        style={styles.map}
        provider={PROVIDER_GOOGLE}
      >
        <Polyline coordinates={path} strokeColor="#4CAF50" strokeWidth={6} />
      </MapView>

      <Animated.View style={[styles.card, { opacity: fadeAnim }]}>
        <Text style={styles.title}>Tu ruta final</Text>

        <View style={styles.metrics}>
          <View>
            <Text style={styles.metricLabel}>Tiempo total</Text>
            <Text style={styles.metricValue}>{formatTime(time)}</Text>
          </View>

          <View>
            <Text style={styles.metricLabel}>Distancia</Text>
            <Text style={styles.metricValue}>{distance.toFixed(2)} km</Text>
          </View>
        </View>

        <TouchableOpacity
          style={styles.backBtn}
          onPress={() => navigation.navigate("BikerMapScreen")}
        >
          <Text style={styles.backText}>Volver al mapa</Text>
        </TouchableOpacity>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  map: { width: "100%", height: "100%" },

  card: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    padding: 30,
    backgroundColor: "rgba(17, 35, 27, 0.97)",
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
  },

  title: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#fff",
    marginBottom: 20,
    textAlign: "center",
  },

  metrics: {
    flexDirection: "row",
    justifyContent: "space-evenly",
    marginBottom: 20,
  },

  metricLabel: { color: "#9AB8A3", fontSize: 14 },
  metricValue: { color: "#4CAF50", fontSize: 28, fontWeight: "bold" },

  backBtn: {
    backgroundColor: "#388e3c",
    paddingVertical: 16,
    borderRadius: 18,
    marginTop: 20,
  },

  backText: {
    color: "#fff",
    fontSize: 17,
    fontWeight: "bold",
    textAlign: "center",
  },
});
