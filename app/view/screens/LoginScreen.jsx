import React, { useState } from 'react';
import { 
  View, 
  Text, 
  TextInput, 
  TouchableOpacity, 
  StyleSheet, 
  ImageBackground, 
  Image, 
  KeyboardAvoidingView, 
  Platform, 
  Alert, 
  ActivityIndicator 
} from 'react-native';
import { COLORS } from '../constants/colors';
import { useNavigation } from '@react-navigation/native';
import { supabase } from '../lib/supabase';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function LoginScreen() {
  const navigation = useNavigation();
  const [email, setEmail] = useState('');
  const [pwd, setPwd] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    if (!email || !pwd) {
      Alert.alert('Faltan datos', 'Por favor ingresa tu email y contraseña');
      return;
    }
    try {
      setLoading(true);
      const { data, error } = await supabase.auth.signInWithPassword({ email, password: pwd });
      if (error) throw error;

      const user = data?.user;
      if (!user) throw new Error('No se pudo obtener el usuario');

      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('display_name, role')
        .eq('id', user.id)
        .single();

      if (profileError) throw profileError;

      const nombre = profile?.display_name || 'usuario';
      const rol = profile?.role || 'biker';
      const rolTexto = 
        rol === 'paramedic'
          ? 'Paramédico'
          : rol === 'admin'
          ? 'Administrador'
          : 'Ciclista';

      Alert.alert('¡Bienvenido!', `Hola ${nombre}, tu rol es ${rolTexto}.`);
    } catch (e) {
      Alert.alert('Error en inicio de sesión', e.message ?? 'Revisa tus datos');
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
          <View style={styles.container} testID="login-container">
            <Image 
              source={require('../../../assets/logo_SendaSegura.png')} 
              style={styles.logoImage} 
              resizeMode="contain"
              testID="logo-image"
            />

            <Text style={styles.title} testID="login-title">Inicio de sesión</Text>
            <Text style={styles.subtitle}>Bienvenido de vuelta</Text>

            <TextInput
              testID="input-email"
              placeholder="Email"
              style={styles.input}
              placeholderTextColor="#ccc"
              value={email}
              onChangeText={setEmail}
              autoCapitalize="none"
              keyboardType="email-address"
            />
            <TextInput
              testID="input-password"
              placeholder="Contraseña"
              style={styles.input}
              placeholderTextColor="#ccc"
              value={pwd}
              onChangeText={setPwd}
              secureTextEntry
            />

            <TouchableOpacity 
              testID="button-login"
              style={styles.button} 
              onPress={handleLogin} 
              disabled={loading}
            >
              {loading ? (
                <ActivityIndicator color="#fff" testID="login-loading" />
              ) : (
                <Text style={styles.buttonText}>Iniciar sesión</Text>
              )}
            </TouchableOpacity>

            <View style={styles.separator} />
            <Text style={styles.iniciarCon}>Iniciar sesión con</Text>
            <Image 
              source={require('../../../assets/google_g_logo.png')} 
              style={styles.googleLogo} 
              resizeMode="contain" 
              testID="google-login"
            />

            <Text style={styles.bottomText}>
              ¿No tienes una cuenta?{' '}
              <Text 
                style={styles.link} 
                testID="link-register"
                onPress={() => navigation.navigate('Register')}
              >
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
  background: { 
    flex: 1, 
    justifyContent: 'center' 
  },
  container: { 
    backgroundColor: COLORS.darkGreen, 
    margin: 20, 
    borderRadius: 20, 
    padding: 25, 
    alignItems: 'center' 
  },
  logoImage: {
    width: 190,
    height: 190,
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
    marginVertical: 10, 
    width: 250,
    fontSize: 15, 
    color: COLORS.darkGreen
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
  iniciarCon: { 
    color: COLORS.lightGreen, 
    fontSize: 14 
  },
  googleLogo: { 
    width: 39, 
    height: 39, 
    marginVertical: 5 
  },
  bottomText: { 
    color: COLORS.white, 
    marginTop: 15, 
    textAlign: 'center' 
  },
  link: { 
    color: COLORS.lightGreen, 
    textDecorationLine: 'underline' 
  },
});
