import React from "react";
import { TouchableOpacity, Text, StyleSheet } from "react-native";
import * as Location from "expo-location";
import { supabase } from "../../lib/supabase";
import { useAuth } from "../../context/AuthContext";

export default function StartRouteButton() {
  const { user } = useAuth();

  const startRoute = async () => {
    try {
      // Solicitar permisos
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        alert("Permiso de ubicación requerido.");
        return;
      }

      // Obtener ubicación actual
      const location = await Location.getCurrentPositionAsync({});
      const coords = {
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
      };

      // Inserción correcta usando GeoJSON válido
      const { data, error } = await supabase
        .from("biker_sessions")
        .insert([
          {
            biker_id: user.id,
            status: "active",
            last_location: {
              type: "Point",
              coordinates: [coords.longitude, coords.latitude], // GeoJSON válido
            },
          },
        ]);

      if (error) throw error;

      alert("Ruta iniciada correctamente.");
    } catch (err) {
      console.error(err);
      alert("Error iniciando ruta.");
    }
  };

  return (
    <TouchableOpacity style={styles.button} onPress={startRoute}>
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
