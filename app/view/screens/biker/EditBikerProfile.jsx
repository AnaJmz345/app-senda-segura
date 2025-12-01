import React, { useState, useEffect } from 'react';
import { 
  View, Text, StyleSheet, TouchableOpacity, ScrollView, 
  TextInput, Image, Alert 
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../../context/AuthContext';
import { updateUserProfile, loadUserProfile } from '../../../controllers/BikerProfileController';

export default function EditBikerProfile({ navigation }) {
  const { user } = useAuth();

  const [editProfile, setEditProfile] = useState({
    real_display_name: "",
    phone: "",
    avatar_url: ""
  });

  // Cargar perfil desde SQLite
  useEffect(() => {
    const load = async () => {
      const p = await loadUserProfile(user.id);
      if (p) {
        setEditProfile({
          real_display_name: p.real_display_name ?? "",
          phone: p.phone ?? "",
          avatar_url: p.avatar_url ?? ""
        });
      }
    };
    load();
  }, []);

  const handleSave = async () => {
    try {
      await updateUserProfile(user.id, editProfile);
      Alert.alert("Éxito", "Perfil actualizado correctamente");
      navigation.goBack();
    } catch (error) {
      Alert.alert("Error", "No se pudo actualizar el perfil");
    }
  };

  return (
    <ScrollView style={styles.container}>

      <View style={styles.backButtonContainer}>
        <TouchableOpacity style={styles.button} onPress={() => navigation.goBack()}>
          <Ionicons name="chevron-back" size={28} color="black" />
        </TouchableOpacity>
      </View>

      <View style={styles.titleContainer}>
        <Text style={styles.title}>Editar perfil</Text>
      </View>

      <View style={styles.formContainer}>

        <View style={styles.profileSection}>
          <Image
            source={{ uri: editProfile.avatar_url || 'https://i.pinimg.com/736x/bc/98/0b/bc980b9e0bf723ac8393222ff0249da9.jpg' }}
            style={styles.profileImage}
          />
        </View>

        <Text style={styles.label}>Nombre del perfil</Text>
        <TextInput
          style={styles.input}
          value={editProfile.real_display_name}
          onChangeText={(text) =>
            setEditProfile({ ...editProfile, real_display_name: text })
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

      </View>

      <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
        <Text style={styles.saveButtonText}>Guardar cambios</Text>
      </TouchableOpacity>

    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F8F8F8' },
  backButtonContainer: { position: 'absolute', top: 40, left: 20 },
  button: {
    backgroundColor: '#D19761',
    padding: 6,
    borderRadius: 6,
    elevation: 2,
  },
  titleContainer: { marginTop: 45, alignItems: 'center' },
  title: { fontSize: 22, fontWeight: '600', color: 'black' },
  formContainer: { margin: 30 },
  label: { fontSize: 15, color: '#000', marginBottom: 6 },
  input: {
    backgroundColor: '#E8E5E1',
    borderRadius: 8,
    paddingVertical: 10,
    paddingHorizontal: 12,
    marginBottom: 18,
  },
  saveButton: { alignItems: 'center', marginTop: 10 },
  saveButtonText: { color: '#D19761', fontWeight: '700', fontSize: 16 },
  profileImage: { width: 150, height: 150, borderRadius: 75 },
  profileSection: { alignItems: 'center', margin: 20 },
});