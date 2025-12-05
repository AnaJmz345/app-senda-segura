import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ActivityIndicator } from 'react-native';
import { FontAwesome5 } from '@expo/vector-icons';
import { supabase } from '../lib/supabase';

export default function EmergencyCardVertical({ onPress }) {
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

  return (
    <TouchableOpacity
      style={styles.card}
      onPress={onPress}
      activeOpacity={0.7}
    >
      <Text style={styles.number}>{loading ? <ActivityIndicator size="small" color="#fff" /> : count}</Text>
      <Text style={styles.title}>Emergencias</Text>
      <TouchableOpacity style={styles.button} onPress={onPress}>
        <FontAwesome5 name="heart" size={14} color="#fff" />
        <Text style={styles.btnText}> Atender</Text>
      </TouchableOpacity>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    width: 150,
    height: 145,
    backgroundColor: '#FCEEEF',
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 12,
    margin: 16,
    shadowColor: '#6f0000ff',
    shadowOpacity: 0.5,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 6 },
    elevation: 6,
  },
  title: {
    color: '#030303ff',
    fontWeight: '700',
    fontSize: 14,
    textAlign: 'center',
    marginBottom: 8,
  },
  number: {
    fontSize: 42,
    fontWeight: '800',
    color: '#2E2E2E',
    marginVertical: 8,
    textAlign: 'center',
  },
  button: {
    backgroundColor: '#B3272D',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 16,
    flexDirection: 'row',
    alignItems: 'center',
  },
  btnText: { color: '#fff', fontWeight: '700' },
});
