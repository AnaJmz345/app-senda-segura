import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ImageBackground, TouchableOpacity, Image } from 'react-native';
import { COLORS } from '../constants/colors';
import { useNavigation } from '@react-navigation/native';
import * as Font from 'expo-font';
import { SafeAreaView } from 'react-native-safe-area-context';
import { supabase } from '../lib/supabase'; // ← IMPORTANTE

export default function HomeScreen() {
  const navigation = useNavigation();
  const [fontsLoaded, setFontsLoaded] = useState(false);

  useEffect(() => {
    (async () => {
      await Font.loadAsync({
        Italiana: require('../../../assets/fonts/Italiana-Regular.ttf'),
      });
      setFontsLoaded(true);
    })();
  }, []);

  if (!fontsLoaded) return null;

  const handleLogout = async () => {
    await supabase.auth.signOut();
    // No necesitas navegar, el stack se actualizará solo por el contexto de Auth
  };

  return (
    <ImageBackground
      source={require('../../../assets/bosqueprimavera2.jpg')}
      style={styles.background}
      blurRadius={5}
    >
      <SafeAreaView style={{ flex: 1 }}>
        <View style={styles.overlay}>
          <View style={styles.card}>
            <Image
              source={require('../../../assets/logo_SendaSegura.png')}
              style={styles.logoImage}
              resizeMode="contain"
            />
            <Text style={styles.title}>Más Bosque{'\n'}Manu</Text>
            <Text style={styles.subtitle}>Rodamos juntos, cuidamos juntos.</Text>
            <TouchableOpacity
              style={styles.button}
              onPress={() => navigation.navigate('Login')}
            >
              <Text style={styles.buttonText}>Tu ruta segura empieza aquí</Text>
            </TouchableOpacity>
            {/* Botón de cerrar sesión */}
            <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
              <Text style={styles.logoutText}>Cerrar sesión</Text>
            </TouchableOpacity>
          </View>
        </View>
      </SafeAreaView>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  background: { flex: 1 },
  overlay: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  card: {
    width: '87%',
    backgroundColor: 'rgba(21, 52, 31, 0.85)', // Capa con transparencia y color de tu paleta
    borderRadius: 35,
    alignItems: 'center',
    paddingVertical: 42,
    paddingHorizontal: 24,
    shadowColor: '#000', shadowOpacity: 0.21, shadowRadius: 18, elevation: 9,
  },
  logoImage: { width: 110, height: 110, marginBottom: 16 },
  title: {
    fontSize: 40,
    color: COLORS.white,
    textAlign: 'center',
    fontFamily: 'Italiana',
    letterSpacing: 1,
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 17,
    color: COLORS.lightGreen,
    textAlign: 'center',
    marginBottom: 34,
    fontWeight: '400',
  },
  button: {
    backgroundColor: COLORS.mediumGreen,
    paddingVertical: 17,
    paddingHorizontal: 34,
    borderRadius: 20,
    marginTop: 20,
    width: '95%',
    shadowColor: '#000', shadowOpacity: 0.19, shadowRadius: 12, elevation: 6,
  },
  buttonText: {
    color: COLORS.white,
    fontSize: 18,
    textAlign: 'center',
    fontWeight: '600',
    letterSpacing: 0.5,
  },
  // NUEVO ESTILO:
  logoutButton: {
    backgroundColor: COLORS.mediumGreen,
    borderRadius: 16,
    marginTop: 16,
    paddingVertical: 7,
    paddingHorizontal: 28,
    alignSelf: 'center',
    opacity: 0.84,
  },
  logoutText: {
    color: COLORS.white,
    fontWeight: 'bold',
    fontSize: 14,
    textAlign: 'center',
    letterSpacing: 0.5,
  },
});
