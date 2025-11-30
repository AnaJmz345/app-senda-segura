import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '../../constants/colors';

const ActiveParamedicsScreen = () => {
  const [activeTab, setActiveTab] = useState('paramedicos'); // 'paramedicos' o 'botiquines'

  // 📦 Datos de ejemplo - Paramédicos
  const mockParamedics = [
    {
      id: '1',
      name: 'Trifón González',
      age: 32,
      activeCases: 20,
      avatar: null,
    },
    {
      id: '2',
      name: 'Sarah Muñoz',
      age: 32,
      activeCases: 2,
      avatar: null,
    },
    {
      id: '3',
      name: 'Mario Vega',
      age: 19,
      activeCases: 4,
      avatar: null,
    },
    {
      id: '4',
      name: 'Mariela León',
      age: 28,
      activeCases: 5,
      avatar: null,
    },
  ];

  // 🏥 Datos de ejemplo - Botiquines
  const mockKits = [
    {
      id: '1',
      name: 'Botiquín',
      age: 36,
      activeCases: 5,
      avatar: null,
    },
    {
      id: '2',
      name: 'Ana Paz',
      age: 39,
      activeCases: 1,
      avatar: null,
    },
  ];

  const currentData = activeTab === 'paramedicos' ? mockParamedics : mockKits;

  const renderCard = (item) => (
    <View
      key={item.id}
      style={[
        styles.card,
        { backgroundColor: activeTab === 'paramedicos' ? COLORS.lightGreen : '#D3D3D3' },
      ]}
    >
      <View style={styles.cardContent}>
        <View style={styles.infoContainer}>
          <Text style={styles.nameText}>{item.name}</Text>
          <Text style={styles.detailText}>
            {item.age} años | Casos atendidos: {item.activeCases}
          </Text>
        </View>

        <TouchableOpacity style={styles.iconButton}>
          <Ionicons name="image-outline" size={32} color={COLORS.darkGreen} />
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.safeArea}>
      {/* Header con fondo verde */}
      <View style={styles.header}>
        <View style={styles.headerBackground} />
        <View style={styles.headerOverlay}>
          <TouchableOpacity style={styles.backButton}>
            <Ionicons name="arrow-back" size={24} color={COLORS.white} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Admin</Text>
          <TouchableOpacity style={styles.profileButton}>
            <Text style={styles.profileText}>Perfil</Text>
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView style={styles.container}>
        {/* Tabs */}
        <View style={styles.tabContainer}>
          <TouchableOpacity
            style={[styles.tab, activeTab === 'paramedicos' && styles.activeTab]}
            onPress={() => setActiveTab('paramedicos')}
          >
            <Text
              style={[
                styles.tabText,
                activeTab === 'paramedicos' && styles.activeTabText,
              ]}
            >
              Paramédicos
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.tab, activeTab === 'botiquines' && styles.activeTab]}
            onPress={() => setActiveTab('botiquines')}
          >
            <Text
              style={[
                styles.tabText,
                activeTab === 'botiquines' && styles.activeTabText,
              ]}
            >
              Botiquines
            </Text>
          </TouchableOpacity>
        </View>

        {/* Lista de cards */}
        <View style={styles.cardList}>
          {currentData.map((item) => renderCard(item))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: COLORS.white,
  },
  header: {
    height: 150,
    position: 'relative',
  },
  headerBackground: {
    width: '100%',
    height: '100%',
    position: 'absolute',
    backgroundColor: COLORS.darkGreen,
  },
  headerOverlay: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: 10,
  },
  backButton: {
    padding: 5,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: COLORS.white,
  },
  profileButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  profileText: {
    fontSize: 16,
    color: COLORS.white,
    fontWeight: '500',
  },
  container: {
    flex: 1,
    backgroundColor: COLORS.white,
  },
  tabContainer: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    paddingTop: 20,
    gap: 10,
  },
  tab: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 20,
    backgroundColor: '#E0E0E0',
  },
  activeTab: {
    backgroundColor: COLORS.mediumGreen,
  },
  tabText: {
    fontSize: 16,
    color: '#666',
    fontWeight: '500',
  },
  activeTabText: {
    color: COLORS.white,
  },
  cardList: {
    padding: 20,
    gap: 15,
  },
  card: {
    borderRadius: 12,
    padding: 15,
    marginBottom: 10,
  },
  cardContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  infoContainer: {
    flex: 1,
  },
  nameText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: COLORS.darkGreen,
    marginBottom: 5,
  },
  detailText: {
    fontSize: 14,
    color: COLORS.darkGreen,
  },
  iconButton: {
    width: 50,
    height: 50,
    borderRadius: 8,
    backgroundColor: COLORS.white,
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default ActiveParamedicsScreen;
