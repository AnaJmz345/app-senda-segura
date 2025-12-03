import React, { useEffect, useState, useCallback } from "react";
import { useFocusEffect } from "@react-navigation/native";
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
} from "react-native";
import MapView, { Polyline } from "react-native-maps";
import TopMenu from "../../components/TopMenu";
import { useAuth } from "../../context/AuthContext";
import { loadUserProfile } from "../../../controllers/BikerProfileController";
import { supabase } from "../../lib/supabase";
import { Ionicons, FontAwesome5 } from "@expo/vector-icons";

export default function BikerProfileScreen({ navigation }) {
  const { user, signOut } = useAuth();
  const [profile, setProfile] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [stats, setStats] = useState(null);
  const [recentRoutes, setRecentRoutes] = useState([]);
  const [loading, setLoading] = useState(true);

  // Cargar perfil local (sqlite)
  useFocusEffect(
    useCallback(() => {
      const load = async () => {
        const data = await loadUserProfile(user.id);
        setProfile(data);
      };
      load();
    }, [user?.id])
  );

  const loadReviews = async () => {
    if (!user?.id) return;

    console.log("[REVIEWS] Cargando reseñas para user_id=", user.id);

    const { data, error } = await supabase
      .from("route_reviews")
      .select("id, comment, rating, created_at, route_id")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false });

    if (error) {
      console.log("[REVIEWS] Error al cargar reseñas:", error);
      return;
    }

    console.log("[REVIEWS] Encontradas:", data?.length || 0);

    setReviews(
      (data || []).map((r) => ({
        ...r,
        route_name: r.route_id,
      }))
    );
  };

  const loadStats = async () => {
    if (!user?.id) return;

    const { data, error } = await supabase
      .from("biker_sessions")
      .select(
        `
      id,
      finished_at,
      distance_m,
      elapsed_sec,
      route_id,
      routes(name, distance_km, duration_min),
      biker_route_points(latitude, longitude)
    `
      )
      .eq("biker_id", user.id)
      .not("finished_at", "is", null);

    if (error || !data) {
      console.log("[STATS] Error:", error);
      return;
    }

    let total_distance = 0;
    let total_time = 0;

    data.forEach((s) => {
      if (s.routes?.distance_km) {
        total_distance += s.routes.distance_km;
        total_time += s.routes.duration_min;
      } else {
        total_distance += (s.distance_m || 0) / 1000;
        total_time += Math.round((s.elapsed_sec || 0) / 60);
      }
    });

    const now = new Date();
    const weekAgo = new Date(now);
    weekAgo.setDate(now.getDate() - 7);

    const monthAgo = new Date(now);
    monthAgo.setMonth(now.getMonth() - 1);

    const weekly = data.filter((s) => new Date(s.finished_at) >= weekAgo);
    const monthly = data.filter((s) => new Date(s.finished_at) >= monthAgo);

    setStats({
      routes_completed: data.length,
      total_distance: Number(total_distance.toFixed(1)),
      total_time,
      weekly: weekly.length,
      monthly: monthly.length,
    });

    const lastThree = data
      .sort((a, b) => new Date(b.finished_at) - new Date(a.finished_at))
      .slice(0, 3);

    const recentWithCoords = lastThree.map((s) => ({
      ...s,
      coords: s.biker_route_points.map((p) => ({
        latitude: p.latitude,
        longitude: p.longitude,
      })),
    }));

    setRecentRoutes(recentWithCoords);
  };

  // Cargar reseñas + stats cuando ya tenemos user.id
  useEffect(() => {
    if (!user?.id) return;

    const fetchAll = async () => {
      await Promise.all([loadReviews(), loadStats()]);
      setLoading(false);
    };

    fetchAll();
  }, [user?.id]);

  const handleLogout = async () => {
    await signOut();
  };

  return (
    <ScrollView contentContainerStyle={styles.content}>
      <TopMenu navigation={navigation} />

      {/* Avatar + nombre */}
      <View style={styles.profileSection}>
        <Image
          source={{
            uri:
              profile?.avatar_url ||
              "https://i.pinimg.com/736x/bc/98/0b/bc980b9e0bf723ac8393222ff0249da9.jpg",
          }}
          style={styles.profileImage}
        />
        <Text style={styles.name}>
          {profile?.real_display_name || "Ciclista"}
        </Text>
      </View>

      {/* Opciones */}
      <View style={styles.options}>
        <TouchableOpacity
          style={styles.optionButton}
          onPress={() => navigation.navigate("EditBikerProfile")}
        >
          <Ionicons name="person-outline" size={24} color="black" />
          <Text style={styles.optionText}>Editar perfil</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.optionButton}
          onPress={() => navigation.navigate("BikerMedicalDataForm")}
        >
          <FontAwesome5 name="briefcase-medical" size={22} color="black" />
          <Text style={styles.optionText}>Agregar datos médicos</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.optionButton}
          onPress={() => navigation.navigate("EmergencyContacts")}
        >
          <FontAwesome5 name="ambulance" size={22} color="black" />
          <Text style={styles.optionText}>Contactos de emergencia</Text>
        </TouchableOpacity>

        <TouchableOpacity
  style={styles.optionButton}
  onPress={() => navigation.navigate("UserRideHistoryScreen")}
