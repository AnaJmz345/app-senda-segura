import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useRoute, useNavigation } from "@react-navigation/native";
import { SafeAreaView, useSafeAreaInsets } from "react-native-safe-area-context";
import { useAuth } from "../../context/AuthContext";
import { supabase } from "../../lib/supabase";

export default function RateRouteScreen() {
  const routeNav = useRoute();
  const navigation = useNavigation();
  const insets = useSafeAreaInsets();
  const { routeId, routeName } = routeNav.params;
  const { profile } = useAuth();

  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    if (!rating) {
      Alert.alert("Calificación requerida", "Selecciona al menos una estrella.");
      return;
    }

    setLoading(true);
    const { data, error } = await supabase.from("route_reviews").insert({
      route_id: routeId,
      user_id: profile?.id || null,
      user_name: profile?.display_name || "Ciclista",
      user_avatar: profile?.avatar_url || null,
      rating,
      comment: comment.trim(),
    });

    console.log("Supabase insert result:", { data, error });

    setLoading(false);

    if (error) {
      Alert.alert("Error", error.message || "No se pudo guardar tu opinión.");
    } else {
      Alert.alert("Gracias", "Tu opinión se ha enviado correctamente.");
      navigation.goBack();
    }
  };

  const renderStars = () => (
    <View style={styles.starsRow}>
      {Array.from({ length: 5 }).map((_, i) => {
        const index = i + 1;
        return (
          <TouchableOpacity
            key={index}
            onPress={() => setRating(index)}
            style={styles.starTouchable}
          >
            <Ionicons
              name={index <= rating ? "star" : "star-outline"}
              size={38}
              color="#FFD54F"
            />
          </TouchableOpacity>
        );
      })}
    </View>
  );

  return (
    <SafeAreaView style={styles.safeArea} edges={["top","left","right"]}>

      <View style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Ionicons name="chevron-back" size={26} color="#ffffff" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Calificar ruta</Text>
          <View style={{ width: 26 }} />
        </View>

        <KeyboardAvoidingView
          style={{ flex: 1 }}
          behavior={Platform.OS === "ios" ? "padding" : undefined}
        >
          <View style={styles.cardWrapper}>
            <ScrollView
              contentContainerStyle={styles.card}
              keyboardShouldPersistTaps="handled"
              showsVerticalScrollIndicator={false}
            >
              <View style={styles.cardHandle} />

              <Text style={styles.routeName}>{routeName}</Text>
              <Text style={styles.title}>Califica esta ruta</Text>

              {renderStars()}

              <Text style={styles.label}>
                Cuéntale a otros ciclistas tu experiencia:
              </Text>

              <TextInput
                style={styles.textArea}
                multiline
                placeholder="¿Qué te gustó de la ruta? ¿La recomendarías? ¿Qué recomiendas considerar?"
                placeholderTextColor="#9FA8A0"
                value={comment}
                onChangeText={setComment}
              />

              <TouchableOpacity
                style={[
                  styles.primaryButton,
                  loading && { opacity: 0.7 },
                ]}
                onPress={handleSubmit}
                disabled={loading}
              >
                <Text style={styles.primaryButtonText}>
                  {loading ? "Enviando..." : "Aceptar"}
                </Text>
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
                <Text style={styles.secondaryText}>Ver otras opiniones</Text>
              </TouchableOpacity>
            </ScrollView>
          </View>
        </KeyboardAvoidingView>
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
  cardWrapper: {
    flex: 1,
    marginTop: 16,
    borderTopLeftRadius: 32,
    borderTopRightRadius: 32,
    backgroundColor: "#264b33",
  },
  card: {
    paddingHorizontal: 24,
    paddingTop: 16,
    paddingBottom: 32,
    alignItems: "center",
  },
  cardHandle: {
    width: 40,
    height: 4,
    borderRadius: 2,
    backgroundColor: "rgba(255,255,255,0.35)",
    marginBottom: 18,
    alignSelf: "center",
  },
  routeName: {
    color: "#C8E6C9",
    fontSize: 14,
    marginBottom: 4,
    textAlign: "center",
  },
  title: {
    color: "#FFFFFF",
    fontSize: 22,
    fontWeight: "700",
    marginBottom: 20,
    textAlign: "center",
  },
  starsRow: {
    flexDirection: "row",
    marginBottom: 20,
    justifyContent: "center",
  },
  starTouchable: {
    marginHorizontal: 4,
  },
  label: {
    color: "#E0F2F1",
    fontSize: 15,
    marginBottom: 8,
    textAlign: "center",
  },
  textArea: {
    backgroundColor: "#E0E0DC",
    borderRadius: 18,
    minHeight: 140,
    padding: 14,
    textAlignVertical: "top",
    color: "#333333",
    marginBottom: 22,
    width: "100%",
    fontSize: 14,
  },
  primaryButton: {
    backgroundColor: "#FBC02D",
    borderRadius: 24,
    paddingVertical: 12,
    paddingHorizontal: 40,
    alignItems: "center",
  },
  primaryButtonText: {
    color: "#264b33",
    fontWeight: "700",
    fontSize: 16,
  },
  secondaryButton: {
    marginTop: 16,
    alignItems: "center",
  },
  secondaryText: {
    color: "#E0F2F1",
    textDecorationLine: "underline",
    fontSize: 15,
  },
});
