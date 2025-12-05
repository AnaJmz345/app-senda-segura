import React, { useRef, useEffect } from "react";
import { 
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Animated,
  Dimensions
} from "react-native";
import { Ionicons } from "@expo/vector-icons";

export default function EmergencyScreen({ navigation }) {

  const pulse = useRef(new Animated.Value(1)).current;
  const glow = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.loop(
      Animated.parallel([
        Animated.sequence([
          Animated.timing(pulse, {
            toValue: 1.08,
            duration: 900,
            useNativeDriver: true,
          }),
          Animated.timing(pulse, {
            toValue: 1,
            duration: 900,
            useNativeDriver: true,
          })
        ]),

        Animated.sequence([
          Animated.timing(glow, {
            toValue: 1,
            duration: 900,
            useNativeDriver: true,
          }),
          Animated.timing(glow, {
            toValue: 0,
            duration: 900,
            useNativeDriver: true,
          })
        ])
      ])
    ).start();
  }, []);

  const handleBack = () => navigation.goBack();

  return (
    <View style={styles.container}>
      
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={handleBack} style={styles.backButton}>
          <Ionicons name="chevron-back" size={26} color="#777" />
          <Text style={styles.backText}>Volver</Text>
        </TouchableOpacity>

        <Text style={styles.headerTitle}>EMERGENCIA</Text>
      </View>

      <ScrollView contentContainerStyle={styles.content}>

        {/* Glow Difuminado */}
        <Animated.View 
          style={[
            styles.glowCircle,
            {
              opacity: glow,
              transform: [{ scale: pulse }]
            }
          ]}
        />

        {/* Círculo principal */}
        <Animated.View 
          style={[
            styles.circle,
            {
              transform: [{ scale: pulse }]
            }
          ]}
        >
          <Text style={styles.circleText}>
            CONECTANDO{"\n"}CON UN{"\n"}PARAMÉDICO
          </Text>
        </Animated.View>

        {/* Tarjetas de notificación */}
        <View style={styles.notificationsSection}>
          {["#1", "#2", "#3"].map((n, i) => (
            <View key={i} style={styles.notificationCard}>
              <Ionicons name="alert-circle-outline" size={20} color="#D90000" />
              <View style={styles.notificationTextContainer}>
                <Text style={styles.notificationTitle}>‘Nombre’ ha sido notificado.</Text>
                <Text style={styles.notificationBody}>
                  Tu contacto de emergencia {n}, ‘Nombre’, ha sido notificado.
                </Text>
              </View>
            </View>
          ))}
        </View>

      </ScrollView>
    </View>
  );
}

const { width } = Dimensions.get("window");

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#F3F3F1" },

  header: {
    paddingTop: 60,
    paddingHorizontal: 20,
    paddingBottom: 15,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },

  backButton: { flexDirection: "row", alignItems: "center" },
  backText: { color: "#777", fontSize: 14 },

  headerTitle: { color: "#D90000", fontWeight: "700", fontSize: 16 },

  content: {
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 50,
    alignItems: "center",
    minHeight: 800,
  },


  glowCircle: {
    alignItems: "center",
    justifyContent: "center",
    position: "absolute",
    top: 50,
    width: 300,
    height: 300,
    borderRadius: 150,
    backgroundColor: "rgba(255, 0, 0, 0.25)",
    shadowColor: "#e20000ff",
    shadowRadius: 50,
    shadowOpacity: 0.7,
    shadowOffset: { width: 0, height: 0 },
  },

  
  circle: {
    width: 260,
    height: 260,
    borderRadius: 130,
    borderWidth: 6,
    borderColor: "#cc0000ff",
    backgroundColor: "#D90000",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 50,
    marginTop: 50,
    zIndex: 10,
  },

  circleText: {
    textAlign: "center",
    fontSize: 22,
    fontWeight: "700",
    color: "#fffdfdff",
    lineHeight: 30,
  },

  notificationsSection: { width: "100%", gap: 18 },

  notificationCard: {
    flexDirection: "row",
    borderWidth: 1.5,
    borderColor: "#D90000",
    padding: 12,
    borderRadius: 12,
    backgroundColor: "#fff",
  },

  notificationTextContainer: { marginLeft: 10, flex: 1 },

  notificationTitle: { fontWeight: "700", fontSize: 15 },
  notificationBody: { fontSize: 13, marginTop: 2, color: "#555" },
});


