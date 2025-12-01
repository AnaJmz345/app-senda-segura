import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Image,
  ActivityIndicator,
  TouchableOpacity,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useRoute, useNavigation } from "@react-navigation/native";
import { SafeAreaView, useSafeAreaInsets } from "react-native-safe-area-context";
import { supabase } from "../../lib/supabase";

const fallbackAvatar =
  "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTsc_HYtQ54oSeYoG5Bdi3vxlG8z1Go7gItRw&s";

export default function RouteReviews() {
  const routeNav = useRoute();
  const navigation = useNavigation();
  const insets = useSafeAreaInsets();
  const { routeId, routeName } = routeNav.params;

  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchReviews = async () => {
      const { data, error } = await supabase
        .from("route_reviews")
        .select("*")
        .eq("route_id", routeId)
        .order("created_at", { ascending: false });

      if (!error && data) {
        setReviews(data);
      }
      setLoading(false);
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
            size={16}
            color="#FFD54F"
          />
        ))}
      </View>
    );
  };

  const renderItem = ({ item }) => (
    <View style={styles.reviewCard}>
      <View style={styles.reviewHeader}>
        <Image
          source={{ uri: item.user_avatar || fallbackAvatar }}
          style={styles.avatar}
        />
        <View style={{ flex: 1 }}>
          <Text style={styles.userName}>{item.user_name || "Ciclista"}</Text>
          {renderStars(item.rating)}
        </View>
        <Text style={styles.dateText}>
          {item.created_at
            ? new Date(item.created_at).toLocaleDateString()
            : ""}
        </Text>
      </View>
      {item.comment ? (
        <Text style={styles.commentText}>{item.comment}</Text>
      ) : null}
    </View>
  );

  return (
   <SafeAreaView style={styles.safeArea} edges={["top","left","right"]}>

      <View style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Ionicons name="chevron-back" size={26} color="#ffffff" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Opiniones</Text>
          <View style={{ width: 26 }} />
        </View>

        <View style={styles.titleWrapper}>
          <Text style={styles.routeName}>{routeName}</Text>
          <Text style={styles.subtitle}>
            Reseñas de otros ciclistas que ya recorrieron esta ruta.
          </Text>
        </View>

        {loading ? (
          <View style={styles.loaderWrapper}>
            <ActivityIndicator size="large" color="#FBC02D" />
          </View>
        ) : reviews.length === 0 ? (
          <View style={styles.emptyWrapper}>
            <Text style={styles.emptyText}>
              Todavía no hay opiniones para esta ruta.
            </Text>
            <Text style={styles.emptyTextSecondary}>
              Regresa a la pantalla anterior y sé la primera persona en opinar.
            </Text>
          </View>
        ) : (
          <FlatList
            data={reviews}
            keyExtractor={(item) => item.id?.toString()}
            renderItem={renderItem}
            contentContainerStyle={styles.listContent}
          />
        )}
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
  titleWrapper: {
    paddingHorizontal: 20,
    paddingTop: 4,
    paddingBottom: 10,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: "rgba(255,255,255,0.15)",
  },
  routeName: {
    color: "#ffffff",
    fontSize: 20,
    fontWeight: "700",
    marginBottom: 4,
  },
  subtitle: {
    color: "#C8E6C9",
    fontSize: 14,
  },
  loaderWrapper: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  emptyWrapper: {
    flex: 1,
    paddingHorizontal: 24,
    justifyContent: "center",
    alignItems: "center",
  },
  emptyText: {
    color: "#ffffff",
    fontSize: 16,
    textAlign: "center",
    marginBottom: 8,
  },
  emptyTextSecondary: {
    color: "#C8E6C9",
    fontSize: 14,
    textAlign: "center",
  },
  listContent: {
    paddingHorizontal: 20,
    paddingTop: 12,
    paddingBottom: 24,
  },
  reviewCard: {
    backgroundColor: "#264b33",
    borderRadius: 16,
    padding: 14,
    marginBottom: 12,
  },
  reviewHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },
  avatar: {
    width: 42,
    height: 42,
    borderRadius: 21,
    marginRight: 10,
  },
  userName: {
    color: "#ffffff",
    fontSize: 15,
    fontWeight: "600",
    marginBottom: 2,
  },
  dateText: {
    color: "#B0BEC5",
    fontSize: 12,
    marginLeft: 8,
  },
  commentText: {
    color: "#E0F2F1",
    fontSize: 14,
    lineHeight: 20,
  },
  starsRow: {
    flexDirection: "row",
  },
});
