import React from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, ScrollView } from 'react-native';
import { Ionicons, FontAwesome5 } from '@expo/vector-icons';
import TopMenu from '../../components/TopMenu';
import { useAuth } from '../../context/AuthContext'; 


export default function AdminProfileScreen({ navigation }) {
  const {signOut} = useAuth();
  const handleLogout = async () => {
    await signOut();
  };


  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.content}>
        <TopMenu navigation={navigation}></TopMenu>

        {/* Imagen y nombre de perfil */}
        <View style={styles.profileSection}>
          <Image
            source={{ uri: 'https://i.pinimg.com/736x/bc/98/0b/bc980b9e0bf723ac8393222ff0249da9.jpg' }} //futuro: permitir cambiar imagen de perfil
            style={styles.profileImage}
          />
          <Text style={styles.name}>Admin Name</Text>
        </View>

        {/* Opciones de perfil */}
        <View style={styles.options}>
          <TouchableOpacity style={styles.optionButton} onPress={() => navigation.navigate('EditAdminProfile')}> // checar esta función para q funcione
            <Ionicons name="person-outline" size={24} color="black" />
            <Text style={styles.optionText}>Editar perfil</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.optionButton} onPress={() => navigation.navigate('EditAndManageRoutes')}>
            <Ionicons name="compass" size={24} color="black" />
            <Text style={styles.optionText}>Gestionar Rutas</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>

      {/* Botón cerrar sesión */}
      <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
        <Text style={styles.logoutText}>Cerrar sesión</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F8F8',
  },
  content: {
    alignItems: 'center',
    paddingBottom: 20,
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
    marginTop: 60,
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
    backgroundColor: '#D19761',
    paddingVertical: 12,
    paddingHorizontal: 40,
    borderRadius: 8,
    margin: 20,
    alignSelf: 'center',
  },
  logoutText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 16,
  },
});
