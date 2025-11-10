import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ImageBackground, Image, KeyboardAvoidingView, Platform, Alert } from 'react-native';
import { COLORS } from '../constants/colors';
import { useNavigation } from '@react-navigation/native';
import { supabase } from '../lib/supabase';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function LoginScreen() {
  const navigation = useNavigation();
  const [email, setEmail] = useState('');
  const [pwd, setPwd] = useState('');

  const handleLogin = async () => {
    if (!email || !pwd) {
      Alert.alert('Faltan datos', 'Por favor ingresa tu email y contraseña');
      return;
    }
    try {
      const { data, error } = await supabase.auth.signInWithPassword({ email, password: pwd });
      if (error) throw error;
      /*Alert.alert('¡Bienvenido!', 'Has iniciado sesión correctamente.', [
        { text: 'OK', onPress: () => navigation.navigate('Home') }
      ]);*/
      Alert.alert('¡Bienvenido!', 'Has iniciado sesión correctamente.');
    } catch (e) {
      Alert.alert('Error en inicio de sesión', e.message ?? 'Revisa tus datos');
    }
  };

  return (
    <ImageBackground source={require('../../../assets/bosqueprimavera2.jpg')} style={{ flex: 1 }} blurRadius={6}>
      <SafeAreaView style={{ flex: 1 }}>
        <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : "height"} style={{ flex: 1 }}>
          <View style={styles.card}>
            <Image source={require('../../../assets/logo_SendaSegura.png')} style={styles.logoImage} resizeMode="contain" />
            <Text style={styles.title}>Inicio de sesión</Text>
            <Text style={styles.subtitle}>Bienvenido de vuelta</Text>
            <TextInput placeholder="Email" style={styles.input} placeholderTextColor="#ccc"
              value={email} onChangeText={setEmail} autoCapitalize="none" keyboardType="email-address" />
            <TextInput placeholder="Contraseña" style={styles.input} placeholderTextColor="#ccc"
              value={pwd} onChangeText={setPwd} secureTextEntry />
            <TouchableOpacity style={styles.button} onPress={handleLogin}>
              <Text style={styles.buttonText}>Iniciar sesión</Text>
            </TouchableOpacity>
            <View style={styles.separator}/>
            <Text style={styles.iniciarCon}>Iniciar sesión con</Text>
            <Image source={require('../../../assets/google_g_logo.png')} style={styles.googleLogo} resizeMode="contain" />
            <Text style={styles.bottomText}>
              ¿No tienes una cuenta?{' '}
              <Text style={styles.link} onPress={() => navigation.navigate('Register')}>
                Regístrate aquí.
              </Text>
            </Text>
          </View>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: COLORS.darkGreen,
    borderRadius: 36,
    padding: 28,
    width: 350,
    alignSelf: 'center',
    alignItems: 'center',
    shadowColor: '#000', shadowOpacity: 0.18, shadowRadius: 14, elevation: 8,
    marginTop: 32,
    marginBottom: 26,
  },
  logoImage: {
    width: 86,
    height: 86,
    marginTop: -52,
    marginBottom: 0,
    alignSelf: 'center',
  },
  title: {
    fontSize: 29,
    color: COLORS.white,
    textAlign: 'center',
    fontWeight: 'bold',
    marginTop: -10,
    marginBottom: 2,
  },
  subtitle: {
    color: COLORS.lightGreen,
    textAlign: 'center',
    marginBottom: 13,
    fontSize: 15,
  },
  input: {
    backgroundColor: COLORS.white,
    borderRadius: 12,
    padding: 12,
    marginVertical: 6,
    width: 245,
    fontSize: 15,
    color: COLORS.darkGreen,
  },
  button: {
    backgroundColor: COLORS.mediumGreen,
    padding: 15,
    borderRadius: 13,
    marginTop: 13,
    width: 220,
  },
  buttonText: { color: COLORS.white, textAlign: 'center', fontWeight: 'bold', fontSize: 16 },
  separator: {
    marginTop: 18,
    marginBottom: 7,
    borderBottomColor: '#fff',
    borderBottomWidth: 1,
    alignSelf: 'stretch',
    width: 200,
    opacity: 0.37,
  },
  iniciarCon: {
    color: COLORS.lightGreen,
    fontSize: 14,
    marginBottom: 0,
    marginTop: 0,
  },
  googleLogo: {
    width: 39,
    height: 39,
    marginVertical: 5,
  },
  bottomText: { color: COLORS.white, marginTop: 12, textAlign: 'center', fontSize: 13 },
  link: { color: COLORS.lightGreen, textDecorationLine: 'underline', fontWeight: 'bold' },
});
