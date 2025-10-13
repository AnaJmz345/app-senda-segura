import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { COLORS } from '../constants/colors';
import { useNavigation } from '@react-navigation/native';

export default function SuccessScreen() {
  const navigation = useNavigation();

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Registro exitoso</Text>
      <Text style={styles.subtitle}>¡Tu cuenta ha sido creada con éxito!</Text>
      <Text style={styles.subtitle}>Revisa tu correo para más detalles.</Text>

      <TouchableOpacity
        style={styles.button}
        onPress={() => navigation.navigate('Login')}
      >
        <Text style={styles.buttonText}>Continuar</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.darkGreen,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  title: { color: COLORS.white, fontSize: 28, fontWeight: 'bold', marginBottom: 10 },
  subtitle: { color: COLORS.lightGreen, textAlign: 'center', marginBottom: 20 },
  button: {
    backgroundColor: COLORS.mediumGreen,
    padding: 15,
    borderRadius: 10,
    width: '80%',
  },
  buttonText: { color: COLORS.white, textAlign: 'center', fontWeight: 'bold' },
});
