import React, { useEffect, useState, useCallback } from 'react';
import { useFocusEffect } from '@react-navigation/native';
import { View, Text, StyleSheet, Image, TouchableOpacity, ScrollView, Switch, Alert } from 'react-native';
import { Ionicons, FontAwesome5, MaterialIcons } from '@expo/vector-icons';
import { useAuth } from '../../context/AuthContext';
import TopMenu from '../../components/TopMenu';
import { supabase } from '../../lib/supabase';
import { COLORS } from '../../constants/colors';

export default function ParamedicProfileScreen({ navigation }) {
  const { signOut, user } = useAuth();
  const [profile, setProfile] = useState(null);
  const [isActive, setIsActive] = useState(false);
  const [loading, setLoading] = useState(true);

  useFocusEffect(
    useCallback(() => {
      loadParamedicData();
    }, [user])
  );

  const loadParamedicData = async () => {
    try {
      // Obtener perfil del usuario
      const { data: profileData, error: profileError } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();

      if (profileError) throw profileError;
      setProfile(profileData);

      // Obtener o crear estado del paramédico
      let { data: statusData, error: statusError } = await supabase
        .from('paramedic_status')
        .select('is_active')
        .eq('user_id', user.id)
        .single();

      if (statusError && statusError.code === 'PGRST116') {
        // No existe registro, crear uno
        const { data: newStatus, error: insertError } = await supabase
          .from('paramedic_status')
          .insert([{ user_id: user.id, is_active: false }])
          .select()
          .single();

        if (insertError) throw insertError;
        setIsActive(newStatus.is_active);
      } else if (statusError) {
        throw statusError;
      } else {
        setIsActive(statusData.is_active);
      }
    } catch (error) {
      console.error('Error loading paramedic data:', error);
      Alert.alert('Error', 'No se pudo cargar la información del paramédico');
    } finally {
      setLoading(false);
    }
  };

  const toggleActiveStatus = async (newValue) => {
    try {
      const { error } = await supabase
        .from('paramedic_status')
        .update({ is_active: newValue })
        .eq('user_id', user.id);

      if (error) throw error;

      setIsActive(newValue);
      Alert.alert(
        'Estado actualizado',
        newValue ? 'Turno iniciado. Ahora estás activo.' : 'Turno finalizado. Ahora estás inactivo.'
      );
    } catch (error) {
      console.error('Error updating status:', error);
      Alert.alert('Error', 'No se pudo actualizar el estado');
    }
  };

  const handleLogout = async () => {
    try {
      await signOut();
    } catch (error) {
      console.error('Error signing out:', error);
      Alert.alert('Error', 'No se pudo cerrar la sesión. Intenta de nuevo.');
    }
  };

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.content}>
        <TopMenu navigation={navigation} />

        <View style={styles.profileSection}>
          <Image
            source={{ uri: profile?.avatar_url || 'https://via.placeholder.com/100' }}
            style={styles.profileImage}
          />
          <Text style={styles.name}>{profile?.display_name || 'Paramédico'}</Text>
          <Text style={styles.subtitle}>
            Gracias por tu servicio, {profile?.display_name?.split(' ')[0] || 'Paramédico'}. Tu ayuda es importante y marca la diferencia.
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
            />
            <Text style={[styles.statusText, isActive && styles.statusTextActive]}>
              Activo
            </Text>
          </View>
          <Text style={styles.statusDescription}>
            {isActive 
              ? '✓ Estás disponible para atender emergencias' 
              : '○ No aparecerás en la lista de paramédicos activos.'}
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
