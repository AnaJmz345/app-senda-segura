import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { useAuth } from '../context/AuthContext';  // Para obtener el perfil del usuario

export default function TopMenu({navigation}) {
  
  const route = useRoute();
  const { profile } = useAuth(); // Obtener el perfil del usuario autenticado

  // Verificar el rol del usuario y adaptar el menú
  const isBiker =true;
  const isParamedic = profile?.role === 'paramedic';
  const isAdmin = profile?.role === 'admin';
  

  return (
    <View style={styles.header}>
      <Image
        source={{ uri: 'https://t3.ftcdn.net/jpg/11/78/12/32/360_F_1178123231_ouiY0cWqrOEFCYmoiJFeBc6oMVv9DBbL.jpg' }}
        style={styles.headerImage}
      />

      <View style={styles.menuContainer}>
        {/* Menú para el Ciclista */}
        {isBiker && (
          <>
            <TouchableOpacity onPress={() => navigation.navigate('BikerMapScreen')}>
              <Text
                style={[
                  styles.menuText,
                  route.name === 'BikerMapScreen' && styles.activeText,
                ]}
              >
                Mapa
              </Text>
            </TouchableOpacity>

            <TouchableOpacity onPress={() => navigation.navigate('BikerProfileScreen')}>
              <Text
                style={[
                  styles.menuText,
                  route.name === 'BikerProfileScreen' && styles.activeText,
                ]}
              >
                Perfil
              </Text>
            </TouchableOpacity>
          </>
        )}

        {/* Menú para el Paramédico */}
        {isParamedic && (
          <>
            <TouchableOpacity onPress={() => navigation.navigate('ParamedicProfileScreen')}>
              <Text
                style={[
                  styles.menuText,
                  route.name === 'ParamedicProfileScreen' && styles.activeText,
                ]}
              >
                Perfil
              </Text>
            </TouchableOpacity>

            <TouchableOpacity onPress={() => navigation.navigate('ActiveBikersScreen')}>
              <Text
                style={[
                  styles.menuText,
                  route.name === 'ActiveBikersScreen' && styles.activeText,
                ]}
              >
                Rutas
              </Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => navigation.navigate('CasesHistory')}>
              <Text
                style={[
                  styles.menuText,
                  route.name === 'CasesHistory' && styles.activeText,
                ]}
              >
                Historial
              </Text>
            </TouchableOpacity>
          </>
        )}

        {/* Menú para el Administrador */}
        {isAdmin && (
          <>
            <TouchableOpacity onPress={() => navigation.navigate('AdminMapScreen')}>
              <Text
                style={[
                  styles.menuText,
                  route.name === 'AdminMapScreen' && styles.activeText,
                ]}
              >
                Mapa
              </Text>
            </TouchableOpacity>

            <TouchableOpacity onPress={() => navigation.navigate('AdminProfileScreen')}>
              <Text
                style={[
                  styles.menuText,
                  route.name === 'AdminProfileScreen' && styles.activeText,
                ]}
              >
                Perfil
              </Text>
            </TouchableOpacity>
          </>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    width: '100%',
    height: 160,
    position: 'relative',
  },
  headerImage: {
    width: '100%',
    height: '100%',
  },
  menuContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 50,
  },
  menuText: {
    color: '#3A3A3A',
    fontSize: 20,
    fontWeight: '400',
  },
  activeText: {
    fontWeight: '600',
    textDecorationLine: 'underline',
  },
});