>
  <FontAwesome5 name="route" size={22} color="black" />
  <Text style={styles.optionText}>Ver mis últimas rutas</Text>
</TouchableOpacity>

      </View>

      {/* Stats */}
      {stats && (
        <View style={styles.statsContainer}>
          <Text style={styles.statsTitle}>Tu actividad</Text>

          <View style={styles.statRow}>
            <Text style={styles.statLabel}>Rutas completadas</Text>
            <Text style={styles.statValue}>{stats.routes_completed}</Text>
          </View>

          <View style={styles.statRow}>
            <Text style={styles.statLabel}>Esta semana</Text>
            <Text style={styles.statValue}>{stats.weekly}</Text>
          </View>

          <View style={styles.statRow}>
            <Text style={styles.statLabel}>Este mes</Text>
            <Text style={styles.statValue}>{stats.monthly}</Text>
          </View>

          <View style={styles.statRow}>
            <Text style={styles.statLabel}>Distancia total</Text>
            <Text style={styles.statValue}>{stats.total_distance} km</Text>
          </View>

          <View style={styles.statRow}>
            <Text style={styles.statLabel}>Tiempo total</Text>
            <Text style={styles.statValue}>{stats.total_time} min</Text>
          </View>

          {/* Gráfica tipo Strava */}
          <Text style={[styles.statsTitle, { marginTop: 25 }]}>
            Actividad mensual
          </Text>

          <View style={styles.stravaGraph}>
            {[stats.weekly, stats.monthly, stats.routes_completed].map(
              (val, idx) => (
                <View key={idx} style={styles.stravaColumn}>
                  <View style={[styles.stravaDot]} />
                  <View
                    style={[
                      styles.stravaLine,
                      { height: val * 8 || 4 },
                    ]}
                  />
                  <Text style={styles.graphLabel}>
                    {idx === 0 ? "Semana" : idx === 1 ? "Mes" : "Total"}
                  </Text>
                </View>
              )
            )}
          </View>
        </View>
      )}

      {/* Últimas rutas */}
      {recentRoutes.length > 0 && (
        <View style={styles.recentContainer}>
          <Text style={styles.statsTitle}>Últimas rutas</Text>

          {recentRoutes.map((r) => (
            <View key={r.id} style={styles.recentCard}>
              <Text style={styles.recentName}>
                {r.routes?.name || "Ruta registrada"}
              </Text>

              <MapView
                style={styles.miniMap}
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
                  <Polyline
                    coordinates={r.coords}
                    strokeColor="#388e3c"
                    strokeWidth={4}
                  />
                )}
              </MapView>

              <Text style={styles.recentMeta}>
                {(r.distance_m / 1000).toFixed(2)} km •{" "}
                {Math.round(r.elapsed_sec / 60) + " min"}
              </Text>
              <Text style={styles.recentDate}>
                {new Date(r.finished_at).toLocaleDateString()}
              </Text>
            </View>
          ))}
        </View>
      )}

      {/* Reviews */}
      <View style={styles.reviewsContainer}>
        <Text style={styles.statsTitle}>Tus reseñas</Text>

        {loading && <ActivityIndicator size="small" color="#388e3c" />}

        {!loading && reviews.length === 0 && (
          <Text style={styles.noReviews}>Aún no has enviado reseñas.</Text>
        )}

        {reviews.map((r) => (
          <View key={r.id} style={styles.reviewCard}>
            <Text style={styles.reviewRoute}>{r.route_name}</Text>
            <Text style={styles.reviewText}>{r.comment}</Text>
            <Text style={styles.reviewStars}>
              Calificación: {r.rating} ⭐
            </Text>
            <Text style={styles.reviewDate}>
              {new Date(r.created_at).toLocaleDateString()}
            </Text>
          </View>
        ))}
      </View>

      {/* Logout */}
      <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
        <Text style={styles.logoutText}>Cerrar sesión</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}



