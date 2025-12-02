import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity, 
  ScrollView,
  ActivityIndicator,
  SafeAreaView
} from 'react-native';
import { Ionicons, FontAwesome5 } from '@expo/vector-icons';
import { Picker } from '@react-native-picker/picker';
import { supabase } from '../../lib/supabase';
import { COLORS } from '../../constants/colors';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';

export default function MedicalHistoryRecordsScreen({ navigation }) {
  const [paramedics, setParamedics] = useState([]);
  const [selectedParamedic, setSelectedParamedic] = useState('all');
  const [cases, setCases] = useState([]);
  const [firstAidCount, setFirstAidCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [loadingCases, setLoadingCases] = useState(false);

  // Cargar paramédicos al montar
  useEffect(() => {
    loadParamedics();
    loadFirstAidCount();
  }, []);

  // Cargar casos cuando cambia el filtro
  useEffect(() => {
    loadCases();
  }, [selectedParamedic]);

  const loadParamedics = async () => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('id, display_name, real_display_name')
        .eq('role', 'paramedic')
        .order('display_name');

      if (error) throw error;
      setParamedics(data || []);
    } catch (error) {
      console.error('Error loading paramedics:', error);
    }
  };

  const loadCases = async () => {
    try {
      setLoadingCases(true);
      
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

      // Aplicar filtro si no es "all"
      if (selectedParamedic !== 'all') {
        query = query.eq('paramedic_id', selectedParamedic);
      }

      const { data, error } = await query;

      if (error) throw error;
      setCases(data || []);
    } catch (error) {
      console.error('Error loading cases:', error);
    } finally {
      setLoadingCases(false);
      setLoading(false);
    }
  };

  const loadFirstAidCount = async () => {
    try {
      // Intentar cargar de map_markers si existe
      const { data, error } = await supabase
        .from('map_markers')
        .select('id', { count: 'exact' })
        .eq('type', 'first_aid')
        .eq('is_active', true);

      if (!error && data) {
        setFirstAidCount(data.length);
      } else {
        // Si la tabla no existe aún, poner 0
        setFirstAidCount(0);
      }
    } catch (error) {
      console.error('Error loading first aid count:', error);
      setFirstAidCount(0);
    }
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.backButtonContainer}>
          <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
            <Ionicons name="chevron-back" size={28} color="black" />
          </TouchableOpacity>
        </View>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={COLORS.mediumGreen} />
          <Text style={styles.loadingText}>Cargando historial...</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      {/* Botón de regresar */}
      <View style={styles.backButtonContainer}>
        <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
          <Ionicons name="chevron-back" size={28} color="black" />
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.title}>Historial Médico</Text>
          <Text style={styles.subtitle}>Gestión de casos registrados</Text>
        </View>

        {/* Card de estadísticas - Botiquines */}
        <View style={styles.statsCard}>
          <View style={styles.statsIconContainer}>
            <FontAwesome5 name="first-aid" size={32} color="#FF4444" />
          </View>
          <View style={styles.statsInfo}>
            <Text style={styles.statsNumber}>{firstAidCount}</Text>
            <Text style={styles.statsLabel}>Botiquines Disponibles</Text>
          </View>
        </View>

        {/* Filtro por Paramédico */}
        <View style={styles.filterCard}>
          <Text style={styles.filterLabel}>Filtrar por paramédico:</Text>
          <View style={styles.pickerContainer}>
            <Picker
              selectedValue={selectedParamedic}
              onValueChange={(value) => setSelectedParamedic(value)}
              style={styles.picker}
            >
              <Picker.Item label="Todos los paramédicos" value="all" />
              {paramedics.map((paramedic) => (
                <Picker.Item
                  key={paramedic.id}
                  label={paramedic.real_display_name || paramedic.display_name}
                  value={paramedic.id}
                />
              ))}
            </Picker>
          </View>
        </View>

        {/* Lista de casos */}
        <View style={styles.casesSection}>
          <Text style={styles.sectionTitle}>
            Casos Registrados ({cases.length})
          </Text>

          {loadingCases ? (
            <View style={styles.loadingCasesContainer}>
              <ActivityIndicator size="small" color={COLORS.mediumGreen} />
              <Text style={styles.loadingCasesText}>Cargando casos...</Text>
            </View>
          ) : cases.length === 0 ? (
            <View style={styles.emptyContainer}>
              <FontAwesome5 name="clipboard-list" size={48} color="#CCC" />
              <Text style={styles.emptyText}>
                {selectedParamedic === 'all' 
                  ? 'No hay casos registrados aún'
                  : 'Este paramédico no tiene casos registrados'}
              </Text>
            </View>
          ) : (
            cases.map((caseItem, index) => (
              <View key={caseItem.id} style={styles.caseCard}>
                <View style={styles.caseHeader}>
                  <View style={styles.caseNumberContainer}>
                    <Text style={styles.caseNumber}>#{index + 1}</Text>
                  </View>
                  <Text style={styles.caseDate}>
                    {format(new Date(caseItem.created_at), "dd MMM yyyy, HH:mm", { locale: es })}
                  </Text>
                </View>

                <View style={styles.caseDetails}>
                  <View style={styles.detailRow}>
                    <Ionicons name="person" size={16} color={COLORS.darkGreen} />
                    <Text style={styles.detailLabel}>Ciclista:</Text>
                    <Text style={styles.detailValue}>
                      {caseItem.biker?.real_display_name || caseItem.biker?.display_name || 'N/A'}
                    </Text>
                  </View>

                  <View style={styles.detailRow}>
                    <FontAwesome5 name="user-nurse" size={14} color={COLORS.darkGreen} />
                    <Text style={styles.detailLabel}>Paramédico:</Text>
                    <Text style={styles.detailValue}>
                      {caseItem.paramedic?.real_display_name || caseItem.paramedic?.display_name || 'N/A'}
                    </Text>
                  </View>

                  <View style={styles.detailRow}>
                    <FontAwesome5 name="notes-medical" size={14} color={COLORS.darkGreen} />
                    <Text style={styles.detailLabel}>Lesión:</Text>
                    <Text style={styles.detailValue}>{caseItem.injury_type}</Text>
                  </View>
                </View>

                {caseItem.description && (
                  <View style={styles.descriptionContainer}>
                    <Text style={styles.descriptionLabel}>Descripción:</Text>
                    <Text style={styles.descriptionText} numberOfLines={3}>
                      {caseItem.description}
                    </Text>
                  </View>
                )}
              </View>
            ))
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F8F8',
  },
  backButtonContainer: {
    position: 'absolute',
    top: 50,
    left: 20,
    zIndex: 10,
  },
  backButton: {
    backgroundColor: '#D19761',
    padding: 8,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 2,
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowRadius: 2,
    shadowOffset: { width: 0, height: 1 },
  },
  content: {
    paddingTop: 100,
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  header: {
    marginBottom: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: COLORS.darkGreen,
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 14,
    color: '#666',
  },
  statsCard: {
    backgroundColor: '#FFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  statsIconContainer: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#FFE5E5',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  statsInfo: {
    flex: 1,
  },
  statsNumber: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#FF4444',
  },
  statsLabel: {
    fontSize: 14,
    color: '#666',
    marginTop: 4,
  },
  filterCard: {
    backgroundColor: '#FFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  filterLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.darkGreen,
    marginBottom: 12,
  },
  pickerContainer: {
    borderWidth: 1,
    borderColor: '#DDD',
    borderRadius: 8,
    backgroundColor: '#F9F9F9',
  },
  picker: {
    height: 50,
  },
  casesSection: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: COLORS.darkGreen,
    marginBottom: 12,
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
    marginBottom: 12,
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
  },
  loadingText: {
    marginTop: 12,
    fontSize: 16,
    color: '#666',
  },
  loadingCasesContainer: {
    padding: 20,
    alignItems: 'center',
  },
  loadingCasesText: {
    marginTop: 8,
    fontSize: 14,
    color: '#666',
  },
  emptyContainer: {
    padding: 40,
    alignItems: 'center',
  },
  emptyText: {
    marginTop: 16,
    fontSize: 16,
    color: '#999',
    textAlign: 'center',
  },
});