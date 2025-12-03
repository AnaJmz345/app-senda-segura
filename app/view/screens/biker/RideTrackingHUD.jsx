import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";

function formatTime(sec) {
  const h = Math.floor(sec / 3600);
  const m = Math.floor((sec % 3600) / 60);
  const s = sec % 60;

  if (h > 0) {
    return `${h.toString().padStart(2, "0")}:${m
      .toString()
      .padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
  }
  return `${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
}

export default function RideTrackingHUD({
  isTracking,
  elapsedSec,
  distanceKm,
  onStart,
  onStop,
}) {
  return (
    <View style={styles.container}>
      <View style={styles.card}>
        <View style={styles.row}>
          <View style={styles.metricBlock}>
            <Text style={styles.metricLabel}>Tiempo</Text>
            <Text style={styles.metricValue}>{formatTime(elapsedSec)}</Text>
          </View>
          <View style={styles.metricBlock}>
            <Text style={styles.metricLabel}>Distancia</Text>
            <Text style={styles.metricValue}>
              {distanceKm.toFixed(2)} km
            </Text>
          </View>
          <View style={styles.metricBlock}>
            <Text style={styles.metricLabel}>Estado</Text>
            <Text
              style={[
                styles.statusText,
                isTracking ? styles.statusActive : styles.statusIdle,
              ]}
            >
              {isTracking ? "En curso" : "Listo"}
            </Text>
          </View>
        </View>

        <View style={styles.actionsRow}>
          {!isTracking ? (
            <TouchableOpacity style={styles.primaryButton} onPress={onStart}>
              <Text style={styles.primaryText}>Iniciar ruta</Text>
            </TouchableOpacity>
          ) : (
            <TouchableOpacity style={styles.stopButton} onPress={onStop}>
              <Text style={styles.stopText}>Terminar ruta</Text>
            </TouchableOpacity>
          )}
        </View>

        <View style={styles.legendRow}>
          <View style={styles.legendItem}>
            <View style={[styles.legendDot, { backgroundColor: "#4CAF50" }]} />
            <Text style={styles.legendText}>Ruta sugerida</Text>
          </View>
          <View style={styles.legendItem}>
            <View style={[styles.legendDot, { backgroundColor: "#FBC02D" }]} />
            <Text style={styles.legendText}>Ruta recorrida</Text>
          </View>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: "absolute",
    left: 16,
    right: 16,
    bottom: 20,
  },
  card: {
    backgroundColor: "rgba(15, 31, 22, 0.98)",
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 14,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.25,
    shadowRadius: 16,
    elevation: 12,
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  metricBlock: {
    flex: 1,
    paddingRight: 8,
  },
  metricLabel: {
    color: "#9AB8A3",
    fontSize: 12,
    marginBottom: 4,
  },
  metricValue: {
    color: "#FFFFFF",
    fontSize: 20,
    fontWeight: "700",
  },
  statusText: {
    fontSize: 14,
    fontWeight: "600",
  },
  statusActive: {
    color: "#FBC02D",
  },
  statusIdle: {
    color: "#81C784",
  },
  actionsRow: {
    marginTop: 14,
    flexDirection: "row",
    justifyContent: "flex-end",
  },
  primaryButton: {
    backgroundColor: "#388e3c",
    borderRadius: 999,
    paddingHorizontal: 22,
    paddingVertical: 10,
  },
  primaryText: {
    color: "#ffffff",
    fontWeight: "700",
    fontSize: 14,
  },
  stopButton: {
    backgroundColor: "#D32F2F",
    borderRadius: 999,
    paddingHorizontal: 22,
    paddingVertical: 10,
  },
  stopText: {
    color: "#ffffff",
    fontWeight: "700",
    fontSize: 14,
  },
  legendRow: {
    marginTop: 10,
    flexDirection: "row",
    justifyContent: "space-between",
  },
  legendItem: {
    flexDirection: "row",
    alignItems: "center",
  },
  legendDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    marginRight: 6,
  },
  legendText: {
    color: "#C8E6C9",
    fontSize: 11,
  },
});
