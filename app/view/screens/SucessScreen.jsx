import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Image, ImageBackground } from 'react-native';
import { COLORS } from '../constants/colors';
import LottieView from 'lottie-react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function SuccessScreen({navigation}) {
  

  return (
    <ImageBackground source={require('../../../assets/bosqueprimavera2.jpg')} style={{ flex: 1 }} blurRadius={6}>
      <SafeAreaView style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <View style={styles.card}>
          <Image source={require('../../../assets/logo_SendaSegura.png')} style={styles.logoImage} resizeMode="contain" />
          <Text style={styles.title}>Registro exitoso</Text>
          <Text style={styles.subtitle}>¡Tu cuenta ha sido creada con éxito!</Text>
          <Text style={styles.subtitle2}>Revisa tu correo electrónico para más detalles</Text>
          <LottieView
            source={require('../../../assets/lottie/Checkmark.json')}
            autoPlay
            loop={false}
            style={styles.lottie}
          />
          <TouchableOpacity
            style={styles.button}
            onPress={() => navigation.navigate('Home')}
          >
            <Text style={styles.buttonText}>Continuar</Text>
          </TouchableOpacity>
          <View style={styles.separator}/>
        </View>
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
    alignItems: 'center',
    marginTop: 32,
    marginBottom: 28,
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
    marginBottom: 4,
    fontSize: 15,
    marginTop: 2,
  },
  subtitle2: {
    color: COLORS.lightGreen,
    textAlign: 'center',
    marginBottom: 12,
    fontSize: 14,
    marginTop: 2,
  },
  lottie: {
    width: 112,
    height: 112,
    marginVertical: 14,
    alignSelf: 'center'
  },
  button: {
    backgroundColor: COLORS.mediumGreen,
    padding: 15,
    borderRadius: 13,
    marginTop: 6,
    width: 220,
  },
  buttonText: { color: COLORS.white, textAlign: 'center', fontWeight: 'bold', fontSize: 16 },
  separator: {
    marginTop: 14,
    borderBottomColor: '#fff',
    borderBottomWidth: 1,
    alignSelf: 'stretch',
    width: 200,
    opacity: 0.22,
  },
});
