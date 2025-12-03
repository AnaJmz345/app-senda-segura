import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from "react-native";
import MapView, { Polyline, PROVIDER_GOOGLE } from "react-native-maps";
import { Ionicons } from "@expo/vector-icons";
import { supabase } from "../../lib/supabase";
import { useAuth } from "../../context/AuthContext";


export default function UserRideHistoryScreen({ navigation }) {
  const { user } = useAuth();
  const [routes, setRoutes] = useState([]);

  useEffect(() => {
    loadUserRoutes();
  }, []);

  const loadUserRoutes = async () => {
    const { data, error } = await supabase
      .from("biker_sessions")
      .select(`
        id,
        finished_at,
        distance_m,
        elapsed_sec,
        biker_route_points(latitude, longitude)
      `)
      .eq("biker_id", user.id)
      .not("finished_at", "is", null)
      .order("finished_at", { ascending: false });

    if (!error && data) {
      const formatted = data.map((r) => ({
        ...r,
        coords: r.biker_route_points.map((p) => ({
          latitude: p.latitude,
          longitude: p.longitude,
        })),
      }));
      setRoutes(formatted);
    }
  };

  return (
    <ScrollView style={styles.container}>

      
      <View style={styles.backButtonContainer}>
        <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
          <Ionicons name="chevron-back" size={28} color="black" />
        </TouchableOpacity>
      </View>

      <View style={styles.titleContainer}>
        <Text style={styles.title}>Mis últimas rutas</Text>
      </View>

      {routes.length === 0 && (
        <Text style={styles.empty}>Aún no tienes rutas registradas.</Text>
      )}

      {routes.map((r) => (
        <View key={r.id} style={styles.card}>
          <MapView
            provider={PROVIDER_GOOGLE}
            style={styles.map}
            scrollEnabled={false}
            zoomEnabled={false}
            pitchEnabled={false}
            rotateEnabled={false}
            initialRegion={{
              latitude: r.coords[0]?.latitude || 20.6,
              longitude: r.coords[0]?.longitude || -103.58,
              latitudeDelta: 0.005,
              longitudeDelta: 0.005,
            }}
          >
            {r.coords.length > 1 && (
              <Polyline coordinates={r.coords} strokeColor="#388e3c" strokeWidth={4} />
            )}
          </MapView>

          <Text style={styles.meta}>
            {(r.distance_m / 1000).toFixed(2)} km • {Math.round(r.elapsed_sec / 60)} min
          </Text>
          <Text style={styles.date}>
            {new Date(r.finished_at).toLocaleDateString()}
          </Text>
        </View>
      ))}

    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F8F8F8",
    paddingTop: 65, 
  },

  
  backButtonContainer: {
    position: "absolute",
    top: 20,
    left: 20,
    zIndex: 50,
  },
  backButton: {
    backgroundColor: "#D19761",
    padding: 6,
    borderRadius: 6,
    elevation: 3,
  },

 
  titleContainer: {
    alignItems: "center",
    marginTop: 10,
    marginBottom: 10,
  },
  title: {
    fontSize: 22,
    fontWeight: "600",
    color: "black",
  },

  empty: {
    fontSize: 14,
    color: "#666",
    textAlign: "center",
    marginTop: 20,
  },


  card: {
    marginTop: 25,
    marginBottom: 20,
    backgroundColor: "#fff",
    borderRadius: 10,
    padding: 10,
    marginHorizontal: 20,
  },
  map: {
    width: "100%",
    height: 150,
    borderRadius: 8,
  },
  meta: {
    marginTop: 8,
    fontSize: 14,
    color: "#444",
  },
  date: {
    fontSize: 12,
    color: "#777",
  },
});