const styles = StyleSheet.create({
  content: { alignItems: "center", paddingBottom: 40 },

  profileSection: { alignItems: "center", marginTop: -50 },
  profileImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
    borderWidth: 3,
    borderColor: "#fff",
  },
  name: { marginTop: 10, fontSize: 18, fontWeight: "500" },

  options: { marginTop: 30, width: "80%" },
  optionButton: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 15,
  },
  optionText: { marginLeft: 15, fontSize: 16, color: "#000" },

  statsContainer: { width: "80%", marginTop: 35 },
  statsTitle: {
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 12,
    color: "#000",
  },

  statRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 6,
  },
  statLabel: { fontSize: 15, color: "#555" },
  statValue: { fontSize: 16, fontWeight: "600" },

  stravaGraph: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginTop: 15,
    height: 120,
    alignItems: "flex-end",
  },
  stravaColumn: { alignItems: "center" },
  stravaLine: {
    width: 6,
    backgroundColor: "#388e3c",
    borderRadius: 3,
  },
  stravaDot: {
    width: 10,
    height: 10,
    backgroundColor: "#388e3c",
    borderRadius: 5,
    marginBottom: 4,
  },
  graphLabel: { marginTop: 4, fontSize: 12, color: "#444" },

  recentContainer: { width: "80%", marginTop: 35 },
  recentCard: {
    backgroundColor: "#fff",
    padding: 14,
    borderRadius: 10,
    marginBottom: 12,
  },
  miniMap: {
    width: "100%",
    height: 120,
    borderRadius: 10,
    marginVertical: 10,
  },
  recentName: { fontSize: 16, fontWeight: "600", color: "#222" },
  recentMeta: { marginTop: 4, fontSize: 14, color: "#555" },
  recentDate: { marginTop: 4, color: "#777", fontSize: 12 },

  reviewsContainer: { width: "80%", marginTop: 35 },
  noReviews: { fontStyle: "italic", color: "#666", fontSize: 14 },
  reviewCard: {
    backgroundColor: "#fff",
    padding: 14,
    borderRadius: 10,
    marginBottom: 12,
  },
  reviewRoute: { fontSize: 15, fontWeight: "600", color: "#222" },
  reviewText: { marginTop: 6, color: "#444", fontSize: 14 },
  reviewStars: { marginTop: 4, fontSize: 14, fontWeight: "500" },
  reviewDate: { marginTop: 4, color: "#777", fontSize: 12 },

  logoutButton: {
    marginTop: 40,
    backgroundColor: "#D19761",
    paddingVertical: 12,
    paddingHorizontal: 40,
    borderRadius: 8,
  },
  logoutText: { color: "#fff", fontWeight: "600", fontSize: 16 },
});
