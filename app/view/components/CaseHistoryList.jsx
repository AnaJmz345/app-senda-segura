// componente reutilizable para mostrar el historial de casos

import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  FlatList,
  RefreshControl,
  StyleSheet,
  ActivityIndicator,
  TouchableOpacity
} from 'react-native';
import { Ionicons, FontAwesome5 } from '@expo/vector-icons';
import { supabase } from '../lib/supabase';
import { COLORS } from '../constants/colors';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';

export default function CaseHistoryList({ 
  paramedicId = null, 
  showAllParamedics = false 
}) {
  const [cases, setCases] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    loadCases();
  }, [paramedicId]);

  const loadCases = async () => {
    try {
      setLoading(true);
      
      let query = supabase
        .from('paramedic_cases')
        .select(`
          id,
          injury_type,
          description,
          created_at,
          biker:profiles!paramedic_cases_biker_id_fkey(display_name, real_display_name),
          paramedic:profiles!paramedic_cases_paramedic_id_fkey(display_name, real_display_name)
        `)
        .order('created_at', { ascending: false });

      // Si no es "mostrar todos", filtrar por paramédico específico
      if (!showAllParamedics && paramedicId) {
        query = query.eq('paramedic_id', paramedicId);
      }

      const { data, error } = await query;

      if (error) throw error;
      setCases(data || []);
    } catch (error) {
      console.error('Error loading cases:', error);
    } finally {
      setLoading(false);
    }
  };

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await loadCases();
    setRefreshing(false);
  }, [paramedicId]);

  const renderCaseItem = ({ item, index }) => (
    <View style={styles.caseCard}>
      <View style={styles.caseHeader}>
        <View style={styles.caseNumberContainer}>
          <Text style={styles.caseNumber}>#{index + 1}</Text>
        </View>
        <Text style={styles.caseDate}>
          {format(new Date(item.created_at), "dd MMM yyyy, HH:mm", { locale: es })}
        </Text>
      </View>

      <View style={styles.caseDetails}>
        <View style={styles.detailRow}>
          <Ionicons name="person" size={16} color={COLORS.darkGreen} />
          <Text style={styles.detailLabel}>Ciclista:</Text>
          <Text style={styles.detailValue}>
            {item.biker?.real_display_name || item.biker?.display_name || 'N/A'}
          </Text>
        </View>

        {showAllParamedics && (
          <View style={styles.detailRow}>
            <FontAwesome5 name="user-nurse" size={14} color={COLORS.darkGreen} />
            <Text style={styles.detailLabel}>Paramédico:</Text>
            <Text style={styles.detailValue}>
              {item.paramedic?.real_display_name || item.paramedic?.display_name || 'N/A'}
            </Text>
          </View>
        )}

        <View style={styles.detailRow}>
          <FontAwesome5 name="notes-medical" size={14} color={COLORS.darkGreen} />
          <Text style={styles.detailLabel}>Lesión:</Text>
          <Text style={styles.detailValue}>{item.injury_type}</Text>
        </View>
      </View>

      {item.description && (
        <View style={styles.descriptionContainer}>
          <Text style={styles.descriptionLabel}>Descripción:</Text>
          <Text style={styles.descriptionText} numberOfLines={3}>
            {item.description}
          </Text>
        </View>
      )}
    </View>
  );

  const renderEmptyComponent = () => (
    <View style={styles.emptyContainer}>
      <FontAwesome5 name="clipboard-list" size={64} color="#CCC" />
      <Text style={styles.emptyTitle}>No hay casos registrados</Text>
      <Text style={styles.emptySubtitle}>
        {showAllParamedics 
          ? 'Aún no se han registrado casos médicos'
          : 'No has registrado casos aún'}
      </Text>
    </View>
  );

  const renderHeader = () => (
    <View style={styles.listHeader}>
      <Text style={styles.listTitle}>
        Casos Registrados ({cases.length})
      </Text>
    </View>
  );

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={COLORS.mediumGreen} />
        <Text style={styles.loadingText}>Cargando historial...</Text>
      </View>
    );
  }

  return (
    <FlatList
      data={cases}
      renderItem={renderCaseItem}
      keyExtractor={(item) => item.id}
      ListHeaderComponent={renderHeader}
      ListEmptyComponent={renderEmptyComponent}
      contentContainerStyle={[
        styles.listContainer,
        cases.length === 0 && styles.emptyListContainer
      ]}
      refreshControl={
        <RefreshControl
          refreshing={refreshing}
          onRefresh={onRefresh}
          colors={[COLORS.mediumGreen]}
          tintColor={COLORS.mediumGreen}
          title="Actualizando..."
          titleColor={COLORS.darkGreen}
        />
      }
      showsVerticalScrollIndicator={false}
    />
  );
}

const styles = StyleSheet.create({
  listContainer: {
    padding: 16,
  },
  emptyListContainer: {
    flexGrow: 1,
  },
  listHeader: {
    marginBottom: 16,
  },
  listTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: COLORS.darkGreen,
  },
  caseCard: {
    backgroundColor: '#FFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  caseHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#EEE',
  },
  caseNumberContainer: {
    backgroundColor: COLORS.lightGreen,
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
  },
  caseNumber: {
    fontSize: 14,
    fontWeight: 'bold',
    color: COLORS.darkGreen,
  },
  caseDate: {
    fontSize: 12,
    color: '#666',
  },
  caseDetails: {
    marginBottom: 8,
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  detailLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
    marginLeft: 8,
    marginRight: 4,
  },
  detailValue: {
    fontSize: 14,
    color: '#666',
    flex: 1,
  },
  descriptionContainer: {
    backgroundColor: '#F9F9F9',
    borderRadius: 8,
    padding: 12,
    marginTop: 8,
  },
  descriptionLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: '#666',
    marginBottom: 4,
  },
  descriptionText: {
    fontSize: 14,
    color: '#333',
    lineHeight: 20,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 40,
  },
  loadingText: {
    marginTop: 12,
    fontSize: 16,
    color: '#666',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 40,
  },
  emptyTitle: {
    marginTop: 16,
    fontSize: 18,
    fontWeight: '600',
    color: '#999',
    textAlign: 'center',
  },
  emptySubtitle: {
    marginTop: 8,
    fontSize: 14,
    color: '#BBB',
    textAlign: 'center',
  },
});