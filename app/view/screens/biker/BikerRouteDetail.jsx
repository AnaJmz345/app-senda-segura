import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import { Ionicons, FontAwesome5 } from "@expo/vector-icons";
import { useRoute, useNavigation } from "@react-navigation/native";
import { SafeAreaView, useSafeAreaInsets } from "react-native-safe-area-context";
import { supabase } from "../../lib/supabase";

const forestImage =
  "https://bosquelaprimavera.com/wp-content/uploads/bosque-la-primavera_conoce-el-bosque_El-bosque-la-primavera.jpg";

export default function BikerRouteDetail() {
  const routeNav = useRoute();
  const navigation = useNavigation();
  const insets = useSafeAreaInsets();

  const {
    routeId,
    routeName,
    difficulty,
    distance_km,
    duration_min,
    description,
  } = routeNav.params;

  const [reviews, setReviews] = useState([]);
  const [avgRating, setAvgRating] = useState(null);

  useEffect(() => {
    const fetchReviews = async () => {
      const { data, error } = await supabase
        .from("route_reviews")
        .select("*")
        .eq("route_id", routeId)
        .order("created_at", { ascending: false });

      if (!error && data) {
        setReviews(data);
        if (data.length > 0) {
          const avg =
            data.reduce((sum, r) => sum + (r.rating || r.stars || 0), 0) /
            data.length;
          setAvgRating(avg);
        }
      }
    };

    fetchReviews();
  }, [routeId]);

  const renderStars = (rating) => {
    const filled = Math.round(rating || 0);
    return (
      <View style={styles.starsRow}>
        {Array.from({ length: 5 }).map((_, i) => (
          <Ionicons
            key={i}
            name={i < filled ? "star" : "star-outline"}
            size={18}
            color="#FFD54F"
          />
        ))}
      </View>
    );
  };

  const difficultyText =
    difficulty === "easy"
      ? "NIVEL FÁCIL"
      : difficulty === "medium"
      ? "NIVEL INTERMEDIO"
      : "NIVEL AVANZADO";

  return (
    <SafeAreaView style={styles.safeArea} edges={["top","left","right"]}>

      <View style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Ionicons name="chevron-back" size={24} color="#ffffff" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Detalle de ruta</Text>
          <View style={{ width: 24 }} />
        </View>

        {/* Imagen principal */}
        <View style={styles.heroWrapper}>
          <Image
            source={{ uri: forestImage }}
            style={styles.heroImage}
            resizeMode="cover"
          />
          <View style={styles.heroOverlay} />
        </View>

        {/* Card principal */}
        <View style={styles.cardWrapper}>
          <ScrollView
            contentContainerStyle={styles.card}
            showsVerticalScrollIndicator={false}
          >
            <View style={styles.cardHandle} />

            <Text style={styles.routeTitle}>{routeName}</Text>

            <Text style={styles.routeSummary}>
              Esta ruta es{" "}
              <Text style={styles.boldText}>{difficultyText}</Text>, con una
              distancia aproximada de{" "}
              <Text style={styles.boldText}>{distance_km} km</Text> y un tiempo
              estimado de{" "}
              <Text style={styles.boldText}>{duration_min} minutos</Text> de
              recorrido.
            </Text>

            {description ? (
              <Text style={styles.routeDescription}>{description}</Text>
            ) : null}

            <View style={styles.infoRow}>
              <View style={styles.infoItem}>
                <FontAwesome5 name="route" size={16} color="#E8F5E9" />
                <Text style={styles.infoText}>{distance_km} km</Text>
              </View>
              <View style={styles.infoItem}>
                <FontAwesome5 name="clock" size={16} color="#E8F5E9" />
                <Text style={styles.infoText}>{duration_min} min</Text>
              </View>
            </View>

            <View style={styles.ratingSummary}>
              <Text style={styles.sectionTitle}>Opiniones de la comunidad</Text>
              {avgRating ? (
                <View style={styles.avgRow}>
                  {renderStars(avgRating)}
                  <Text style={styles.avgText}>
                    {avgRating.toFixed(1)} ({reviews.length} reseñas)
                  </Text>
                </View>
              ) : (
                <Text style={styles.noReviewsText}>
                  Aún no hay reseñas para esta ruta. Sé la primera persona en
                  opinar.
                </Text>
              )}
            </View>

            <TouchableOpacity
              style={styles.primaryButton}
              onPress={() =>
                navigation.navigate("RateRouteScreen", {
                  routeId,
                  routeName,
                })
              }
            >
              <Text style={styles.primaryButtonText}>Calificar ruta</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.secondaryButton}
              onPress={() =>
                navigation.navigate("RouteReviews", {
                  routeId,
                  routeName,
                })
              }
            >
              <Text style={styles.secondaryButtonText}>
                Ver otras opiniones
              </Text>
            </TouchableOpacity>
          </ScrollView>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#0F1F16",
  },
  container: {
    flex: 1,
    backgroundColor: "#0F1F16",
  },
  header: {
    height: 56,
    paddingHorizontal: 20,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  headerTitle: {
    color: "#ffffff",
    fontSize: 18,
    fontWeight: "600",
  },
  heroWrapper: {
    height: 220,
    overflow: "hidden",
  },
  heroImage: {
    width: "100%",
    height: "100%",
  },
  heroOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0,0,0,0.15)",
  },
  cardWrapper: {
    flex: 1,
    marginTop: -36,
    borderTopLeftRadius: 32,
    borderTopRightRadius: 32,
    backgroundColor: "#264b33",
    overflow: "hidden",
  },
  card: {
    paddingHorizontal: 24,
    paddingTop: 16,
    paddingBottom: 32,
  },
  cardHandle: {
    alignSelf: "center",
    width: 40,
    height: 4,
    borderRadius: 2,
    backgroundColor: "rgba(255,255,255,0.35)",
    marginBottom: 16,
  },
  routeTitle: {
    fontSize: 24,
    fontWeight: "700",
    color: "#ffffff",
    marginBottom: 12,
  },
  routeSummary: {
    color: "#E0F2F1",
    fontSize: 15,
    lineHeight: 22,
    marginBottom: 8,
  },
  boldText: {
    fontWeight: "700",
  },
  routeDescription: {
    color: "#E0F2F1",
    fontSize: 14,
    lineHeight: 22,
    marginBottom: 16,
  },
  infoRow: {
    flexDirection: "row",
    justifyContent: "flex-start",
    marginBottom: 20,
  },
  infoItem: {
    flexDirection: "row",
    alignItems: "center",
    marginRight: 24,
  },
  infoText: {
    color: "#E8F5E9",
    fontSize: 14,
    fontWeight: "500",
    marginLeft: 6,
  },
  ratingSummary: {
    marginBottom: 18,
  },
  sectionTitle: {
    color: "#ffffff",
    fontSize: 17,
    fontWeight: "600",
    marginBottom: 6,
  },
  avgRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 4,
  },
  avgText: {
    color: "#E0F2F1",
    fontSize: 14,
    marginLeft: 8,
  },
  noReviewsText: {
    color: "#C8E6C9",
    fontSize: 14,
    marginTop: 4,
  },
  starsRow: {
    flexDirection: "row",
  },
  primaryButton: {
    backgroundColor: "#FBC02D",
    borderRadius: 22,
    paddingVertical: 12,
    alignItems: "center",
    marginTop: 8,
  },
  primaryButtonText: {
    color: "#264b33",
    fontWeight: "700",
    fontSize: 15,
  },
  secondaryButton: {
    marginTop: 14,
    alignItems: "center",
  },
  secondaryButtonText: {
    color: "#E0F2F1",
    textDecorationLine: "underline",
    fontSize: 14,
  },
});
