import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ActivityIndicator } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { supabase } from '../lib/supabase';

export default function EmergencyCard() {
  const navigation = useNavigation();
  const [count, setCount] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadCount();

    // Actualizar cada 30 segundos
    const interval = setInterval(loadCount, 30000);

    return () => clearInterval(interval);
  }, []);

  const loadCount = async () => {
    try {
      const { count, error } = await supabase
        .from('emergencies')
        .select('*', { count: 'exact', head: true })
        .eq('status', 'pending');

      if (error) throw error;

      setCount(count || 0);
    } catch (err) {
      console.error('Error contando emergencias:', err);
    } finally {
      setLoading(false);
    }
  };

  const handlePress = () => {
    navigation.navigate('EmergencyListScreen');
  };

  return (
    <TouchableOpacity
      style={styles.card}
      onPress={handlePress}
      activeOpacity={0.7}
    >
      <View style={styles.iconContainer}>
        <MaterialIcons name="emergency" size={32} color="#FF5252" />
      </View>

      <View style={styles.content}>
        <Text style={styles.title}>Emergencias Activas</Text>
        {loading ? (
          <ActivityIndicator size="small" color="#FF5252" />
        ) : (
          <View style={styles.countContainer}>
            <Text style={styles.count}>{count}</Text>
            <Text style={styles.countLabel}>
              {count === 1 ? 'emergencia' : 'emergencias'}
            </Text>
          </View>
        )}
      </View>

      <MaterialIcons name="chevron-right" size={28} color="#999" />
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginHorizontal: 20,
    marginVertical: 15,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    borderLeftWidth: 4,
    borderLeftColor: '#FF5252',
  },
  iconContainer: {
    backgroundColor: '#FFEBEE',
    padding: 12,
    borderRadius: 12,
    marginRight: 15,
  },
  content: {
    flex: 1,
  },
  title: {
    fontSize: 16,
    fontWeight: '700',
    color: '#333',
    marginBottom: 4,
  },
  countContainer: {
    flexDirection: 'row',
    alignItems: 'baseline',
  },
  count: {
    fontSize: 24,
    fontWeight: '700',
    color: '#FF5252',
    marginRight: 6,
  },
  countLabel: {
    fontSize: 14,
    color: '#666',
  },
});

