import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  TextInput,
  Image,
  Alert,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { Picker } from "@react-native-picker/picker";
import { useAuth } from "../../context/AuthContext";
import { MedicalDataController } from "../../../controllers/MedicalDataController";
import { executeSql } from "../../lib/sqlite";
import NetInfo from "@react-native-community/netinfo";

export default function EditBikerProfile({ navigation }) {
  const { user } = useAuth();
  const [editProfile, setEditProfile] = useState({
    display_name: "",
    phone: "",
    avatar_url: "",
  });

  const handleSave = async () => {
    try {
      await executeSql(
        `INSERT OR REPLACE INTO profiles (id, display_name, phone, avatar_url, is_synced)
         VALUES (?, ?, ?, ?, 0)`,
        [
          user.id,
          editProfile.display_name,
          editProfile.phone,
          editProfile.avatar_url ||
            "https://i.pinimg.com/736x/bc/98/0b/bc980b9e0bf723ac8393222ff0249da9.jpg",
        ]
      );
      const netState = await NetInfo.fetch();
      if (netState.isConnected) {
        await MedicalDataController.saveMedicalData(user.id, editProfile);
        await executeSql(`UPDATE profiles SET is_synced = 1 WHERE id = ?`, [
          user.id,
        ]);
        Alert.alert("Datos guardados y sincronizados correctamente");
      } else {
        Alert.alert(
          "Guardado localmente. Se sincronizará cuando tengas internet."
        );
      }
      navigation.goBack();
    } catch (error) {
      Alert.alert("Error", error.message);
    }
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.backButtonContainer}>
        <TouchableOpacity
          style={styles.button}
          onPress={() => navigation.goBack()}
        >
          <Ionicons name="chevron-back" size={28} color="black" />
        </TouchableOpacity>
      </View>
      <View style={styles.titleContainer}>
        <Text style={styles.title}>Editar perfil</Text>
      </View>
      <View style={styles.formContainer}>
        <View style={styles.profileSection}>
          <Image
            source={{
              uri:
                editProfile.avatar_url ||
                "https://i.pinimg.com/736x/bc/98/0b/bc980b9e0bf723ac8393222ff0249da9.jpg",
            }}
            style={styles.profileImage}
          />
        </View>
        <Text style={styles.label}>Nombre del perfil</Text>
        <TextInput
          style={styles.input}
          value={editProfile.display_name}
          onChangeText={(text) =>
            setEditProfile({ ...editProfile, display_name: text })
          }
        />
        <Text style={styles.label}>Número de teléfono</Text>
        <TextInput
          style={styles.input}
          value={editProfile.phone}
          onChangeText={(text) =>
            setEditProfile({ ...editProfile, phone: text })
          }
        />
        <Text style={styles.label}>URL de foto</Text>
        <TextInput
          style={styles.input}
          value={editProfile.avatar_url}
          onChangeText={(text) =>
            setEditProfile({ ...editProfile, avatar_url: text })
          }
        />
      </View>
      <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
        <Text style={styles.saveButtonText}>Guardar cambios</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#F8F8F8" },
  backButtonContainer: { position: "absolute", top: 40, left: 20 },
  button: {
    backgroundColor: "#D19761",
    padding: 6,
    borderRadius: 6,
    alignItems: "center",
    justifyContent: "center",
    elevation: 2,
    shadowColor: "#000",
    shadowOpacity: 0.2,
    shadowRadius: 2,
    shadowOffset: { width: 0, height: 1 },
  },
  titleContainer: { flex: 1, marginTop: 45, alignItems: "center" },
  title: { fontSize: 22, fontWeight: "600", color: "black" },
  formContainer: { margin: 30 },
  label: { fontSize: 15, color: "#000", marginBottom: 6 },
  input: {
    backgroundColor: "#E8E5E1",
    borderRadius: 8,
    paddingVertical: 10,
    paddingHorizontal: 12,
    marginBottom: 18,
  },
  pickerContainer: {
    backgroundColor: "#E8E5E1",
    borderRadius: 8,
    marginBottom: 18,
  },
  picker: { height: 50, width: "100%" },
  saveButton: {
    backgroundColor: "transparent",
    borderRadius: 8,
    alignItems: "center",
  },
  saveButtonText: { color: "#D19761", fontWeight: "700", fontSize: 16 },
  profileImage: {
    width: 150,
    height: 150,
    borderRadius: 75,
    borderWidth: 3,
    borderColor: "#fff",
  },
  profileSection: { alignItems: "center", margin: 20 },
});
