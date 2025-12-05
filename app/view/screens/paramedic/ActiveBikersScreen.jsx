import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import TopMenu from '../../components/TopMenu';
import EmergencyCardVertical from '../../components/EmergencyCardVert';
import PadCarts from '../../components/PadCarts';

const COLORS = {
  bg: '#FFFFFF',
  h1: '#2E5B3E',
  h2: '#0F3D1F',
  green: '#95C29B',
  blue: '#757b80ff',
  orange: '#E99B65',
};

export default function ActiveBikersScreen({ navigation }) {
  const hoy = new Date().toLocaleDateString('es-MX', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });

  return (
    <ScrollView
      style={{ flex: 1, backgroundColor: COLORS.bg }}
      contentContainerStyle={{ paddingBottom: 32 }}
    >
      <TopMenu navigation={navigation} role="paramedic" />

      <View style={styles.wrapper}>
        <Text style={styles.kicker}>Bikers activos</Text>
        <Text style={styles.title}>Actualmente en ruta</Text>
        <Text style={styles.date}>
          {hoy.charAt(0).toUpperCase() + hoy.slice(1)}
        </Text>

        <View style={styles.grid}>
          <PadCarts
            title="Principiante"
            count={8}
            color={COLORS.green}
          />
          <PadCarts
            title="Intermedio"
            count={9}
            color={COLORS.blue}
          />
          <PadCarts
            title="Avanzado"
            count={1}
            color={COLORS.orange}
          />
          <EmergencyCardVertical
            onPress={() => navigation.navigate("EmergencyListScreen")}
          />
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  wrapper: { paddingHorizontal: 20, paddingTop: 12 },
  kicker: { color: '#426A52', fontSize: 18, marginBottom: 4 },
  title: { color: '#1C4C2B', fontSize: 26, fontWeight: '800' },
  date: { color: '#7A7A7A', marginTop: 6, marginBottom: 35, fontSize: 16 },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    rowGap: 16,
  },
});
