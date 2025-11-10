import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

export default function PadCarts({ title, count, color, onPress }) {
  return (
    <TouchableOpacity style={[styles.card, { backgroundColor: color }]} onPress={onPress}>
      <View style={styles.row}>
        <View style={styles.dot} />
        <Text style={styles.count}>{count} activos</Text>
      </View>
      <View style={styles.iconWrap}>
        <Ionicons name="map-outline" size={60} color="#fff" />
      </View>
      <Text style={styles.title}>Nivel:{"\n"}{title}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    width: '47%',
    aspectRatio: 1,           
    borderRadius: 18,
    padding: 14,
    justifyContent: 'space-between',
    shadowColor: '#000',
    shadowOpacity: 0.15,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 },
    elevation: 4,
  },
  row: { flexDirection: 'row', alignItems: 'center' },
  dot: {
    width: 8, height: 8, borderRadius: 4, backgroundColor: '#24C16B', marginRight: 6,
  },
  count: { color: '#fff', fontWeight: '600' },
  iconWrap: { alignSelf: 'center', opacity: 0.9 },
  title: { color: '#fff', fontSize: 16, fontWeight: '700', lineHeight: 20 },
});
