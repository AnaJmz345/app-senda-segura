import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, Image, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { COLORS } from "../../constants/colors";
import TopMenu from "../../components/TopMenu";
import { executeSql } from "../../lib/sqlite";
import NetInfo from "@react-native-community/netinfo";
import { useAuth } from "../../context/AuthContext";
import { MedicalDataController } from "../../../controllers/MedicalDataController";

export default function BikerProfileScreen({ navigation }) {
  const [profile, setProfile] = useState(null);
  const { user } = useAuth();

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const result = await executeSql("SELECT * FROM profiles LIMIT 1");
        setProfile(result.rows._array[0] || null);
      } catch (e) {
        setProfile(null);
      }
    };
    fetchProfile();
  }, []);

  useEffect(() => {
    const syncPendingProfiles = async () => {
      const netState = await NetInfo.fetch();
      if (netState.isConnected) {
        const res = await executeSql(
          `SELECT * FROM profiles WHERE is_synced = 0`
        );
        const pendingProfiles = res.rows._array;
        for (const profile of pendingProfiles) {
          await MedicalDataController.saveMedicalData(profile.id, profile);
          await executeSql(`UPDATE profiles SET is_synced = 1 WHERE id = ?`, [
            profile.id,
          ]);
        }
      }
    };
    syncPendingProfiles();
  }, [user]);

  return (
    <View style={styles.container}>
      <TopMenu navigation={navigation} />
      <View style={styles.header}>
        <Image
          source={{
            uri:
              profile?.avatar_url ||
              "https://i.pinimg.com/736x/bc/98/0b/bc980b9e0bf723ac8393222ff0249da9.jpg",
          }}
          style={styles.profileImage}
        />
        <Text style={styles.name}>
          {profile?.display_name || "Isabel Monteiro"}
        </Text>
        <Text style={styles.role}>Biker</Text>
      </View>
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Contacto</Text>
        <Text style={styles.sectionValue}>
          {profile?.phone || "+52 443 341 7632"}
        </Text>
      </View>
      <TouchableOpacity
        style={styles.editButton}
        onPress={() => navigation.navigate("EditBikerProfile", { profile })}
      >
        <Ionicons
          name="create-outline"
          size={18}
          color="#fff"
          style={{ marginRight: 7 }}
        />
        <Text style={styles.editButtonText}>Editar perfil</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },
  header: { alignItems: "center", marginTop: 36, marginBottom: 18 },
  profileImage: { width: 92, height: 92, borderRadius: 60, marginBottom: 12 },
  name: {
    fontSize: 22,
    fontWeight: "bold",
    color: COLORS.darkGreen,
    marginBottom: 3,
  },
  role: { color: COLORS.mediumGreen, fontWeight: "500", fontSize: 15 },
  section: { marginHorizontal: 32, marginVertical: 18 },
  sectionTitle: {
    color: COLORS.mediumGreen,
    fontSize: 15,
    fontWeight: "600",
    marginBottom: 2,
  },
  sectionValue: { color: COLORS.text, fontSize: 17, fontWeight: "500" },
  editButton: {
    flexDirection: "row",
    backgroundColor: COLORS.mediumGreen,
    alignItems: "center",
    justifyContent: "center",
    alignSelf: "center",
    marginTop: 26,
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 16,
  },
  editButtonText: { color: "#fff", fontSize: 16, fontWeight: "bold" },
});
