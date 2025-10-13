import React from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ImageBackground } from 'react-native';
import { COLORS } from '../constants/colors';
import { useNavigation } from '@react-navigation/native';

export default function LoginScreen() {
  const navigation = useNavigation();

  return (
    <ImageBackground
      source={require('../../../assets/bosqueprimavera2.jpg')} 
      style={styles.background}
    >
      <View style={styles.container}>
        <Text style={styles.title}>Inicio de sesión</Text>
        <Text style={styles.subtitle}>Bienvenido de vuelta</Text>

        <TextInput placeholder="Email" style={styles.input} placeholderTextColor="#ccc" />
        <TextInput placeholder="Contraseña" secureTextEntry style={styles.input} placeholderTextColor="#ccc" />

        <TouchableOpacity style={styles.button}>
          <Text style={styles.buttonText}>Iniciar sesión</Text>
        </TouchableOpacity>

        <Text style={styles.bottomText}>
          ¿No tienes una cuenta?{' '}
          <Text style={styles.link} onPress={() => navigation.navigate('Register')}>
            Regístrate aquí.
          </Text>
        </Text>
      </View>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  background: { flex: 1, justifyContent: 'center' },
  container: {
    backgroundColor: COLORS.darkGreen,
    margin: 20,
    borderRadius: 20,
    padding: 25,
  },
  title: {
    color: COLORS.white,
    fontSize: 28,
    textAlign: 'center',
    fontWeight: 'bold',
  },
  subtitle: {
    color: COLORS.lightGreen,
    textAlign: 'center',
    marginBottom: 20,
  },
  input: {
    backgroundColor: COLORS.white,
    borderRadius: 10,
    padding: 12,
    marginVertical: 10,
  },
  button: {
    backgroundColor: COLORS.mediumGreen,
    padding: 15,
    borderRadius: 10,
    marginTop: 10,
  },
  buttonText: { color: COLORS.white, textAlign: 'center', fontWeight: 'bold' },
  bottomText: { color: COLORS.white, marginTop: 15, textAlign: 'center' },
  link: { color: COLORS.lightGreen, textDecorationLine: 'underline' },
});
