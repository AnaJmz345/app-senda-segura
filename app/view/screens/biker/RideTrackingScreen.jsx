import React, { useEffect, useRef } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Animated,
} from "react-native";
import MapView, { Polyline, PROVIDER_GOOGLE } from "react-native-maps";
import * as Location from "expo-location";
import { Ionicons } from "@expo/vector-icons";
import { useRideTracking } from "../../hooks/useRideTracking";

export default function RideTrackingScreen({ navigation }) {
  const mapRef = useRef(null);
  const fadeAnim = useRef(new Animated.Value(0)).current;

  const {
    isTracking,
    pathCoords,
    finishedPath,
    distanceKm,
    elapsedSec,
    startTracking,
    stopTracking,
  } = useRideTracking(mapRef);

  // UI animation
  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 800,
      useNativeDriver: true,
    }).start();
  }, []);

  // Center map on user immediately
  useEffect(() => {
    (async () => {
      const { status } =
        await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") return;

      const loc = await Location.getCurrentPositionAsync({});
      mapRef.current?.animateCamera({
        center: {
          latitude: loc.coords.latitude,
          longitude: loc.coords.longitude,
        },
        zoom: 17,
      });
    })();
  }, []);

  const formatTime = (sec) => {
    const h = Math.floor(sec / 3600);
    const m = Math.floor((sec % 3600) / 60);
    const s = sec % 60;
    return h > 0
      ? `${h}:${m.toString().padStart(2, "0")}:${s
          .toString()
          .padStart(2, "0")}`
      : `${m}:${s.toString().padStart(2, "0")}`;
  };

  return (
    <View style={styles.container}>
      <MapView
        ref={mapRef}
        style={styles.map}
        provider={PROVIDER_GOOGLE}
        showsUserLocation
      >
        {pathCoords.length > 1 && (
          <Polyline
            coordinates={pathCoords}
            strokeColor="#FBC02D"
            strokeWidth={5}
          />
        )}

        {finishedPath.length > 1 && (
          <Polyline
            coordinates={finishedPath}
            strokeColor="#4CAF50"
            strokeWidth={6}
          />
        )}
      </MapView>

      {/* BEAUTIFUL card */}
      <Animated.View style={[styles.card, { opacity: fadeAnim }]}>
        <View style={styles.metricsRow}>
          <View style={styles.metricBlock}>
            <Text style={styles.label}>Tiempo</Text>
            <Text style={styles.value}>{formatTime(elapsedSec)}</Text>
          </View>

          <View style={styles.verticalSeparator} />

          <View style={styles.metricBlock}>
            <Text style={styles.label}>Distancia</Text>
            <Text style={[styles.value, { color: "#FBC02D" }]}>
              {distanceKm.toFixed(2)} km
            </Text>
          </View>
        </View>

        {!isTracking ? (
          <TouchableOpacity style={styles.startBtn} onPress={startTracking}>
            <Ionicons name="play" size={22} color="#fff" />
            <Text style={styles.btnText}>Iniciar ruta</Text>
          </TouchableOpacity>
        ) : (
          <TouchableOpacity
            style={styles.stopBtn}
            onPress={() => {
              stopTracking();
              navigation.navigate("RideSummaryScreen", {
                distance: distanceKm,
                time: elapsedSec,
                path: finishedPath.length ? finishedPath : pathCoords,
              });
            }}
          >
            <Ionicons name="stop" size={22} color="#fff" />
            <Text style={styles.btnText}>Finalizar</Text>
          </TouchableOpacity>
        )}
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
    padding: 25,
    paddingBottom: 35,
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    backgroundColor: "rgba(17, 35, 27, 0.97)", // hermoso verde oscuro
    shadowColor: "#000",
    shadowOpacity: 0.3,
    shadowRadius: 20,
  },

  metricsRow: {
    flexDirection: "row",
    justifyContent: "space-evenly",
    marginBottom: 25,
  },

  metricBlock: { alignItems: "center" },

  label: { color: "#9AB8A3", fontSize: 14, marginBottom: 6 },

  value: {
    color: "#fff",
    fontSize: 36,
    fontWeight: "bold",
  },

  verticalSeparator: {
    width: 1,
    backgroundColor: "#2E4739",
    height: 50,
  },

  startBtn: {
    backgroundColor: "#4CAF50",
    flexDirection: "row",
    paddingVertical: 16,
    borderRadius: 16,
    justifyContent: "center",
    alignItems: "center",
  },

  stopBtn: {
    backgroundColor: "#D32F2F",
    flexDirection: "row",
    paddingVertical: 16,
    borderRadius: 16,
    justifyContent: "center",
    alignItems: "center",
  },

  btnText: {
    color: "#fff",
    marginLeft: 8,
    fontSize: 16,
    fontWeight: "bold",
  },
});
