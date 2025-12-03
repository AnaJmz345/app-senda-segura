import React, { useEffect, useState, useCallback } from 'react';
import { useFocusEffect } from '@react-navigation/native';
import { View, Text, StyleSheet, Image, TouchableOpacity, ScrollView, Switch, Alert, ActivityIndicator } from 'react-native';
import { Ionicons, FontAwesome5, MaterialIcons } from '@expo/vector-icons';
import { useAuth } from '../../context/AuthContext';
import TopMenu from '../../components/TopMenu';
import EmergencyCard from '../../components/EmergencyCard';
import { COLORS } from '../../constants/colors';
import { loadUserProfile } from '../../../controllers/BikerProfileController';
import { loadParamedicStatus, updateParamedicStatus } from '../../../controllers/ParamedicController';
import { logInfo, logError } from '../../../utils/logger';

export default function ParamedicProfileScreen({ navigation }) {
  const { user, signOut } = useAuth();
  const [profile, setProfile] = useState(null);
  const [isActive, setIsActive] = useState(false);
  const [loading, setLoading] = useState(true);
  const [updatingStatus, setUpdatingStatus] = useState(false);

  useFocusEffect(
    useCallback(() => {
      const load = async () => {
        try {
          setLoading(true);
          logInfo("[PARAMEDIC] Recargando perfil y estado");

          // 1) Perfil local desde SQLite
          const data = await loadUserProfile(user.id);
          setProfile(data);

          // 2) Estado del paramédico (sincroniza SQLite y Supabase)
          const active = await loadParamedicStatus(user.id);
          setIsActive(active);
          
          logInfo("[PARAMEDIC] Estado cargado:", active);
        } catch (err) {
          logError("[PARAMEDIC] Error cargando pantalla de perfil", err);
          Alert.alert("Error", "No se pudo cargar la información del paramédico");
        } finally {
          setLoading(false);
        }
      };

      load();
    }, [user.id])
  );

  const toggleActiveStatus = async (value) => {
    // Prevenir múltiples actualizaciones simultáneas
    if (updatingStatus) return;

    try {
      setUpdatingStatus(true);
      
     
      setIsActive(value);
      
      // Actualizar en backend
      await updateParamedicStatus(user.id, value);
      
      logInfo("[PARAMEDIC] Estado actualizado exitosamente a:", value);
      
      Alert.alert(
        value ? "✓ Turno iniciado" : "○ Turno finalizado",
        value 
          ? "Ahora estás activo y disponible para atender emergencias." 
          : "Ahora estás inactivo. No aparecerás en la lista de paramédicos disponibles.",
        [{ text: "Entendido" }]
      );
    } catch (err) {
      logError("[PARAMEDIC] Error al cambiar estado", err);
      
      // Revertir UI en caso de error
      setIsActive(!value);
      
      Alert.alert(
        "Error de conexión", 
        "No se pudo actualizar el estado. El cambio se guardó localmente y se sincronizará cuando haya conexión.",
        [{ text: "OK" }]
      );
    } finally {
      setUpdatingStatus(false);
    }
  };

  const handleLogout = async () => {
  if (isActive) {
    // Mostrar advertencia SOLO cuando está activo
    Alert.alert(
      "Cerrar sesión",
      "Actualmente estás en turno activo. ¿Deseas cerrar sesión de todas formas? Tu estado se mantendrá para la próxima vez que inicies sesión.",
      [
        { text: "Cancelar", style: "cancel" },
        {
          text: "Cerrar sesión",
          style: "destructive",
          onPress: async () => {
            try {
              await signOut();
            } catch (error) {
              logError('[PARAMEDIC] Error cerrando sesión:', error);
              Alert.alert('Error', 'No se pudo cerrar la sesión. Intenta de nuevo.');
            }
          }
        }
      ]
    );
  } else {
    // Si NO está activo → cerrar sesión sin preguntar
    try {
      await signOut();
    } catch (error) {
      logError('[PARAMEDIC] Error cerrando sesión:', error);
      Alert.alert('Error', 'No se pudo cerrar la sesión. Intenta de nuevo.');
    }
  }
};


  if (loading) {
    return (
      <View style={[styles.container, styles.centerContent]}>
        <ActivityIndicator size="large" color={COLORS.mediumGreen} />
        <Text style={styles.loadingText}>Cargando perfil...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.content}>
        <TopMenu navigation={navigation} />

        <View style={styles.profileSection}>
          <Image
            source={{
              uri: profile?.avatar_url || 
                'https://i.pinimg.com/736x/bc/98/0b/bc980b9e0bf723ac8393222ff0249da9.jpg',
            }}
            style={styles.profileImage}
          />
          <Text style={styles.name}>{profile?.real_display_name || "Paramédico"}</Text>
          <Text style={styles.subtitle}>
            Gracias por tu servicio, {profile?.real_display_name || 'Paramédico'}. Tu ayuda es importante y marca la diferencia.
          </Text>
        </View>

        {/* Estado de turno */}
        <View style={styles.statusCard}>
          <View style={styles.statusHeader}>
            <MaterialIcons 
              name={isActive ? "work" : "work-off"} 
              size={24} 
              color={isActive ? COLORS.mediumGreen : COLORS.darkGray} 
            />
            <Text style={styles.statusTitle}>Estado de turno</Text>
            {updatingStatus && (
              <ActivityIndicator 
                size="small" 
                color={COLORS.mediumGreen} 
                style={styles.statusLoader}
              />
            )}
          </View>
          
          <View style={styles.statusToggle}>
            <Text style={[styles.statusText, !isActive && styles.statusTextActive]}>
              Inactivo
            </Text>
            <Switch
              trackColor={{ false: '#D1D5DB', true: COLORS.lightGreen }}
              thumbColor={isActive ? COLORS.mediumGreen : '#9CA3AF'}
              onValueChange={toggleActiveStatus}
              value={isActive}
              disabled={updatingStatus}
            />
            <Text style={[styles.statusText, isActive && styles.statusTextActive]}>
              Activo
            </Text>
          </View>
          
          <Text style={styles.statusDescription}>
            {isActive 
              ? '✓ Estás disponible para atender emergencias' 
              : '○ No aparecerás en la lista de paramédicos activos'}
          </Text>
        </View>

        <View style={styles.options}>
          <TouchableOpacity
            style={styles.optionButton}
            onPress={() => navigation.navigate('RegisterNewCaseScreen')}
          >
            <FontAwesome5 name="notes-medical" size={22} color="black" />
            <Text style={styles.optionText}>Registrar caso nuevo</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.optionButton}
            onPress={() => navigation.navigate('ActiveBikersScreen')}
          >
            <Ionicons name="bicycle" size={24} color="black" />
            <Text style={styles.optionText}>Ver bikers activos</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.optionButton}
            onPress={() => navigation.navigate('EmergencyCallsHistory')}
          >
            <MaterialIcons name="history" size={24} color="black" />
            <Text style={styles.optionText}>Ver historial de casos</Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={styles.optionButton} 
            onPress={() => navigation.navigate('EditBikerProfile')}
          >
            <Ionicons name="person-outline" size={24} color="black" />
            <Text style={styles.optionText}>Editar perfil</Text>
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
  centerContent: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: '#666',
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
  subtitle: {
    textAlign: 'center',
    color: '#555',
    marginHorizontal: 30,
    marginTop: 5,
    fontSize: 14,
  },
  statusCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 20,
    marginHorizontal: 20,
    marginTop: 30,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    width: '85%',
  },
  statusHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
  },
  statusTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 10,
    color: '#333',
    flex: 1,
  },
  statusLoader: {
    marginLeft: 10,
  },
  statusToggle: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 10,
  },
  statusText: {
    fontSize: 15,
    color: '#9CA3AF',
    marginHorizontal: 12,
    fontWeight: '500',
  },
  statusTextActive: {
    color: COLORS.darkGreen,
    fontWeight: '600',
  },
  statusDescription: {
    fontSize: 13,
    color: '#6B7280',
    textAlign: 'center',
    marginTop: 8,
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