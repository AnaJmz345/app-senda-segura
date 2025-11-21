import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, ScrollView } from 'react-native';
import { Ionicons, FontAwesome5, MaterialIcons } from '@expo/vector-icons';
import { useAuth } from '../../context/AuthContext';
import TopMenu from '../../components/TopMenu';
import { executeSql } from '../../lib/sqlite';

export default function ParamedicProfileScreen({ navigation }) {
  const { signOut, user } = useAuth();
  const [profile, setProfile] = useState(null);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const result = await executeSql('SELECT * FROM profiles WHERE id = ? LIMIT 1', [user?.id]);
        setProfile(result.rows._array[0] || null);
      } catch (e) {
        setProfile(null);
      }
    };
    fetchProfile();
  }, [user]);

  const handleLogout = async () => {
    await signOut();
  };

  return (
    <ScrollView contentContainerStyle={styles.content}>
      <TopMenu navigation={navigation} />

      <View style={styles.profileSection}>
        <Image
          source={{ uri: profile?.avatar_url || require('../../../../assets/gatitoprofile.jpeg') }}
          style={styles.profileImage}
        />
        <Text style={styles.name}>{profile?.display_name || 'Pablo Medina'}</Text>
        <Text style={styles.subtitle}>
          Gracias por tu servicio, {profile?.display_name?.split(' ')[0] || 'Paramédico'}. Tu ayuda es importante y marca la diferencia.
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

      <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
        <Text style={styles.logoutText}>Cerrar sesión</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  content: {
    alignItems: 'center',
    paddingBottom: 40,
    backgroundColor: '#F8F8F8',
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
