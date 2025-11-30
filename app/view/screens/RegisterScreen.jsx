//import { logInfo, logWarn, logError } from '../../utils/logger';

import React, { useState } from 'react';
import { 
  View, 
  Text, 
  TextInput, 
  TouchableOpacity, 
  StyleSheet, 
  ImageBackground, 
  Image, 
  ScrollView, 
  KeyboardAvoidingView, 
  Platform, 
  Alert, 
  ActivityIndicator 
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
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
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleRegister = async () => {
    if (!name || !lastName || !email || !pwd || !birth) {
      Alert.alert('Faltan datos', 'Por favor llena todos los campos');
      return;
    }
    try {
      setLoading(true);
      const { data: signUpData, error } = await supabase.auth.signUp({
        email,
        password: pwd,
      });

      if (error) throw error;

      const userId = signUpData?.user?.id;
      if (!userId) {
        throw new Error('No se pudo obtener el ID del usuario.');
      }

      // Crea la fila en profiles (rol por defecto 'biker')
      /*const display_name = `${name} ${lastName}`.trim();
      const { error: pErr } = await supabase.from('profiles').insert({
        id: userId,
        display_name,
        birthdate: birth,
      });*/
      //if (pErr) throw pErr;

      navigation.navigate('Success');
    } catch (e) {
      Alert.alert('Error en registro', e.message ?? 'Intenta de nuevo');
    } finally {
      setLoading(false);
    }
  };

  return (
    <ImageBackground 
      source={require('../../../assets/bosqueprimavera2.jpg')} 
      style={styles.background}
    >
      <SafeAreaView style={{ flex: 1 }}>
        <KeyboardAvoidingView 
          behavior={Platform.OS === "ios" ? "padding" : "height"} 
          style={{ flex: 1, justifyContent: 'center' }}
        >
          <ScrollView 
            contentContainerStyle={styles.scrollContent} 
            keyboardShouldPersistTaps="handled"
          >
            <View style={styles.container}>
              <Image 
                source={require('../../../assets/logo_SendaSegura.png')} 
                style={styles.logoImage} 
                resizeMode="contain" 
              />
              <Text style={styles.title}>Registro</Text>
              <Text style={styles.subtitle}>Crea tu cuenta si eres un nuevo usuario</Text>

              <TextInput 
                placeholder="Nombre" 
                value={name} 
                onChangeText={setName} 
                style={styles.input} 
                placeholderTextColor="#ccc" 
              />
              <TextInput 
                placeholder="Apellido(s)" 
                value={lastName} 
                onChangeText={setLastName} 
                style={styles.input} 
                placeholderTextColor="#ccc" 
              />
              <TextInput 
                placeholder="Email" 
                value={email} 
                onChangeText={setEmail} 
                autoCapitalize="none" 
                keyboardType="email-address" 
                style={styles.input} 
                placeholderTextColor="#ccc" 
              />
              <View style={styles.passwordContainer}>
                <TextInput 
                  placeholder="Contraseña" 
                  value={pwd} 
                  onChangeText={setPwd} 
                  secureTextEntry={!showPassword}
                  style={styles.passwordInput} 
                  placeholderTextColor="#ccc" 
                />
                <TouchableOpacity 
                  onPress={() => setShowPassword(!showPassword)}
                  style={styles.eyeIcon}
                >
                  <Ionicons 
                    name={showPassword ? "eye-off" : "eye"} 
                    size={24} 
                    color={COLORS.darkGreen} 
                  />
                </TouchableOpacity>
              </View>
              <TextInput 
                placeholder="Fecha de nacimiento" 
                value={birth} 
                onChangeText={setBirth} 
                style={styles.input} 
                placeholderTextColor="#ccc" 
              />

              <TouchableOpacity 
                style={styles.button} 
                onPress={handleRegister} 
                disabled={loading}
              >
                {loading ? (
                  <ActivityIndicator color="#fff" />
                ) : (
                  <Text style={styles.buttonText}>Registrarse</Text>
                )}
              </TouchableOpacity>

              <View style={styles.separator} />
              <Text style={styles.registrateCon}>Regístrate con</Text>
              <Image 
                source={require('../../../assets/google_g_logo.png')} 
                style={styles.googleLogo} 
                resizeMode="contain" 
              />
              <Text style={styles.avisoText}>
                Al registrarte aceptas nuestro{' '}
                <Text style={styles.privacidadLink}>Aviso de Privacidad.</Text>
              </Text>
            </View>
          </ScrollView>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  background: { 
    flex: 1, 
    justifyContent: 'center' 
  },
  scrollContent: { 
    flexGrow: 1, 
    justifyContent: 'center', 
    alignItems: 'center', 
    minHeight: 700 
  },
  container: { 
    backgroundColor: COLORS.darkGreen, 
    margin: 20, 
    borderRadius: 20, 
    padding: 35, 
    alignItems: 'center' 
  },
  logoImage: {
    width: 140,
    height: 140,
    marginTop: -40,
    marginBottom: -25,
    alignSelf: 'center',
  },
  title: { 
    color: COLORS.white, 
    fontSize: 28, 
    textAlign: 'center', 
    fontWeight: 'bold',
    marginTop: 5
  },
  subtitle: { 
    color: COLORS.lightGreen, 
    textAlign: 'center', 
    marginBottom: 20 
  },
  input: { 
    backgroundColor: COLORS.white, 
    borderRadius: 10, 
    padding: 12, 
    marginVertical: 8, 
    width: 250,
    fontSize: 15, 
    color: COLORS.darkGreen
  },
  passwordContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.white,
    borderRadius: 10,
    marginVertical: 8,
    width: 250,
  },
  passwordInput: {
    flex: 1,
    padding: 12,
    fontSize: 15,
    color: COLORS.darkGreen,
  },
  eyeIcon: {
    padding: 12,
  },
  button: { 
    backgroundColor: COLORS.mediumGreen, 
    padding: 15, 
    borderRadius: 10, 
    marginTop: 10, 
    width: 220 
  },
  buttonText: { 
    color: COLORS.white, 
    textAlign: 'center', 
    fontWeight: 'bold' 
  },
  separator: { 
    marginTop: 18, 
    marginBottom: 7, 
    borderBottomColor: '#fff', 
    borderBottomWidth: 1, 
    width: 200, 
    opacity: 0.37 
  },
  registrateCon: { 
    color: COLORS.lightGreen, 
    fontSize: 14 
  },
  googleLogo: { 
    width: 39, 
    height: 39, 
    marginVertical: 5 
  },
  avisoText: { 
    color: COLORS.white, 
    fontSize: 12, 
    marginTop: 6, 
    textAlign: 'center', 
    width: 215 
  },
  privacidadLink: { 
    color: COLORS.lightGreen, 
    textDecorationLine: 'underline' 
  }
});
