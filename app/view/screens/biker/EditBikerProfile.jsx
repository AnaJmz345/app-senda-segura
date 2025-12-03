import React, { useState, useEffect } from 'react';
import { 
  View, Text, StyleSheet, TouchableOpacity, ScrollView, 
  TextInput, Image, Alert 
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../../context/AuthContext';
import { updateUserProfile, loadUserProfile } from '../../../controllers/BikerProfileController';
import * as ImagePicker from "expo-image-picker";


export default function EditBikerProfile({ navigation }) {
  const { user } = useAuth();

  const [isEditing, setIsEditing] = useState(false);
  const [originalProfile, setOriginalProfile] = useState(null); // guardamos copia original
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
        setOriginalProfile(p); // guardamos original
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
    if (!isEditing) {
      setIsEditing(true);
      return;
    }

    try {
      await updateUserProfile(user.id, editProfile);
      Alert.alert("Éxito", "Perfil actualizado correctamente");

      setOriginalProfile(editProfile); // actualizamos original
      setIsEditing(false);

    } catch (error) {
      Alert.alert("Error", "No se pudo actualizar el perfil");
    }
  };

  const handleCancel = () => {
    if (originalProfile) {
      // Restauramos los valores originales
      setEditProfile({
        real_display_name: originalProfile.real_display_name ?? "",
        phone: originalProfile.phone ?? "",
        avatar_url: originalProfile.avatar_url ?? ""
      });
    }

    setIsEditing(false); // volver a modo bloqueado
  };
  const handlePickImage = async () => {
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: "images",   
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.7,
      });


      if (!result.canceled) {
        setEditProfile({
          ...editProfile,
          avatar_url: result.assets[0].uri
        });
      }
    } catch (err) {
      Alert.alert("Error", "No se pudo abrir la galería");
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

          {isEditing && (
            <TouchableOpacity style={styles.editIcon} onPress={handlePickImage}>
              <Ionicons name="camera" size={22} color="#fff" />
            </TouchableOpacity>
          )}
        </View>


        <Text style={styles.label}>Nombre del perfil</Text>
        <TextInput
          style={[styles.input, !isEditing && styles.inputDisabled]}
          editable={isEditing}
          value={editProfile.real_display_name}
          onChangeText={(text) =>
            setEditProfile({ ...editProfile, real_display_name: text })
          }
        />

        <Text style={styles.label}>Número de teléfono</Text>
        <TextInput
          style={[styles.input, !isEditing && styles.inputDisabled]}
          editable={isEditing}
          value={editProfile.phone}
          onChangeText={(text) =>
            setEditProfile({ ...editProfile, phone: text })
          }
        />

      </View>

      {/* Botón guardar / editar */}
      <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
        <Text style={styles.saveButtonText}>
          {isEditing ? "Guardar cambios" : "Editar"}
        </Text>
      </TouchableOpacity>

      {/* Botón cancelar SOLO cuando esté editando */}
      {isEditing && (
        <TouchableOpacity style={styles.cancelButton} onPress={handleCancel}>
          <Text style={styles.cancelButtonText}>Cancelar</Text>
        </TouchableOpacity>
      )}

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
  inputDisabled: {
    opacity: 0.5,
  },
  saveButton: { alignItems: 'center', marginTop: 10 },
  saveButtonText: { color: '#D19761', fontWeight: '700', fontSize: 16 },

  cancelButton: { alignItems: 'center', marginTop: 30 },
  cancelButtonText: { color: '#D19761', fontWeight: '700', fontSize: 16,opacity:0.8 },

  profileImage: { width: 150, height: 150, borderRadius: 75 },
  profileSection: { alignItems: 'center', margin: 20 },
  profileSection: {
  alignItems: 'center',
  margin: 20,
  position: 'relative',
},
profileImage: {
  width: 150,
  height: 150,
  borderRadius: 75,
},
editIcon: {
  position: 'absolute',
  bottom: 10,      
  right: 10,       
  backgroundColor: '#D19761',
  padding: 8,
  borderRadius: 20,
  elevation: 5,
},

});
