import React from 'react';
import { View, Text, StyleSheet, ImageBackground, TouchableOpacity } from 'react-native';
import { COLORS } from '../constants/colors';
import { useNavigation } from '@react-navigation/native';

export default function HomeScreen() {
  const navigation = useNavigation();

  return (
    <ImageBackground
      source={require('../../../assets/bosqueprimavera2.jpg')} 
      style={styles.background}
    >
      <View style={styles.overlay}>
        <View style={styles.logoContainer}>
          <Text style={styles.logo}>🚴</Text>
        </View>

        <Text style={styles.title}>Más bosque{'\n'}Manu</Text>
        <Text style={styles.subtitle}>Rodamos juntos, cuidamos juntos.</Text>

        <TouchableOpacity
          style={styles.button}
          onPress={() => navigation.navigate('Login')}
        >
          <Text style={styles.buttonText}>Tu ruta segura empieza aquí</Text>
        </TouchableOpacity>
      </View>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  background: { flex: 1, justifyContent: 'center' },
  overlay: { alignItems: 'center', paddingHorizontal: 20 },
  logoContainer: { marginBottom: 20 },
  logo: { fontSize: 60 },
  title: {
    fontSize: 36,
    color: COLORS.white,
    textAlign: 'center',
    fontWeight: 'bold',
  },
  subtitle: {
    fontSize: 16,
    color: COLORS.lightGreen,
    textAlign: 'center',
    marginBottom: 50,
  },
  button: {
    backgroundColor: COLORS.mediumGreen,
    paddingVertical: 15,
    paddingHorizontal: 40,
    borderRadius: 10,
  },
  buttonText: {
    color: COLORS.white,
    fontSize: 16,
    textAlign: 'center',
  },
});
