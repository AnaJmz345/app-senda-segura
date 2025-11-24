import React, {useEffect,useState} from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons, FontAwesome5 } from '@expo/vector-icons';
import TopMenu from '../../components/TopMenu'
import { useAuth } from '../../context/AuthContext'; 
import { loadUserProfile } from "../../../controllers/BikerProfileController";

import { logInfo,logError } from '../../../utils/logger';

export default function BikerProfileScreen({navigation}) {
  const [profile, setProfile] = useState(null);
  const {user,signOut} = useAuth();

  //Función que obtiene los datos del perfil de sqlite (vista->controller->model)
  useEffect(() => {
    const load = async () => {
      logInfo("OBTENIENDO PERFIL BIKER DE SQLITE")
      const data = await loadUserProfile(user.id);
      setProfile(data);
    };
    load();
  }, []);

  const handleLogout = async () => {
    await signOut();
  };
  

  return (
      <ScrollView contentContainerStyle={styles.content}>
        <TopMenu navigation ={navigation}></TopMenu>
        {/* Imagen y nombre de perfil */}
        <View style={styles.profileSection}>
          <Image
            source={{ uri:
              profile?.avatar_url ||
              "https://i.pinimg.com/736x/bc/98/0b/bc980b9e0bf723ac8393222ff0249da9.jpg",
            }}
            style={styles.profileImage}
          />
          <Text style={styles.name}>{profile?.display_name || "Ciclista"}</Text>
        </View>

        <View style={styles.options}>
          <TouchableOpacity style={styles.optionButton} onPress={() => navigation.navigate('EditBikerProfile')}>
            <Ionicons name="person-outline" size={24} color="black" />
            <Text style={styles.optionText}>Editar perfil</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.optionButton} onPress={() => navigation.navigate('BikerMedicalDataForm')}>
            <FontAwesome5 name="briefcase-medical" size={22} color="black" />
            <Text style={styles.optionText}>Agregar datos médicos</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.optionButton} onPress={() => navigation.navigate('EmergencyContacts')}>
            <FontAwesome5 name="ambulance" size={22} color="black" />
            <Text style={styles.optionText}>Contactos de emergencia</Text>
          </TouchableOpacity>
        </View>

        {/* Botón cerrar sesión */}
        <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
          <Text style={styles.logoutText}>Cerrar sesión</Text>
        </TouchableOpacity>
      </ScrollView>

  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F8F8',
  },
  content: {
    alignItems: 'center',
    paddingBottom: 40,
  },
 
  profileSection: {
    alignItems: 'center',
    marginTop: -50,
  },
  profileImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
    borderWidth: 3,
    borderColor: '#fff',
  },
  name: {
    marginTop: 10,
    fontSize: 18,
    fontWeight: '500',
  },
  options: {
    marginTop: 30,
    width: '80%',
  },
  optionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 15,
  },
  optionText: {
    marginLeft: 15,
    fontSize: 16,
    color: '#000',
  },
  logoutButton: {
    marginTop: 40,
    backgroundColor: '#D19761',
    paddingVertical: 12,
    paddingHorizontal: 40,
    borderRadius: 8,
  },
  logoutText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 16,
  },
  
});