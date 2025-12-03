import React from "react";
import { TouchableOpacity, Text, StyleSheet } from "react-native";

export default function StartRouteButton({ navigation, styleOverride = {} }) {
  return (
    <TouchableOpacity
      style={[styles.button, styleOverride]}
      onPress={() => navigation.navigate("RideTrackingScreen")}
    >
      <Text style={styles.text}>Iniciar ruta</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    position: "absolute",
    bottom: 110,
    right: 20,
    backgroundColor: "#388e3c",
    paddingVertical: 14,
    paddingHorizontal: 20,
    borderRadius: 50,
    elevation: 6,
  },
  text: { color: "white", fontWeight: "700", fontSize: 15 },
});
