import React from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import { COLORS } from '../constants/colors';
import { useNavigation } from '@react-navigation/native';

export default function RegisterScreen() {
  const navigation = useNavigation();

  return (
    <ScrollView style={{ flex: 1, backgroundColor: COLORS.darkGreen }}>
      <View style={styles.container}>
        <Text style={styles.title}>Registro</Text>
        <Text style={styles.subtitle}>Crea tu cuenta si eres un nuevo usuario</Text>

        <TextInput placeholder="Nombre" style={styles.input} placeholderTextColor="#ccc" />
        <TextInput placeholder="Apellido(s)" style={styles.input} placeholderTextColor="#ccc" />
        <TextInput placeholder="Email" style={styles.input} placeholderTextColor="#ccc" />
        <TextInput placeholder="Contraseña" secureTextEntry style={styles.input} placeholderTextColor="#ccc" />
        <TextInput placeholder="Fecha de nacimiento" style={styles.input} placeholderTextColor="#ccc" />

        <TouchableOpacity
          style={styles.button}
          onPress={() => navigation.navigate('Success')}
        >
          <Text style={styles.buttonText}>Registrarse</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { padding: 25 },
  title: { fontSize: 28, color: COLORS.white, textAlign: 'center', fontWeight: 'bold' },
  subtitle: { color: COLORS.lightGreen, textAlign: 'center', marginBottom: 20 },
  input: {
    backgroundColor: COLORS.white,
    borderRadius: 10,
    padding: 12,
    marginVertical: 8,
  },
  button: {
    backgroundColor: COLORS.mediumGreen,
    padding: 15,
    borderRadius: 10,
    marginTop: 10,
  },
  buttonText: { color: COLORS.white, textAlign: 'center', fontWeight: 'bold' },
});
