import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ImageBackground, Image, ScrollView, KeyboardAvoidingView, Platform, Alert } from 'react-native';
import { COLORS } from '../constants/colors';
import { useNavigation } from '@react-navigation/native';
import { supabase } from '../lib/supabase';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function RegisterScreen() {
  const navigation = useNavigation();
  const [name, setName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [pwd, setPwd] = useState('');
  const [birth, setBirth] = useState('');

  function toDateString(str) {
    if (!str) return null;
    const parts = str.split(/[\/\-]/);
    if (parts.length !== 3) return null;
    return `${parts[2]}-${parts[1].padStart(2,'0')}-${parts[0].padStart(2,'0')}`;
  }

  const handleRegister = async () => {
    if (!name || !lastName || !email || !pwd || !birth) {
      Alert.alert('Por favor llena todos los campos');
      return;
    }
    try {
      const { error } = await supabase.auth.signUp({
        email,
        password: pwd,
      });
      if (error) throw error;
      navigation.navigate('Success');
    } catch (e) {
      Alert.alert('Error en registro: ' + (e.message ?? 'Intenta de nuevo'));
    }
  };

  return (
    <ImageBackground source={require('../../../assets/bosqueprimavera2.jpg')} style={{ flex: 1 }} blurRadius={6}>
      <SafeAreaView style={{ flex: 1 }}>
        <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : "height"} style={{ flex: 1 }}>
          <ScrollView contentContainerStyle={styles.scrollContent} keyboardShouldPersistTaps="handled">
            <View style={styles.card}>
              <Image source={require('../../../assets/logo_SendaSegura.png')} style={styles.logoImage} resizeMode="contain" />
              <Text style={styles.title}>Registro</Text>
              <Text style={styles.subtitle}>Crea tu cuenta si eres un nuevo usuario</Text>
              <TextInput placeholder="Nombre" style={styles.input} placeholderTextColor="#ccc"
                value={name} onChangeText={setName} />
              <TextInput placeholder="Apellido(s)" style={styles.input} placeholderTextColor="#ccc"
                value={lastName} onChangeText={setLastName} />
              <TextInput placeholder="Email" style={styles.input} placeholderTextColor="#ccc"
                value={email} onChangeText={setEmail} autoCapitalize="none" keyboardType="email-address" />
              <TextInput placeholder="Contraseña" style={styles.input} placeholderTextColor="#ccc"
                value={pwd} onChangeText={setPwd} secureTextEntry />
              <TextInput placeholder="Fecha de nacimiento" style={styles.input} placeholderTextColor="#ccc"
                value={birth} onChangeText={setBirth} />
              <TouchableOpacity style={styles.button} onPress={handleRegister}>
                <Text style={styles.buttonText}>Registrarse</Text>
              </TouchableOpacity>
              <View style={styles.separator}/>
              <Text style={styles.registrateCon}>Regístrate con</Text>
              <Image source={require('../../../assets/google_g_logo.png')} style={styles.googleLogo} resizeMode="contain" />
              <Text style={styles.avisoText}>Al registrarte aceptas nuestro <Text style={styles.privacidadLink}>Aviso de Privacidad.</Text></Text>
            </View>
          </ScrollView>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  scrollContent: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
    minHeight: 650,
  },
  card: {
    backgroundColor: COLORS.darkGreen,
    borderRadius: 36,
    padding: 28,
    width: 350,
    alignSelf: 'center',
    alignItems: 'center',
    shadowColor: '#000', shadowOpacity: 0.18, shadowRadius: 14, elevation: 8,
    marginTop: 24,
    marginBottom: 22,
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
    marginBottom: 14,
    fontSize: 14,
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
    marginTop: 14,
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
  registrateCon: {
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
  avisoText: {
    color: COLORS.white,
    fontSize: 12,
    marginTop: 6,
    textAlign: 'center',
    width: 215,
  },
  privacidadLink: {
    color: COLORS.lightGreen,
    textDecorationLine: 'underline',
  },
});
