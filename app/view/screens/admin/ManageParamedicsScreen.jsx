import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, FlatList, TextInput, Image, RefreshControl, Alert } from 'react-native';
import { Ionicons, FontAwesome5 } from '@expo/vector-icons';
import { COLORS } from '../../constants/colors';
import { supabase } from '../../lib/supabase';

export default function ManageParamedicsScreen({ navigation }) {
  const [activeTab, setActiveTab] = useState('all'); // 'all', 'active' o 'inactive'
  const [searchText, setSearchText] = useState('');
  const [refreshing, setRefreshing] = useState(false);
  const [paramedics, setParamedics] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchParamedics();
  }, []);

  const fetchParamedics = async () => {
    try {
      // Obtener todos los usuarios con role='paramedic'
      const { data: profiles, error: profilesError } = await supabase
        .from('profiles')
        .select('id, display_name, phone, avatar_url')
        .eq('role', 'paramedic');

      if (profilesError) throw profilesError;

      // Para cada paramédico, obtener su estado y contar casos
      const paramedicsData = await Promise.all(
        profiles.map(async (profile) => {
          // Obtener estado del paramédico
          const { data: status } = await supabase
            .from('paramedic_status')
            .select('is_active')
            .eq('user_id', profile.id)
            .single();

          // Contar casos atendidos
          const { count } = await supabase
            .from('paramedic_cases')
            .select('*', { count: 'exact', head: true })
            .eq('paramedic_id', profile.id);

          // Obtener edad del perfil médico si existe
          const { data: medicalProfile } = await supabase
            .from('medical_profiles')
            .select('age')
            .eq('user_id', profile.id)
            .single();

          return {
            id: profile.id,
            name: profile.display_name || 'Sin nombre',
            age: medicalProfile?.age || 0,
            cases: count || 0,
            active: status?.is_active || false,
            photo: profile.avatar_url,
          };
        })
      );

      setParamedics(paramedicsData);
    } catch (error) {
      console.error('Error fetching paramedics:', error);
      Alert.alert('Error', 'No se pudieron cargar los paramédicos');
    } finally {
      setLoading(false);
    }
  };

  const filteredParamedics = paramedics.filter(p => {
    const matchesSearch = p.name.toLowerCase().includes(searchText.toLowerCase());
    if (activeTab === 'all') return matchesSearch;
    return matchesSearch && (activeTab === 'active' ? p.active : !p.active);
  });

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchParamedics();
    setRefreshing(false);
  };

  const renderParamedic = ({ item }) => (
    <View style={styles.paramedicCard}>
      <Image source={{ uri: item.photo }} style={styles.paramedicPhoto} />
      
      <View style={styles.paramedicInfo}>
        <Text style={styles.paramedicName}>{item.name}</Text>
        <Text style={styles.paramedicDetails}>
          {item.age} años | Casos atendidos: {item.cases}
        </Text>
      </View>

      <TouchableOpacity style={styles.deleteButton}>
        <Ionicons name="trash-outline" size={22} color="#E74C3C" />
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={styles.container}>
      {/* Header de título y botoncin de retornar */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
          <Ionicons name="chevron-back" size={28} color="black" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>PARAMÉDICOS</Text>
        <View style={styles.placeholder} />
      </View>

      {/* Tabs: Todos, Activos e Inactivos para poder buscar más fácilmente */}
      <View style={styles.tabContainer}>
        <TouchableOpacity 
          style={[styles.tab, activeTab === 'all' && styles.activeTab]}
          onPress={() => setActiveTab('all')}
        >
          <Text style={[styles.tabText, activeTab === 'all' && styles.activeTabText]}>Todos</Text>
        </TouchableOpacity>
        <TouchableOpacity 
          style={[styles.tab, activeTab === 'active' && styles.activeTab]}
          onPress={() => setActiveTab('active')}
        >
          <Text style={[styles.tabText, activeTab === 'active' && styles.activeTabText]}>Activos</Text>
        </TouchableOpacity>
        <TouchableOpacity 
          style={[styles.tab, activeTab === 'inactive' && styles.activeTab]}
          onPress={() => setActiveTab('inactive')}
        >
          <Text style={[styles.tabText, activeTab === 'inactive' && styles.activeTabText]}>Inactivos</Text>
        </TouchableOpacity>
      </View>

      {/* Barra de búsqueda */}
      <View style={styles.searchContainer}>
        <Ionicons name="search" size={20} color="#999" style={styles.searchIcon} />
        <TextInput
          style={styles.searchInput}
          placeholder="Buscar paramédico..."
          value={searchText}
          onChangeText={setSearchText}
          placeholderTextColor="#999"
        />
      </View>

      {/* Lista de paramédicos */}
      <FlatList
        data={filteredParamedics}
        renderItem={renderParamedic}
        keyExtractor={(item) => item.id.toString()}
        contentContainerStyle={styles.listContainer}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor={COLORS.mediumGreen}
            colors={[COLORS.mediumGreen]}
          />
        }
      />

    </View>
  );
}

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    backgroundColor: COLORS.lightGreen,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: 40,
    paddingBottom: 15,
    backgroundColor: COLORS.white,
    elevation: 2,
    shadowColor: COLORS.black,
    shadowOpacity: 0.1,
    shadowRadius: 3,
    shadowOffset: { width: 0, height: 2 },
  },
  backButton: {
    backgroundColor: COLORS.mediumGreen,
    padding: 6,
    borderRadius: 6,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: COLORS.black,
  },
  placeholder: {
    width: 40,
  },
  tabContainer: {
    flexDirection: 'row',
    backgroundColor: COLORS.white,
    marginHorizontal: 20,
    marginTop: 15,
    borderRadius: 8,
    padding: 4,
  },
  tab: {
    flex: 1,
    paddingVertical: 10,
    alignItems: 'center',
    borderRadius: 6,
  },
  activeTab: {
    backgroundColor: COLORS.mediumGreen,
  },
  tabText: {
    fontSize: 15,
    color: COLORS.darkGreen,
    fontWeight: '500',
  },
  activeTabText: {
    color: COLORS.white,
    fontWeight: '600',
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.white,
    marginHorizontal: 20,
    marginTop: 15,
    borderRadius: 8,
    paddingHorizontal: 12,
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    paddingVertical: 12,
    paddingHorizontal: 12,
    fontSize: 15,
    color: COLORS.black,
  },
  listContainer: {
    marginTop: 15,
    paddingHorizontal: 20,
    paddingBottom: 100,
  },
  paramedicCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.white,
    borderRadius: 12,
    padding: 15,
    marginBottom: 12,
    elevation: 2,
    shadowColor: COLORS.black,
    shadowOpacity: 0.1,
    shadowRadius: 3,
    shadowOffset: { width: 0, height: 1 },
  },
  paramedicPhoto: {
    width: 55,
    height: 55,
    borderRadius: 27.5,
    backgroundColor: COLORS.lightGreen,
  },
  paramedicInfo: {
    flex: 1,
    marginLeft: 15,
  },
  paramedicName: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.deepGreen,
    marginBottom: 4,
  },
  paramedicDetails: {
    fontSize: 13,
    color: COLORS.darkGreen,
  },
  deleteButton: {
    padding: 8,
  },
  addButton: {
    position: 'absolute',
    bottom: 25,
    right: 25,
    backgroundColor: COLORS.mediumGreen,
    width: 60,
    height: 60,
    borderRadius: 30,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 5,
    shadowColor: COLORS.black,
    shadowOpacity: 0.3,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
  },
});
