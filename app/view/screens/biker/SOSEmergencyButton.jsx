import React from "react";
import { TouchableOpacity, Text, StyleSheet, View } from "react-native";
import * as Location from "expo-location";
import { useAuth } from "../../context/AuthContext";
import { getLocalProfileById } from "../../../models/BikerProfileModel";
import { EmergencyController } from "../../../controllers/EmergencyController";

export default function SOSEmergencyButton({ navigation, currentRoute }) {
  const { user } = useAuth();

  const handleSOS = async () => {
    // 1. Obtener perfil local
    const profile = await getLocalProfileById(user.id);

    // 2. Pedir permiso de ubicación
    const { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== "granted") {
      alert("Permiso de ubicación denegado.");
      return;
    }

    // 3. Obtener ubicación actual
    const loc = await Location.getCurrentPositionAsync({});
    const coords = {
      latitude: loc.coords.latitude,
      longitude: loc.coords.longitude,
    };

    // 4. Registrar la emergencia con tu controlador
    const result = await EmergencyController.triggerEmergency(
      user,
      profile,
      currentRoute?.name ?? "Sin ruta",
      coords
    );

    // 5. Manejo de resultado
    if (result.ok) {
      navigation.navigate("SOSEmergencyCallScreen", {
        emergencyId: result.emergencyId
      });
    } else {
      alert("Error al enviar emergencia.");
    }
  };

  return (
    <View style={styles.wrapper}>
      <TouchableOpacity style={styles.button} onPress={handleSOS}>
        <Text style={styles.text}>SOS</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    position: "absolute",
    top: 110,
    right: 20,
    zIndex: 999,
  },
  button: {
    backgroundColor: "#D90000",
    paddingVertical: 6,
    paddingHorizontal: 16,
    borderRadius: 8,
    borderWidth: 2,
    borderColor: "#FFFFFF",
    elevation: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
  },
  text: {
    color: "white",
    fontWeight: "900",
    fontSize: 16,
  },
});
